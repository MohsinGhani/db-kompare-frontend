export const fetchDatabases = async () => {
  const response = await fetch(
    "https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/get-databases"
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return await response.json();
};

export const fetchDatabaseByIds = async (ids) => {
  try {
    const body = JSON.stringify({ ids });
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    };
    return await fetchData("/get-database-by-ids", options);
  } catch (error) {
    console.error("Error fetching database by IDs:", error);
    throw error;
  }
};

