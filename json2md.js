import { dump } from "js-yaml";
import prepare from "./prepare.js";
import log from "./log.js";

export default async (i) => {
  const yml = dump(i, { lineWidth: -1 }),
    json = await prepare(yml),
    md = [];
  const 款项 = json.款项?.filter((i) => i.数额 != 0);
  log(yml + "\n\n", json);
  md.push(json.主体, json.事项);
  if (款项) {
    md.push(
      款项.map(({ 数额, 单位, 币种 }) => {
        return 币种 + 数额 + 单位;
      }),
    );
  } else {
    md.push("");
  }
  const 附件 = yml.includes("附件") ? json.附件 || [] : [];
  md.push(附件.join(" / "));
  return [json.类型, md];
};
