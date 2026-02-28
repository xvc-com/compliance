#!/usr/bin/env bun

import log from "./log.js";
import { 合规员 } from "./conf/FEISHU.js";
import getUserId from "./emailUid.js";
import { 查询已办审批 } from "./审批清单.js";
import { 获取上月 } from "./time.js";
import json2md from "./json2md.js";
import { markdownTable } from "markdown-table";
import removeEmptyColumns from "./清理空列.js";
import docx from "./docx.js";
import 通知 from "./通知.js";

await (async () => {
  const userId = getUserId(合规员),
    month = 获取上月(),
    md_li = [["主体", "事项", "款项", "附件"]];
  let count = 0;
  for await (const i of 查询已办审批(userId, month)) {
    md_li.push(await json2md(i));
    if (++count > 3) {
      break;
    }
  }

  const cleaned_li = removeEmptyColumns(md_li);
  const md = markdownTable(cleaned_li);
  log(md);

  const url = await docx(md, month);
  await 通知(url);
})();
