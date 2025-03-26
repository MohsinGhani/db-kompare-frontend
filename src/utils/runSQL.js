const X_API_KEY = process.env.NEXT_PUBLIC_Z_API_KEY;
const API_BASE_URL_3 = process.env.NEXT_PUBLIC_API_BASE_URL_3;

export async function getUserFiddles(payload) {
  try {
    const response = await fetch(
      `${API_BASE_URL_3}/get-user-fiddles?userId=${payload}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": X_API_KEY,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error running query:", error);
    throw error; // or handle error gracefully
  }
}
export async function getSingleFiddle(payload) {
  try {
    const response = await fetch(`${API_BASE_URL_3}/get-fiddle/${payload}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": X_API_KEY,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error running query:", error);
    throw error; // or handle error gracefully
  }
}

export async function executeQuery(payload) {
  try {
    const response = await fetch(`${API_BASE_URL_3}/execute-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": X_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error running query:", error);
    throw error; // or handle error gracefully
  }
}
