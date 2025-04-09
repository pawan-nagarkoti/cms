"use client";

import Input from "@/components/forms/Input";
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
  const [propertyCategoryImage, setPropertyCategoryImage] = useState("");
  const propertyCategoryImageRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyCategoryId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);

  const [propertyCategoryFormData, setPropertyCategoryFormData] = useState({
    name: "",
    image: "",
    alt: "",
    title: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyCategoryFormData({
      ...propertyCategoryFormData,
      [name]: value,
    });
  };

  // submit country form
  const handlePropertyCategoryFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", propertyCategoryFormData?.name);
    data.append("alt", propertyCategoryFormData?.alt);
    data.append("title", propertyCategoryFormData?.title);
    data.append("image", propertyCategoryImage);
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    const response = propertyCategoryId
      ? await apiCall(`propertyCategory/${propertyCategoryId}`, "PUT", data)
      : await apiCall(`propertyCategory`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      if (propertyCategoryImageRef.current) propertyCategoryImageRef.current.value = "";

      router.push("/dashboard/propertyCategory"); // redirect to the dashboard propertyCategory page
    }
  };

  // get edit form data on the basis of id
  const fetchPropertyCategoryDataOnTheBasisOfId = async () => {
    if (!propertyCategoryId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`propertyCategory/${propertyCategoryId}`);
    if (response?.data) {
      setPropertyCategoryFormData({
        name: response?.data?.name || "",
        alt: response?.data?.alt || "",
        title: response?.data?.title || "",
      });
      setPropertyCategoryImage(response?.data?.image);
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchPropertyCategoryDataOnTheBasisOfId();
  }, [propertyCategoryId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handlePropertyCategoryFormData}>
        <div>
          <Input label="Builder Name *" placeholder="Enter your builder name" name="name" value={propertyCategoryFormData?.name} onChange={handleChange} />
        </div>

        <div className="mt-4">
          <Input
            type="file"
            ref={propertyCategoryImageRef}
            label="Image *"
            name="propertyCategoryImage"
            onChange={(e) => setPropertyCategoryImage(e.target.files[0])}
          />
          {propertyCategoryImage && (
            <img
              src={propertyCategoryImageRef.current?.files?.length > 0 ? URL?.createObjectURL(propertyCategoryImage) : propertyCategoryImage}
              alt="builder image"
              className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Image alt" placeholder="Enter your image alt" name="alt" value={propertyCategoryFormData?.alt} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input label="Image Title" placeholder="Enter your image title" name="title" value={propertyCategoryFormData?.title} onChange={handleChange} />
          </div>
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
