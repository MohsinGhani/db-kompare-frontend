const X_API_KEY = process.env.NEXT_PUBLIC_Z_API_KEY;
const API_BASE_URL_3 = process.env.NEXT_PUBLIC_API_BASE_URL_3;

export async function runQuery(payload) {
  try {
    const response = await fetch(`${API_BASE_URL_3}/run-solution`, {
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
export async function runSubmission(payload) {
  try {
    const response = await fetch(`${API_BASE_URL_3}/run-submission`, {
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
