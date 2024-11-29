export const Navlinks = [
  { href: "/", label: "Home" },
  { href: "/leader-board", label: "DB Leaderboard" },
  { href: "/db-comparisons/list", label: "DB Comparison" },
  { href: "https://dataeli5.substack.com/", label: "DB INTERNALS" },
  { href: "#", label: "API" },
];

export const DropdownOptions = [
  { value: "githubScore", label: "Github" },
  { value: "stackoverflowScore", label: "Stack Overflow" },
  { value: "googleScore", label: "Google Search" },
  { value: "bingScore", label: "Bing Search" },
];

export const calculateChartWeightedValue = (metric, metricKeys) => {
  return metricKeys?.reduce((sum, key) => {
    console.log(key, "key");
    const value = metric.ui_popularity[key];
    if (value === undefined || value === null) {
      console.warn(`Key "${key}" does not exist for metric:`, metric);
      return sum;
    }

    let weightedValue = 0;

    switch (key) {
      case "googleScore":
        weightedValue = value * 0.2;
        break;
      case "bingScore":
        weightedValue = value * 0.1;
        break;
      case "githubScore":
        weightedValue = value * 0.4;
        break;
      case "stackoverflowScore":
        weightedValue = value * 0.3;
        break;
      default:
        weightedValue = value;
        break;
    }

    return sum + weightedValue;
  }, 0);
};
