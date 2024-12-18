const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DATABASE_API_URL = process.env.NEXT_PUBLIC_DATABASE_API_URL;

// Helper function to fetch data from the API

// This function is used by all other functions to send the request and handle the response

const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  return await response.json();
};

// Function to fetch all databases

export const fetchDatabases = async () => {
  return fetchAPI(`${DATABASE_API_URL}/get-databases`, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });
};

// Function to fetch database by IDs'

export const fetchDatabaseByIds = async (ids) => {
  return fetchAPI(`${DATABASE_API_URL}/get-database-by-ids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ ids }),
  });
};

// Function to fetch metrics data

export const fetchMetricsData = async (startDate, endDate) => {
  return fetchAPI(`${DATABASE_API_URL}/get-metrices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ startDate, endDate }),
  });
};

// Function to fetch the count of databases

export const fetchDatabasesCount = async () => {
  return fetchAPI(`${DATABASE_API_URL}/get-databases-count`, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });
};

// Function to fetch the ranking of databases

export const fetchDatabaseRanking = async (startDate, endDate) => {
  return fetchAPI(`${DATABASE_API_URL}//get-rankings`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ startDate, endDate }),
  });
};
