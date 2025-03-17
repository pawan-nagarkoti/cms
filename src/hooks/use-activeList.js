import { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";

export const useFetchActiveList = (url) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiResponse = await apiCall(url);
        const formattedList = apiResponse?.data?.map((v) => ({
          label: v?.name || "",
          value: v?._id || "",
        }));
        setList(formattedList);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { list, isLoading, error };
};
