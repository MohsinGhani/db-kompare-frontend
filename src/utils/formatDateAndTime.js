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

// Utility function for getting previous day's date in YYYY-MM-DD format
export const getPreviousDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split("T")[0];
};

// utils/getPreviousDates.js
export function getPreviousDates() {
  const now = new Date();
  const referenceTime = new Date(now.toISOString());
  referenceTime.setUTCHours(12, 0, 0, 0);

  const adjustDate = (days) =>
    new Date(now.setUTCDate(now.getUTCDate() - days));

  let previousDates = [];
  if (now < referenceTime) {
    previousDates = [2, 1, 1];
  } else {
    previousDates = [1, 1, 1];
  }

  return previousDates.map((days) => formatPreDate(adjustDate(days)));
}

// Helper function to format the date into 'YYYY-MM-DD'
function formatPreDate(date) {
  return date.toISOString().split("T")[0];
}

export const formatDateForHeader = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear().toString().slice(-2);

  const suffixes = ["th", "st", "nd", "rd"];
  const suffix =
    day % 10 <= 3 && ![11, 12, 13].includes(day % 100)
      ? suffixes[day % 10]
      : suffixes[0];

  return `${day}${suffix} ${month}, ${year}`;
};
