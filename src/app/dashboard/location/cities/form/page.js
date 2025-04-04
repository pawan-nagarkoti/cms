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
  const [cityImage, setCityImage] = useState("");
  const cityImageRef = useRef(null);
  const [editorData, setEditorData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);

  const [cityFormData, setCityFormData] = useState({
    cityName: "",
    abberivation: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCityFormData({
      ...cityFormData,
      [name]: value,
    });
  };

  const { list: stateList, isLoading: stateLoading, error: stateError } = useFetchActiveList(`state?status=true`); // fetch state whose status is active:true

  // submit city form
  const handleCitiesFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", cityFormData?.cityName);
    data.append("image", cityImage);
    data.append("abbrevation", cityFormData?.abberivation);
    data.append("metaTitle", cityFormData?.metaTitle);
    data.append("metaDescription", cityFormData?.metaDescription);
    data.append("metaKeyword", cityFormData?.metaKeywords);
    data.append("description", JSON.stringify(editorData));
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    selectedState?.forEach((v, i) => {
      data.append(`activeState[${i}]`, v.value);
    });

    const response = cityId ? await apiCall(`cities/${cityId}`, "PUT", data) : await apiCall(`cities`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      if (cityImageRef.current) cityImageRef.current.value = "";

      router.push("/dashboard/location/cities"); // redirect to the dashboard city page
    }
  };

  // get edit form data on the basis of id
  const fetchCityDataOnTheBasisOfId = async () => {
    if (!cityId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`cities/${cityId}`);
    if (response?.data) {
      setCityFormData({
        cityName: response?.data?.name || "",
        abberivation: response?.data?.abbrevation || "",
        metaTitle: response?.data?.metaTitle || "",
        metaDescription: response?.data?.metaDescription || "",
        metaKeywords: response?.data?.metaKeyword || "",
      });
      setCityImage(response?.data?.image);
      setEditorData(JSON.parse(response.data.description) || "");
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);

      if (stateList.length > 0 && response?.data?.activeState.length > 0) {
        const selectedState = stateList?.filter((v) => response?.data?.activeState?.includes(v.value));
        setSelectedState(selectedState);
      }
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchCityDataOnTheBasisOfId();
  }, [cityId, stateList]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handleCitiesFormData}>
        <div>
          {stateLoading && <p>Loading...</p>}
          {stateList?.length <= 0 && (
            <div className="space-y-2">
              <label className="font-medium text-gray-700">State</label>
              <p className="mt-1 text-sm text-gray-500">Create Active State</p>
            </div>
          )}
          {stateList?.length > 0 && (
            <>
              <SelectDropdown
                label="State"
                value={selectedState}
                options={stateList}
                onChange={setSelectedState}
                placeholder="Choose an country"
                isMulti={true}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="City Name *" placeholder="Enter your city name" name="cityName" value={cityFormData?.cityName} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="City Abbreviation *"
              placeholder="Enter your city abberivation"
              name="abberivation"
              value={cityFormData?.abberivation}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Input type="file" ref={cityImageRef} label="Image *" name="cityImage" onChange={(e) => setCityImage(e.target.files[0])} />
          {cityImage && (
            <img
              src={cityImageRef.current?.files?.length > 0 ? URL?.createObjectURL(cityImage) : cityImage}
              alt="Thumbnail Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Meta Title" placeholder="Enter your title" name="metaTitle" value={cityFormData?.metaTitle} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Meta Keywords"
              placeholder="Enter your meta keywords"
              name="metaKeywords"
              value={cityFormData?.metaKeywords}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea label="Meta Description" name="metaDescription" value={cityFormData?.metaDescription} onChange={handleChange} />
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
