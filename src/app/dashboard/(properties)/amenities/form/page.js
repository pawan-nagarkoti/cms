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
  const amenityId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const amenityImageRef = useRef(null);
  const [amenityImage, setAmenityImage] = useState("");

  const [amenityFormData, setAmenityFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAmenityFormData({
      ...amenityFormData,
      [name]: value,
    });
  };

  // submit amenity form
  const handletopologyFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", amenityFormData?.name);
    data.append("image", amenityImage);
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    const response = amenityId ? await apiCall(`amenity/${amenityId}`, "PUT", data) : await apiCall(`amenity`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      if (amenityImageRef.current) amenityImageRef.current.value = "";

      router.push("/dashboard/amenities"); // redirect to the dashboard topology page
    }
  };

  // get edit form data on the basis of id
  const fetchTopologyDataOnTheBasisOfId = async () => {
    if (!amenityId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`amenity/${amenityId}`);
    if (response?.data) {
      setAmenityFormData({
        name: response?.data?.name || "",
      });
      setAmenityImage(response?.data?.image);
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchTopologyDataOnTheBasisOfId();
  }, [amenityId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handletopologyFormData}>
        <div className="grid gap-4 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Input label="Amenity Name *" placeholder="Enter your topology name" name="name" value={amenityFormData?.name} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6">
            <Input type="file" ref={amenityImageRef} label="Image *" name="amenityImage" onChange={(e) => setAmenityImage(e.target.files[0])} />
            {amenityImage && (
              <img
                src={amenityImageRef.current?.files?.length > 0 ? URL?.createObjectURL(amenityImage) : amenityImage}
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
