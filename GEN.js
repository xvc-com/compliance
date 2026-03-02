#!/usr/bin/env bun
import { 观察者列表 } from "./conf/FEISHU.js";
import CLIENT from "./CLIENT.js";
import fs from "fs";
import path from "path";

const generateMap = async () => {
  const query_emails = Array.from(new Set(观察者列表));

  console.log(`正在获取以下邮箱的 User ID: ${query_emails.join(", ")}`);

  const response = await CLIENT.contact.v3.user.batchGetId({
    data: { emails: query_emails },
    params: { user_id_type: "user_id" },
  });

  if (response.code !== 0) {
    console.error("❌ 获取用户 ID 失败:", response.msg);
    return;
  }

  const EMAIL_UID = {};
  response.data.user_list.forEach((user) => {
    if (user.user_id) {
      EMAIL_UID[user.email] = user.user_id;
    }
  });

  const content = `export default ${JSON.stringify(EMAIL_UID, null, 2)};\n`;
  const file_path = path.join(import.meta.dirname, "conf/EMAIL_UID.js");

  fs.writeFileSync(file_path, content);

  console.log(`✅ 成功生成映射文件: ${file_path}`);
  console.log(content);
};

await generateMap();
