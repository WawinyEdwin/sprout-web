export const formatValue = (key: string, value: number) => {
  if (
    key.includes("revenue") ||
    key.includes("income") ||
    key.includes("profit") ||
    key.includes("expense") ||
    key.includes("cost") ||
    key.includes("value") ||
    key.includes("amount") ||
    key.includes("cac") ||
    key.includes("cltv") ||
    key.includes("aov") ||
    key.includes("mrr") ||
    key.includes("roas")
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  }

  if (
    key.includes("rate") ||
    key.includes("margin") ||
    key.includes("growth") ||
    key.includes("ctr") ||
    key.includes("bounce") ||
    key.includes("conversion") ||
    key.includes("engagement") ||
    key.includes("retention") ||
    key.includes("churn") ||
    key.includes("roi") ||
    key.includes("share")
  ) {
    return `${value.toFixed(2)}%`;
  }

  if (key.includes("duration") || key.includes("time")) {
    if (value < 60) return `${value.toFixed(1)}s`;
    if (value < 3600) return `${(value / 60).toFixed(1)}m`;
    return `${(value / 3600).toFixed(1)}h`;
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toLocaleString();
};
