const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;
const API_BASE_URL_2 = process.env.NEXT_PUBLIC_API_BASE_URL_2;

// Helper function to fetch data from the API

// This function is used by all other functions to send the request and handle the response

const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  return await response.json();
};

// Function to fetch all comments

export const fetchCommentsData = async (selectedDatabaseIds) => {
  return fetchAPI(`${API_BASE_URL_2}/get-comments`, {
    method: "POST",
    headers: {
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify({
      ids: selectedDatabaseIds,
    }),
  });
};

// Function to add comment

export const addComment = async (payload) => {
  return fetchAPI(`${API_BASE_URL_2}/create-comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(payload),
  });
};

// Function to delete comment

export const deleteComment = async (payload) => {
  return fetchAPI(`${API_BASE_URL_2}/delete-comment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(payload),
  });
};

//Function to change comment status

export const updateCommentStatus = async (payload) => {
  return fetchAPI(`${API_BASE_URL_2}/update-comment-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(payload),
  });
};

//Function to update comment

export const updateComment = async (payload) => {
  return fetchAPI(`${API_BASE_URL_2}/update-comment`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify(payload),
  });
};
