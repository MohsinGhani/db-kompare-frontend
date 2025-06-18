// This File for PRACTICE SQL QUESTIONS

// ——————————————————————————————
// PRACICE SQL QUESTIONS
// ——————————————————————————————


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

export const fetchQuestions = async () => {
  const url = `${API_BASE_URL_1}/get-questions`;

  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};

export const fetchTags = async () => {
  const url = `${API_BASE_URL_1}/get-tags`;

  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};

export const fetchSubmissions = async (queryParams = {}) => {
  // Create a query string from the queryParams object
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${API_BASE_URL_1}/get-submissions${
    queryString ? `?${queryString}` : ""
  }`;

  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};
export const fetchUserSubmissions = async (userId) => {
  const url = `${API_BASE_URL_1}/get-user-submissions?userId=${userId}`;
  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};

export const fetchSubmissionProgress = async (userId) => {
  const url = `${API_BASE_URL_1}/get-submission-progress?userId=${userId}`;
  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};

export const fetchQuestionDetail = async (id) => {
  const url = `${API_BASE_URL_1}/question/${id}`;

  return fetchAPI(url, {
    method: "GET",
    headers: {
      "x-api-key": X_API_KEY,
    },
  });
};
