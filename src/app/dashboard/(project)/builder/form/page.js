"use client";

import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/components/forms/CustomEditor"), {
  ssr: false,
});

import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { CustomToggle } from "@/components/forms/Toggle";
import { showToast } from "@/components/toastProvider";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";

export default function page() {
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const [builderImage, setBuilderImage] = useState("");
  const builderImageRef = useRef(null);
  const [editorData, setEditorData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const builderId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);

  const [builderFormData, setBuilderFormData] = useState({
    builderName: "",
    address: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuilderFormData({
      ...builderFormData,
      [name]: value,
    });
  };

  // submit country form
  const handleBuilderFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", builderFormData?.builderName);
    data.append("image", builderImage);
    data.append("address", builderFormData?.address);
    data.append("longDescription", JSON.stringify(editorData));
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    // const response = await apiCall(`builder`, "POST", data);
    const response = builderId ? await apiCall(`builder/${builderId}`, "PUT", data) : await apiCall(`builder`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      if (builderImageRef.current) builderImageRef.current.value = "";

      router.push("/dashboard/builder"); // redirect to the dashboard builder page
    }
  };

  // get edit form data on the basis of id
  const fetchBuilderDataOnTheBasisOfId = async () => {
    if (!builderId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`builder/${builderId}`);
    if (response?.data) {
      setBuilderFormData({
        builderName: response?.data?.name || "",
        address: response?.data?.address || "",
      });
      setBuilderImage(response?.data?.image);
      setEditorData(JSON.parse(response.data.longDescription) || "");
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchBuilderDataOnTheBasisOfId();
  }, [builderId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handleBuilderFormData}>
        <div>
          <Input label="Builder Name *" placeholder="Enter your builder name" name="builderName" value={builderFormData?.builderName} onChange={handleChange} />
        </div>

        <div className="mt-4">
          <Input type="file" ref={builderImageRef} label="Image *" name="builderImage" onChange={(e) => setBuilderImage(e.target.files[0])} />
          {builderImage && (
            <img
              src={builderImageRef.current?.files?.length > 0 ? URL?.createObjectURL(builderImage) : builderImage}
              alt="builder image"
              className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
            />
          )}
        </div>

        <div className="mt-4">
          <Textarea label="Builder address" name="address" value={builderFormData?.address} onChange={handleChange} />
        </div>

        <div className="mt-6">
          <CustomEditor onChange={setEditorData} label="Long Description" data={editorData} />
        </div>

        <div className="grid gap-3 mt-6">
          <CustomToggle label="Is Featured" onCheckedChange={(checked) => setIsFeatured(checked)} checked={isFeatured} />
          <CustomToggle label="Index" onCheckedChange={(checked) => setIndex(checked)} checked={isIndex} />
          <CustomToggle label="status (Active / Inactive)" onCheckedChange={(checked) => setIsActive(checked)} checked={isActive} />
        </div>

        <div className="text-center my-10">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </>
  );
}
