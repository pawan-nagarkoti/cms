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
  const router = useRouter();
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const facilityImageRef = useRef(null);
  const [facilityImage, setFacilityImage] = useState("");

  const [facilityFormData, setFacilityFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacilityFormData({
      ...facilityFormData,
      [name]: value,
    });
  };

  // submit facility form
  const handleFacilityFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", facilityFormData?.name);
    data.append("image", facilityImage);
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    const response = facilityId ? await apiCall(`facility/${facilityId}`, "PUT", data) : await apiCall(`facility`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      if (facilityImageRef.current) facilityImageRef.current.value = "";

      router.push("/dashboard/facility"); // redirect to the dashboard facility page
    }
  };

  // get edit form data on the basis of id
  const fetchFacilityDataOnTheBasisOfId = async () => {
    if (!facilityId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`facility/${facilityId}`);
    if (response?.data) {
      setFacilityFormData({
        name: response?.data?.name || "",
      });
      setFacilityImage(response?.data?.image);
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchFacilityDataOnTheBasisOfId();
  }, [facilityId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handleFacilityFormData}>
        <div className="grid gap-4 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Input label="Facility Name *" placeholder="Enter your facility name" name="name" value={facilityFormData?.name} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6">
            <Input type="file" ref={facilityImageRef} label="Image *" name="facilityImage" onChange={(e) => setFacilityImage(e.target.files[0])} />
            {facilityImage && (
              <img
                src={facilityImageRef.current?.files?.length > 0 ? URL?.createObjectURL(facilityImage) : facilityImage}
                alt="Thumbnail Preview"
                className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
              />
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
