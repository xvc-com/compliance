#! /usr/bin/env bun
import docx from "../docx.js";
import dayjs from "dayjs";

const 内容 = `
# 重构测试
测试 GitHub 风格换行。
这一行紧跟上一行。

| 标题1 | 标题2 |
| --- | --- |
| 内容1 | 内容2 |
`;

console.log("正在执行重构后的回归测试...");
const 链接 = await docx(内容, dayjs("2026-02"));
console.log("测试成功！新文档链接：", 链接);
