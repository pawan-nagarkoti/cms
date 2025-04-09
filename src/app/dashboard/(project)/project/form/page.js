"use client";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [stateOnTheBasisOfSelectedCountry, setStateOnTheBasisOfSelectedCountry] = useState(null);
  const [cityOnTheBasisOfSelectedState, setCityOnTheBasisOfSelectedState] = useState(null);

  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedState, setSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);

  const [projectFormData, setProjectFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({
      ...projectFormData,
      [name]: value,
    });
  };

  const { list: countryList, isLoading: countryLoading, error: countryError } = useFetchActiveList(`country?status=true`); // fetch state whose status is active:true
  const { list: builderList, isLoading: builderLoading, error: builderError } = useFetchActiveList(`builder?status=true`); // fetch builder whose status is active:true
  const { list: categoryList, isLoading: categoryLoading, error: categoryError } = useFetchActiveList(`propertyCategory?status=true`); // fetch builder whose status is active:true

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
  const handleProjectFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", projectFormData?.name);

    data.append("builder", selectedBuilder?.value);
    data.append("propertyCategory", selectedCategory?.value);
    data.append("country", selectedCountry?.value);
    data.append("state", selectedState?.value);
    data.append("city", selectedCity?.value);

    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    console.log("selectedBuilder", selectedBuilder);
    const response = projectId ? await apiCall(`project/${projectId}`, "PUT", data) : await apiCall(`project`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      router.push("/dashboard/project"); // redirect to the dashboard project page
    }
  };

  // get edit form data on the basis of id
  const fetchCityDataOnTheBasisOfId = async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`project/${projectId}`);
    if (response?.data) {
      setProjectFormData({
        name: response?.data?.name || "",
      });

      setSelectedBuilder({ label: response?.data?.builder?.name, value: response?.data?.builder?._id });
      setSelectedCategory({ label: response?.data?.propertyCategory?.name, value: response?.data?.propertyCategory?._id });
      setSelectedCountry({ label: response?.data?.country?.name, value: response?.data?.country?._id });
      setSelectedState({ label: response?.data?.state?.name, value: response?.data?.state?._id });
      setSelectedCity({ label: response?.data?.city?.name, value: response?.data?.city?._id });

      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchCityDataOnTheBasisOfId();
  }, [projectId, countryList]);

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
      <form onSubmit={handleProjectFormData}>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Project Name" placeholder="Enter your project name" name="name" value={projectFormData?.name} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <>
              <SelectDropdown label="Builder" value={selectedBuilder} options={builderList} onChange={setSelectedBuilder} placeholder="Choose an builder" />
            </>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
          <div className="sm:col-span-6 col-span-12">
            <SelectDropdown
              label="Category "
              value={selectedCategory}
              options={categoryList}
              onChange={setSelectedCategory}
              placeholder="Choose an property category"
            />
          </div>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4">
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
