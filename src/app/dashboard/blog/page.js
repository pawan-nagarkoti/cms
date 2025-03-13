"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold">Blog</h1>
        <Button onClick={() => router.push("/dashboard/blog/blog-form")}>Add Blog</Button>
      </div>
    </div>
  );
}
