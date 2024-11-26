const API_KEY = "HPEBPWFPNU5aP2sWiDsis74HI7uXTgtj7VuPsG2o";
export const fetchDatabases = async () => {
  const response = await fetch(
    "https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/get-databases",
    {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

export const fetchDatabaseByIds = async (ids) => {
  try {
    const body = JSON.stringify({ ids });
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      mode: "no-cors",
      body,
    };

    const response = await fetch(
      "https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/get-database-by-ids",
      options
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching database by IDs:", error);
    throw error;
  }
};

export const fetchMetricsData = async (startDate, endDate) => {
  try {
    const body = JSON.stringify({ startDate, endDate });
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body,
    };

    const response = await fetch(
      "https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/get-metrices",
      options
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching metrics data:", error);
    throw error;
  }
};
