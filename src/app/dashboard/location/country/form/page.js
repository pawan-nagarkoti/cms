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
  const [countryImage, setCountryImage] = useState("");
  const countryImageRef = useRef(null);
  const [editorData, setEditorData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);

  const [countryFormData, setCountryFormData] = useState({
    countryName: "",
    abberivation: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCountryFormData({
      ...countryFormData,
      [name]: value,
    });
  };

  // submit country form
  const handleCitiesFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", countryFormData?.countryName);
    data.append("image", countryImage);
    data.append("abbrevation", countryFormData?.abberivation);
    data.append("metaTitle", countryFormData?.metaTitle);
    data.append("metaDescription", countryFormData?.metaDescription);
    data.append("metaKeywords", countryFormData?.metaKeywords);
    data.append("description", JSON.stringify(editorData));
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    // const response = await apiCall(`country`, "POST", data);
    const response = countryId ? await apiCall(`country/${countryId}`, "PUT", data) : await apiCall(`country`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      if (countryImageRef.current) countryImageRef.current.value = "";

      router.push("/dashboard/location/country"); // redirect to the dashboard country page
    }
  };

  // get edit form data on the basis of id
  const fetchCountryDataOnTheBasisOfId = async () => {
    if (!countryId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`country/${countryId}`);
    if (response?.data) {
      setCountryFormData({
        countryName: response?.data?.name || "",
        abberivation: response?.data?.abbrevation || "",
        metaTitle: response?.data?.metaTitle || "",
        metaDescription: response?.data?.metaDescription || "",
        metaKeywords: response?.data?.metaKeyword || "",
      });
      setCountryImage(response?.data?.image);
      setEditorData(JSON.parse(response.data.description) || "");
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchCountryDataOnTheBasisOfId();
  }, [countryId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handleCitiesFormData}>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Country Name *"
              placeholder="Enter your category name"
              name="countryName"
              value={countryFormData?.countryName}
              onChange={handleChange}
            />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Country Abbreviation *"
              placeholder="Enter your category name"
              name="abberivation"
              value={countryFormData?.abberivation}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Input type="file" ref={countryImageRef} label="Image *" name="countryImage" onChange={(e) => setCountryImage(e.target.files[0])} />
          {countryImage && (
            <img
              src={countryImageRef.current?.files?.length > 0 ? URL?.createObjectURL(countryImage) : countryImage}
              alt="Thumbnail Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Meta Title" placeholder="Enter your title" name="metaTitle" value={countryFormData?.metaTitle} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Meta Keywords"
              placeholder="Enter your meta keywords"
              name="metaKeywords"
              value={countryFormData?.metaKeywords}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea label="Meta Description" name="metaDescription" value={countryFormData?.metaDescription} onChange={handleChange} />
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
