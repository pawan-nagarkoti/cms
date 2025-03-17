import { API_URL } from "@/config/constants";

export const apiCall = async (endpoint, method = "GET", body = null, headers = {}) => {
  try {
    let options = {
      method,
      headers: { ...headers },
    };

    if (body instanceof FormData) {
      // Let browser set the correct headers automatically
      options.body = body;
    } else if (body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      responseData = {
        message: "Invalid JSON response",
        rawResponse: await response.text(),
      };
    }

    if (!response.ok) {
      console.warn(`API Request Failed: ${endpoint}, Status: ${response.status}, Message: ${responseData.message || "Unknown error"}`);

      return {
        error: `HTTP Error ${response.status}`,
        status: response.status,
        message: responseData.message || "Unknown error",
        rawResponse: responseData,
      };
    }

    return responseData;
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    return { error: "Network error", status: 500 };
  }
};
