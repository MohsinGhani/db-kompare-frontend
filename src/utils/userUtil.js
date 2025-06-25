const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;
const API_BASE_URL_2 = process.env.NEXT_PUBLIC_API_BASE_URL_2;


const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  return await response.json();
};

// Function to process user achievement
export const processUserAchievement = async (payload) => {
  return fetchAPI(`${API_BASE_URL_2}/process-achievement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(payload),
  });
};

