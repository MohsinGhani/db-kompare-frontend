// Calculate the weighted value for a chart based on metric keys
export const calculateChartWeightedValue = (metric, metricKeys) => {
  return metricKeys?.reduce((sum, key) => {
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
