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
    md_map = new Map();
  let count = 0;
  for await (const i of 查询已办审批(userId, month)) {
    const [类型, md] = await json2md(i);
    let md_li = md_map.get(类型);
    if (!md_li) {
      md_li = [["主体", "事项", "款项", "附件"]];
      md_map.set(类型, md_li);
    }

    md_li.push(md);
    if (++count > 3) {
      break;
    }
  }

  const md = md_map
    .entries()
    .map(([类型, li]) => {
      "## " + 类型 + "\n" + markdownTable(removeEmptyColumns(li));
    })
    .join("\n\n");

  log(md);

  const url = await docx(md, month);
  await 通知(url);
})();
