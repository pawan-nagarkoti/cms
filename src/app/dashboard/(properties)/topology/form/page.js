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
// import CustomEditor from "@/components/forms/CustomEditor";
import { useFetchActiveList } from "@/hooks/use-activeList";
import SelectDropdown from "@/components/forms/CustomSelect";

import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/components/forms/CustomEditor"), {
  ssr: false,
});

export default function page() {
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const topologyId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [editorData, setEditorData] = useState(null);
  const [selectedPropertyCategory, setSelectedPropertyCategory] = useState(null);

  const [topologyFormData, setTopologyFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTopologyFormData({
      ...topologyFormData,
      [name]: value,
    });
  };

  const { list: propertyCategoryList, isLoading: propertyCategoryLoading, error: propertyCategoryError } = useFetchActiveList(`propertyCategory?status=true`); // fetch state whose status is active:true

  // submit country form
  const handletopologyFormData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", topologyFormData?.name);
    data.append("propertyCategory", selectedPropertyCategory?.value);
    data.append("longDescription", JSON.stringify(editorData));
    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    const response = topologyId ? await apiCall(`topology/${topologyId}`, "PUT", data) : await apiCall(`topology`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      router.push("/dashboard/topology"); // redirect to the dashboard topology page
    }
  };

  // get edit form data on the basis of id
  const fetchTopologyDataOnTheBasisOfId = async () => {
    if (!topologyId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await apiCall(`topology/${topologyId}`);
    if (response?.data) {
      setTopologyFormData({
        name: response?.data?.name || "",
      });
      setEditorData(JSON.parse(response.data.longDescription) || "");
      setSelectedPropertyCategory({ label: response?.data?.propertyCategory?.name, value: response?.data?.propertyCategory?._id });
      setIsFeatured(response?.data?.featured || false);
      setIndex(response?.data?.index || false);
      setIsActive(response?.data?.status || false);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchTopologyDataOnTheBasisOfId();
  }, [topologyId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handletopologyFormData}>
        <div className="grid gap-4 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Input label="Topology Name *" placeholder="Enter your topology name" name="name" value={topologyFormData?.name} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6">
            {propertyCategoryLoading && <p>Loading...</p>}
            {propertyCategoryList?.length > 0 && (
              <>
                <SelectDropdown
                  label="Property Category"
                  value={selectedPropertyCategory}
                  options={propertyCategoryList}
                  onChange={setSelectedPropertyCategory}
                  placeholder="Choose an property category"
                />
              </>
            )}
          </div>
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
