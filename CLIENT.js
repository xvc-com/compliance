import { Client } from "@larksuiteoapi/node-sdk";
import { FEISHU_APP, FEISHU_SK } from "./conf/FEISHU.js";

export default new Client({
  appId: FEISHU_APP,
  appSecret: FEISHU_SK,
});
