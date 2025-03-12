import { API_URL } from "@/config/constants";

export const apiCall = async (endpoint, method = "GET", body = null, headers = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    let responseData;
    try {
      responseData = await response.json(); // Attempt to parse JSON
    } catch (jsonError) {
      responseData = { message: "Invalid JSON response", rawResponse: await response.text() }; // Handle invalid JSON
    }

    if (!response.ok) {
      console.warn(`API Request Failed: ${endpoint}, Status: ${response.status}, Message: ${responseData.message || "Unknown error"}`);

      return {
        error: `HTTP Error ${response.status}`,
        status: response.status,
        message: responseData.message || "Unknown error", // Extract error message if available
        rawResponse: responseData, // Return full response data
      };
    }

    return responseData; // Return successful response data
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    return { error: "Network error", status: 500 };
  }
};
