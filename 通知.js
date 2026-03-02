import { 观察者列表 } from "./conf/FEISHU.js";
import CLIENT from "./CLIENT.js";
import getUserId from "./emailUid.js";

const batchNotify = async (emails, content) => {
  const user_ids = emails.map(getUserId).filter((id) => id);

  for (const receive_id of user_ids) {
    await CLIENT.im.v1.message.create({
      params: { receive_id_type: "user_id" },
      data: {
        receive_id,
        msg_type: "text",
        content: JSON.stringify({ text: content }),
      },
    });
  }
};

export default async (content) => {
  await batchNotify(观察者列表, content);
};
