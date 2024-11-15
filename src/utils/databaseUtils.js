export const fetchDatabases = async () => {
  const response = await fetch(
    "https://3ntybiotjh.execute-api.eu-west-1.amazonaws.com/get-databases"
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return await response.json();
};

export const processText = (html, isSupportedLanguages = false) => {
  const styledHtml = html?.replace(
    /<a(.*?)>/g,
    '<a$1 style="color: blue; text-decoration: none;" >'
  );
  return styledHtml?.replace(/, /g, ", <br />");
};

// const renderInfoIcon = () => {
//   return `<svg viewBox="64 64 896 896" focusable="false" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
//        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
//        <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
//      </svg>`;
// };
