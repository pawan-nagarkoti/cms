"use client";

import { useMemo } from "react";

const useSlug = (text) => {
  return useMemo(() => {
    return (text || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [text]);
};

export default useSlug;
