// const X_API_KEY = "d41d8cd98f00b204e9800998ecf8427e";
// const API_BASE_URL_3 = "http://localhost:4000/dev";
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
export async function getSingleFiddle(payload, userId) {
  // 1️⃣ construct a URL object
  const url = new URL(`${API_BASE_URL_3}/get-fiddle/${payload}`);

  // 2️⃣ conditionally add search param
  if (userId) {
    url.searchParams.set("userId", userId);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": X_API_KEY,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error running query:", error);
    throw error;
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
export async function createUserSchema(payload) {
  try {
    const response = await fetch(`${API_BASE_URL_3}/create-schema`, {
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

export async function updateFiddle(payload, id) {
  try {
    const response = await fetch(`${API_BASE_URL_3}/update-fiddle/${id}`, {
      method: "PUT",
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
export async function addFiddle(payload) {
  try {
    const response = await fetch(`${API_BASE_URL_3}/add-fiddle`, {
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
export async function downloadProfiling(payload) {
  try {
    const response = await fetch(
      `https://3j4c24ofsipic54dve7benz6lq0dtmsu.lambda-url.eu-west-1.on.aws`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error running query:", error);
    throw error; // or handle error gracefully
  }
}
