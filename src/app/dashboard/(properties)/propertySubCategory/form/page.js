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
import { useFetchActiveList } from "@/hooks/use-activeList";
import SelectDropdown from "@/components/forms/CustomSelect";

export default function page() {
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const [propertySubCategoryImage, setPropertySubCategoryImage] = useState("");
  const propertySubCategoryImageRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertySubCategoryId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertySubCategory, setSelectedPropertySubCategory] = useState(null);

  const [propertyCategoryFormData, setPropertyCategoryFormData] = useState({
    subCategoryName: "",
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

  const {
    list: propertySubCategoryList,
    isLoading: propertySubCategoryLoading,
    error: propertySubCategoryError,
  } = useFetchActiveList(`propertyCategory?status=true`); // fetch country whose status is active

  // submit country form
  const handlePropertySubCategoryFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("subCategoryName", propertyCategoryFormData?.subCategoryName);
    data.append("alt", propertyCategoryFormData?.alt);
    data.append("title", propertyCategoryFormData?.title);
    data.append("image", propertySubCategoryImage);
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);
    data.append("categoryName", selectedPropertySubCategory?.value);

    const response = propertySubCategoryId
      ? await apiCall(`propertySubCategory/${propertySubCategoryId}`, "PUT", data)
      : await apiCall(`propertySubCategory`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      if (propertySubCategoryImageRef.current) propertySubCategoryImageRef.current.value = "";

      router.push("/dashboard/propertySubCategory"); // redirect to the dashboard propertyCategory page
    }
  };

  // get edit form data on the basis of id
  const fetchPropertyCategoryDataOnTheBasisOfId = async () => {
    if (!propertySubCategoryId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`propertySubCategory/${propertySubCategoryId}`);
    if (response?.data) {
      setPropertyCategoryFormData({
        subCategoryName: response?.data?.subCategoryName || "",
        alt: response?.data?.alt || "",
        title: response?.data?.title || "",
      });
      setPropertySubCategoryImage(response?.data?.image);
      setSelectedPropertySubCategory({ label: response?.data?.categoryName?.name, value: response?.data?.categoryName?._id });
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchPropertyCategoryDataOnTheBasisOfId();
  }, [propertySubCategoryId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handlePropertySubCategoryFormData}>
        <div>
          {propertySubCategoryLoading && <p>Loading...</p>}
          {propertySubCategoryList?.length <= 0 && (
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Property Category</label>
              <p className="mt-1 text-sm text-gray-500">Create Active Property Category</p>
            </div>
          )}
          {propertySubCategoryList?.length > 0 && (
            <>
              <SelectDropdown
                label="Property Category"
                value={selectedPropertySubCategory}
                options={propertySubCategoryList}
                onChange={setSelectedPropertySubCategory}
                placeholder="Choose an country"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Sub Category Name"
              placeholder="Enter your sub category name"
              name="subCategoryName"
              value={propertyCategoryFormData?.subCategoryName}
              onChange={handleChange}
            />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              type="file"
              ref={propertySubCategoryImageRef}
              label="Image *"
              name="propertySubCategoryImage"
              onChange={(e) => setPropertySubCategoryImage(e.target.files[0])}
            />
            {propertySubCategoryImage && (
              <img
                src={propertySubCategoryImageRef.current?.files?.length > 0 ? URL?.createObjectURL(propertySubCategoryImage) : propertySubCategoryImage}
                alt="builder image"
                className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
              />
            )}
          </div>
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
