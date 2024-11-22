export const fetchDatabases = async () => {
  const response = await fetch(
    "https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/get-databases"
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return await response.json();
};

export const fetchDatabaseByIds = async (ids) => {
  try {
    // Prepare the request body
    const body = JSON.stringify({ ids }); // IDs array is passed here
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body, // Send the body with the array of IDs
    };

    // Call your API with the request options
    const response = await fetch(
      "https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/get-database-by-ids",
      options
    );

    // Ensure the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse and return the JSON data from the response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching database by IDs:", error);
    throw error; // Rethrow the error for further handling
  }
};

export const fetchMetricsData = async (startDate, endDate) => {
  console.log(startDate, endDate, "startDate, endDate");
  try {
    const body = JSON.stringify({ startDate, endDate });
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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