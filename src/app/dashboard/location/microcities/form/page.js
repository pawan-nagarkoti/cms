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
  const [editorData, setEditorData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const microcityId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [stateOnTheBasisOfSelectedCountry, setStateOnTheBasisOfSelectedCountry] = useState(null);
  const [cityOnTheBasisOfSelectedState, setCityOnTheBasisOfSelectedState] = useState(null);

  const [selectedState, setSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);

  const [microcitiesFormData, setMicrocitiesFormData] = useState({
    microcityName: "",
    abberivation: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMicrocitiesFormData({
      ...microcitiesFormData,
      [name]: value,
    });
  };

  const { list: countryList, isLoading: countryLoading, error: countryError } = useFetchActiveList(`country?status=true`); // fetch state whose status is active:true

  //   fetch active state list on the basis of selected country from the country dropdown
  const fetchActiveStateListOnTheBasisOfSelectedCounty = async () => {
    const response = await apiCall(`microcities?type=country&countryId=${selectedCountry?.value}`);
    const data = response?.data?.map((v) => ({
      label: v?.name || "",
      value: v?._id || "",
    }));
    setStateOnTheBasisOfSelectedCountry(data);
  };

  useEffect(() => {
    fetchActiveStateListOnTheBasisOfSelectedCounty();
  }, [selectedCountry]);

  //   fetch active city list on the basis of selected state from the state dropdown
  const fetchActiveCityListOnTheBasisOfSelectedState = async () => {
    const response = await apiCall(`microcities?type=state&stateId=${selectedState?.value}`);
    const data = response?.data?.map((v) => ({
      label: v?.name || "",
      value: v?._id || "",
    }));
    setCityOnTheBasisOfSelectedState(data);
  };

  useEffect(() => {
    fetchActiveCityListOnTheBasisOfSelectedState();
  }, [selectedState]);

  // submit city form
  const handleCitiesFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("activeCountry", selectedCountry?.value);
    data.append("activeState", selectedState?.value);
    data.append("activeCity", selectedCity?.value);
    data.append("name", microcitiesFormData?.microcityName);
    data.append("metaTitle", microcitiesFormData?.metaTitle);
    data.append("metaDescription", microcitiesFormData?.metaDescription);
    data.append("metaKeyword", microcitiesFormData?.metaKeywords);
    data.append("description", JSON.stringify(editorData));
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    const response = microcityId ? await apiCall(`microcities/${microcityId}`, "PUT", data) : await apiCall(`microcities`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      router.push("/dashboard/location/microcities"); // redirect to the dashboard city page
    }
  };

  // get edit form data on the basis of id
  const fetchCityDataOnTheBasisOfId = async () => {
    if (!microcityId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`cities/${microcityId}`);
    if (response?.data) {
      setMicrocitiesFormData({
        microcityName: response?.data?.name || "",
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

      if (countryList.length > 0 && response?.data?.activeState.length > 0) {
        const selectedCountry = countryList?.filter((v) => response?.data?.activeState?.includes(v.value));
        setSelectedCountry(selectedCountry);
      }
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchCityDataOnTheBasisOfId();
  }, [microcityId, countryList]);

  //   get selected state object
  const handleSelectedState = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  //   get selected city object
  const handleSelectedCity = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handleCitiesFormData}>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 col-span-12">
            {countryLoading && <p>Loading...</p>}
            {!countryLoading && countryList?.length <= 0 && (
              <div className="space-y-2">
                <label className="font-medium text-gray-700">Country</label>
                <p className="mt-1 text-sm text-gray-500">Create Active country</p>
              </div>
            )}
            {countryList?.length > 0 && (
              <>
                <SelectDropdown label="Country" value={selectedCountry} options={countryList} onChange={setSelectedCountry} placeholder="Choose an country" />
              </>
            )}
          </div>

          <div className="sm:col-span-6 col-span-12">
            {stateOnTheBasisOfSelectedCountry?.length <= 0 && (
              <div className="space-y-2">
                <label className="font-medium text-gray-700">State</label>
                <p className="mt-6 text-sm text-gray-500">Please select country after that you can select state</p>
              </div>
            )}
            {stateOnTheBasisOfSelectedCountry?.length > 0 && (
              <>
                <SelectDropdown
                  label="State"
                  value={selectedState}
                  options={stateOnTheBasisOfSelectedCountry}
                  onChange={handleSelectedState}
                  placeholder="Choose an state"
                />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            {cityOnTheBasisOfSelectedState?.length <= 0 && (
              <div className="space-y-2">
                <label className="font-medium text-gray-700">City</label>
                <p className="mt-1 text-sm text-gray-500">Please select state after that you can select city</p>
              </div>
            )}
            {cityOnTheBasisOfSelectedState?.length > 0 && (
              <>
                <SelectDropdown
                  label="City"
                  value={selectedCity}
                  options={cityOnTheBasisOfSelectedState}
                  onChange={handleSelectedCity}
                  placeholder="Choose an city"
                />
              </>
            )}
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Microcity Name *"
              placeholder="Enter your city name"
              name="microcityName"
              value={microcitiesFormData?.microcityName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Meta Title" placeholder="Enter your title" name="metaTitle" value={microcitiesFormData?.metaTitle} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Meta Keywords"
              placeholder="Enter your meta keywords"
              name="metaKeywords"
              value={microcitiesFormData?.metaKeywords}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea label="Meta Description" name="metaDescription" value={microcitiesFormData?.metaDescription} onChange={handleChange} />
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
