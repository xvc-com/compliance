import dayjs from "dayjs";

const MONTH = "month";

export const 获取上月 = () => {
  return dayjs().subtract(1, MONTH);
};

export const 获取月的时间范围 = (date) => {
  return [date.startOf(MONTH).unix(), date.endOf(MONTH).unix()];
};
