import CLIENT from "./CLIENT.js";
import int from "@3-/int";
import { 获取月的时间范围 } from "./time.js";
import log from "./log.js";

export const 查询已办审批 = async function* (用户ID, month) {
  const [begin, end] = 获取月的时间范围(month);

  for await (const { tasks } of await CLIENT.approval.v4.task.queryWithIterator({
    params: {
      user_id: 用户ID,
      user_id_type: "user_id",
      topic: "2", // 已经完成
      page_size: 100,
    },
  })) {
    for (const { process_code } of tasks) {
      const task = await CLIENT.approval.v4.instance.get({
        path: {
          instance_id: process_code,
        },
      });
      if (task.code) {
        log(task);
        continue;
      }
      const { data } = task,
        end_time = int(data.end_time / 1e3);

      if (data.status != "APPROVED") {
        continue;
      }

      log(new Date(+data.end_time));

      if (end_time < begin) {
        return;
      }

      // if (end_time > end) {
      //   continue;
      // }
      yield JSON.parse(data.form).map((item) => {
        let { type, name, value, ext, custom_id } = item;
        if (custom_id == "apply_title_id") {
          log(value);
          return value;
        }
        if (custom_id == "apply_detail_id") {
          if (name.startsWith("印章明细")) {
            return value.map(([{ name, value }]) => {
              return [name, value];
            });
          }
        }
        if (type == "attachmentV2") {
          return [name, ext];
        }
        if (type == "amount") {
          return [name, value, ext.currency];
        }
        if (type == "textarea") {
          if (name == "多行文本") {
            return value;
          }
        }
        const r = [name, value];
        if (ext) {
          r.push(ext);
        }
        return r;
      });
    }
  }
};
