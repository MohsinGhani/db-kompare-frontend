// utils/chartUtils.js
export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  end.setHours(23, 59, 59, 999);

  return !startDate || !endDate || (d >= start && d <= end);
};
export const styleFirstWord = (title) => {
  const words = title.split(" "); // Split the title by spaces
  const firstWord = words[0]; // Get the first word
  const restOfTheTitle = words.slice(1).join(" "); // Join the rest of the words

  return (
    <>
      <span style={{ color: "#3E53D7" }}>{firstWord}</span> {restOfTheTitle}
    </>
  );
};
