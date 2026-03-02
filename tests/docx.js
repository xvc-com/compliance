#!/usr/bin/env bun

import docx from "../docx.js";
import { 获取上月 } from "../time.js";

const md = `
| 主体 | 事项 | 款项 | 附件 |
| :--- | :--- | :--- | :--- |
| 公司A | 采购服务器 | 10000 CNY | [发票.pdf] |
| 公司B | 租赁办公室 | 50000 CNY | [合同.pdf] |
`;

try {
  console.log("正在测试 docx 模块...");
  const month = 获取上月();
  const docId = await docx(md, month);
  console.log("测试成功！新文档 ID:", docId);
} catch (e) {
  console.error("测试失败:", e.message);
  if (e.response && e.response.data) {
    console.error("错误详情:", JSON.stringify(e.response.data, null, 2));
  }
}
