
// This File for ALL ADMIN CATEGORIES RELATED API CALLS

// ——————————————————————————————
//  CATEGORIES RELATED API CALLS
// ——————————————————————————————

import Cookies from "js-cookie";

const X_API_KEY = process.env.NEXT_PUBLIC_Y_API_KEY;
const API_BASE_URL_3 = process.env.NEXT_PUBLIC_API_BASE_URL_1;
const token = Cookies.get("accessToken");

export async function createCategory(payload) {
  try {
    const response = await fetch(
      `${API_BASE_URL_3}/create-category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": X_API_KEY,
          Authorization: `${token}`, 
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(
        `Error creating category: ${response.status} ${err.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createCategory:", error);
    throw error;
  }
}

export async function getCategories(status = undefined) {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const response = await fetch(
      `${API_BASE_URL_3}/get-categories${query}`,
      {
        method: "GET",
        headers: {
          "x-api-key": X_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(
        `Error fetching categories: ${response.status} ${err.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getCategories:", error);
    throw error;
  }
}

export async function updateCategory(id, payload) {
  try {
    if (!id) throw new Error("Category ID is required for update");

    const response = await fetch(
      `${API_BASE_URL_3}/category/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": X_API_KEY,
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(
        `Error updating category: ${response.status} ${err.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateCategory:", error);
    throw error;
  }
}
export async function getSingleCategory(id) {
  try {
    if (!id) throw new Error("Category ID is required for update");

    const response = await fetch(
      `${API_BASE_URL_3}/category/${encodeURIComponent(id)}`,
      {
        method: "GET",
         headers: {
          "x-api-key": X_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(
        `Error updating category: ${response.status} ${err.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateCategory:", error);
    throw error;
  }
}

/**
 * Delete a category by ID
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function deleteCategory(id) {
  try {
    if (!id) throw new Error("Category ID is required for deletion");

    const response = await fetch(
      `${API_BASE_URL_3}/category/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          "x-api-key": X_API_KEY,
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(
        `Error deleting category: ${response.status} ${err.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    throw error;
  }
}
