export const getInitials = (name) => {
  if (!name) return "";

  const nameArray = name.trim().split(" ");

  // If the name has at least two parts, take the first letter of the first two parts
  if (nameArray.length >= 2) {
    return (
      nameArray[0].charAt(0).toUpperCase() +
      nameArray[1].charAt(0).toUpperCase()
    );
  }

  // If the name has only one part, take the first two letters
  if (nameArray.length === 1) {
    return nameArray[0].slice(0, 2).toUpperCase();
  }
  return "";
};
