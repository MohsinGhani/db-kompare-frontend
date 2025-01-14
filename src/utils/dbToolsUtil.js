const X_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;
const API_BASE_URL_1 = process.env.NEXT_PUBLIC_API_BASE_URL_1;

// Helper function to fetch data from the API

// This function is used by all other functions to send the request and handle the response

const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  return await response.json();
};

// Function to fetch all categories of db tools

export const fetchDbToolsCategories = async () => {
  return fetchAPI(`${API_BASE_URL_1}/get-dbtool-categories`, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};
