import EMAIL_UID from "./conf/EMAIL_UID.js";

export default (email) => {
  const id = EMAIL_UID[email];
  if (!id) {
    console.error(`❌ 错误：在 ./EMAIL_UID.js 中未找到 ${email}, 请运行 ./GEN.js`);
  }
  return id;
};
