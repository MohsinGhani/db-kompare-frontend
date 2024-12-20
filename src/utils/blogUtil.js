import { BlogStatus } from "./const";

const Y_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;
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

// Function to fetch blogs

export const fetchBlogsData = async () => {
  return fetchAPI(`${API_BASE_URL_1}/get-blogs?status=${BlogStatus.PUBLIC}`, {
    method: "GET",
    headers: {
      "x-api-key": Y_API_KEY,
    },
  });
};

// Function to add comment

export const addBlog = async (payload) => {
  return fetchAPI(`${API_BASE_URL_1}/create-blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": Y_API_KEY,
    },
    body: JSON.stringify(payload),
  });
};
