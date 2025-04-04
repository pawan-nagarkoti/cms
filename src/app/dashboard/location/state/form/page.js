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
import { useFetchActiveList } from "@/hooks/use-activeList";
import SelectDropdown from "@/components/forms/CustomSelect";

export default function page() {
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const [stateImage, setStateImage] = useState("");
  const stateImageRef = useRef(null);
  const [editorData, setEditorData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const stateId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [stateFormData, setStateFormData] = useState({
    stateName: "",
    abberivation: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStateFormData({
      ...stateFormData,
      [name]: value,
    });
  };

  const { list: countryList, isLoading: countryLoading, error: countryError } = useFetchActiveList(`country?status=true`); // fetch country whose status is active

  // submit state form
  const handleStateFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", stateFormData?.stateName);
    data.append("image", stateImage);
    data.append("abbrevation", stateFormData?.abberivation);
    data.append("metaTitle", stateFormData?.metaTitle);
    data.append("metaDescription", stateFormData?.metaDescription);
    data.append("metaKeyword", stateFormData?.metaKeywords);
    data.append("description", JSON.stringify(editorData));
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    selectedCountry?.forEach((v, i) => {
      data.append(`activeCountry[${i}]`, v.value);
    });

    const response = stateId ? await apiCall(`state/${stateId}`, "PUT", data) : await apiCall(`state`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      if (stateImageRef.current) stateImageRef.current.value = "";

      router.push("/dashboard/location/state"); // redirect to the dashboard state page
    }
  };

  // get edit form data on the basis of id
  const fetchStateDataOnTheBasisOfId = async () => {
    if (!stateId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`state/${stateId}`);
    if (response?.data) {
      setStateFormData({
        stateName: response?.data?.name || "",
        abberivation: response?.data?.abbrevation || "",
        metaTitle: response?.data?.metaTitle || "",
        metaDescription: response?.data?.metaDescription || "",
        metaKeywords: response?.data?.metaKeyword || "",
      });
      setStateImage(response?.data?.image);
      setEditorData(JSON.parse(response.data.description) || "");
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);

      if (countryList.length > 0 && response?.data?.activeCountry.length > 0) {
        const selectedCountries = countryList?.filter((v) => response?.data?.activeCountry?.includes(v.value));
        setSelectedCountry(selectedCountries);
      }
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchStateDataOnTheBasisOfId();
  }, [stateId, countryList]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handleStateFormData}>
        <div>
          {countryLoading && <p>Loading...</p>}
          {countryList?.length <= 0 && (
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Country</label>
              <p className="mt-1 text-sm text-gray-500">Create Active Country</p>
            </div>
          )}
          {countryList?.length > 0 && (
            <>
              <SelectDropdown
                label="Country"
                value={selectedCountry}
                options={countryList}
                onChange={setSelectedCountry}
                placeholder="Choose an country"
                isMulti={true}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="State Name *" placeholder="Enter your state name" name="stateName" value={stateFormData?.stateName} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="State Abbreviation *"
              placeholder="Enter your state name"
              name="abberivation"
              value={stateFormData?.abberivation}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Input type="file" ref={stateImageRef} label="Image *" name="stateImage" onChange={(e) => setStateImage(e.target.files[0])} />
          {stateImage && (
            <img
              src={stateImageRef.current?.files?.length > 0 ? URL?.createObjectURL(stateImage) : stateImage}
              alt="Thumbnail Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Meta Title" placeholder="Enter your title" name="metaTitle" value={stateFormData?.metaTitle} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Meta Keywords"
              placeholder="Enter your meta keywords"
              name="metaKeywords"
              value={stateFormData?.metaKeywords}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea label="Meta Description" name="metaDescription" value={stateFormData?.metaDescription} onChange={handleChange} />
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
