// Format date as YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Check if a date is within a given range
export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  end.setHours(23, 59, 59, 999);

  return !startDate || !endDate || (d >= start && d <= end);
};

// Style the first word of the title with a different color in ranking table
export const styleFirstWord = (title) => {
  const words = title.split(" ");
  const firstWord = words[0];
  const restOfTheTitle = words.slice(1).join(" ");

  return (
    <>
      <span style={{ color: "#3E53D7" }}>{firstWord}</span> {restOfTheTitle}
    </>
  );
};

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

// Utility function for getting previous day's date in YYYY-MM-DD format
export const getPreviousDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split("T")[0];
};

// Utility function to get previous 3 days in UTC
export const getPreviousThreeDays = () => {
  const today = new Date();

  const dates = [];
  for (let i = 1; i <= 3; i++) {
    const prevDate = new Date(today);
    prevDate.setUTCDate(today.getUTCDate() - i);
    dates.push(prevDate.toISOString().split("T")[0]);
  }

  return dates;
};
// Helper function to run a function  at 6 AM UTC

export const scheduleLogAtUTC6AM = () => {
  const now = new Date();

  const targetHour = 6;
  const targetMinute = 0;

  const currentUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
  const targetUTC = targetHour * 60 + targetMinute;

  let timeToWait = targetUTC - currentUTC;

  if (timeToWait <= 0) {
    timeToWait += 24 * 60;
  }

  setTimeout(() => {
    console.log("Running at 6 AM UTC!");

    // Now repeat this every 24 hours (setInterval)
    setInterval(() => {
      console.log("Previous Three Days:", getPreviousThreeDays());

      // return getPreviousThreeDays();
    }, 24 * 60 * 60 * 1000);
  }, timeToWait * 60 * 1000);
};
