#!/usr/bin/env bun

import { 观察者列表 } from "./conf/FEISHU.js";
import CLIENT from "./CLIENT.js";
import emailUid from "./emailUid.js";
import fs from "fs";
import path from "path";

const 目录名 = "合规自动化",
  全路径 = path.join(import.meta.dirname, "conf/dir", 目录名 + ".js");

// 确保目录存在
if (!fs.existsSync(path.dirname(全路径))) {
  fs.mkdirSync(path.dirname(全路径), { recursive: true });
}

if (!fs.existsSync(全路径)) {
  await (async () => {
    console.log(`正在飞书云文档中创建文件夹: ${目录名}...`);

    // 用 CLIENT 创建文件夹
    // 根据调研，folder_token 为空字符串表示在“我的空间”根目录下创建
    const createRes = await CLIENT.drive.v1.file.createFolder({
      data: {
        name: 目录名,
        folder_token: "",
      },
    });

    if (createRes.code !== 0) {
      console.error("创建文件夹失败详情:", JSON.stringify(createRes, null, 2));
      throw new Error(`创建文件夹失败: ${createRes.msg} (Code: ${createRes.code})`);
    }

    const folderToken = createRes.data.token;
    console.log(`✅ 文件夹创建成功, Token: ${folderToken}`);

    // 分享文件夹的最高权限给 观察者列表 中的用户
    for (const email of 观察者列表) {
      const userId = emailUid(email);
      if (!userId) {
        console.warn(`跳过 ${email}: 未找到用户 ID，请确保已运行 ./GEN.js`);
        continue;
      }

      console.log(`正在为 ${email} (${userId}) 分配权限...`);
      const permRes = await CLIENT.drive.v1.permissionMember.create({
        path: {
          token: folderToken,
        },
        params: {
          type: "folder",
        },
        data: {
          member_type: "userid",
          member_id: userId,
          perm: "full_access",
        },
      });

      if (permRes.code !== 0) {
        console.error(`❌ 为 ${email} 分配权限失败: ${permRes.msg} (Code: ${permRes.code})`);
      } else {
        console.log(`✅ 为 ${email} 分配权限成功`);
      }
    }

    // 写入文件的ID字符串到全路径
    const content = `export default "${folderToken}"; // ${目录名}\n`;
    fs.writeFileSync(全路径, content);
    console.log(`✅ 已持久化文件夹 ID 到: ${全路径}`);

    return folderToken;
  })();
}
