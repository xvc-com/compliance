const 检查_列_空 = (列表, 索引) => 列表.slice(1).every((行) => !行[索引]?.toString().trim());

export default (列表) => {
  if (!列表?.[0]) return 列表;

  const 待删_索引 = 列表[0].map((_, 索引) => 索引).filter((索引) => 检查_列_空(列表, 索引));

  return 待删_索引.length
    ? 列表.map((行) => 行.filter((_, 索引) => !待删_索引.includes(索引)))
    : 列表;
};
