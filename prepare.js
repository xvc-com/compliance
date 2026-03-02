import retry from "@3-/retry";
import chat from "./chat.js";
import { load } from "js-yaml";
import read from "@3-/read";
import { join } from "node:path";

const 预处理 = load(read(join(import.meta.dirname, "prompt", "预处理.yml")));

export default retry(async (txt) =>
  chat("从以下yaml中按要求抽取json:\n" + txt, 预处理, "你是专业资深的信息抽取员"),
);
