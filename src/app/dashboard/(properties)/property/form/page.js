"use client";

import React, { useState } from "react";
import { CustomAccordion } from "@/components/custom-accordion";
import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import Dropdown from "@/components/forms/Dropdown";
import { CustomToggle } from "@/components/forms/Toggle";
import SelectDropdown from "@/components/forms/CustomSelect";
import { useFetchActiveList } from "@/hooks/use-activeList";
import { Button } from "@/components/ui/button";
import useSlug from "@/hooks/use-slug";
import { possionNumber, possionWMY, PriceType, PriceUnit, propertyOrderBy } from "@/config/constants";
import CustomEditor from "@/components/forms/CustomEditor";

export default function page() {
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editorData, setEditorData] = useState(null);

  const [projectFormData, setProjectFormData] = useState({
    address: "",
    propertyTitle: "",
    priceType: "",
    price: "",
    priceUnit: "",
    minPrice: "",
    minUnit: "",
    maxPrice: "",
    maxUnit: "",
    completionOn: "",
    possionNumber: "",
    possionWMY: "",
    order: "",
  });
  const slug = useSlug(projectFormData?.propertyTitle || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({
      ...projectFormData,
      [name]: value,
    });
  };

  const { list: projectList, isLoading: isProjectLoading, error: projectError } = useFetchActiveList(`project?status=true`);

  const handleProjectInfo = (e) => {
    e.preventDefault();
    console.log(selectedProject, projectFormData, slug);
  };

  return (
    <>
      {/* Project information container */}
      <CustomAccordion heading="Project Information">
        <form onSubmit={handleProjectInfo}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <div>
                {isProjectLoading && <p>Loading...</p>}
                {projectList?.length <= 0 && (
                  <div className="space-y-2">
                    <label className="font-medium text-gray-700">Project Name</label>
                    <p className="mt-1 text-sm text-gray-500">Create Active Project</p>
                  </div>
                )}
                {projectList?.length > 0 && (
                  <>
                    <SelectDropdown
                      label="Project Name"
                      value={selectedProject}
                      options={projectList}
                      onChange={setSelectedProject}
                      placeholder="Choose an country"
                    />
                  </>
                )}
              </div>
            </div>
            <div className="sm:col-span-6">
              <Input
                label="Builder Name *"
                placeholder="Enter your builder name"
                name="name"
                value={selectedProject?.builderName || ""}
                disabled
                className="cursor-not-allowed"
              />
            </div>
            <div className="col-span-full">
              <Textarea label="Address" name="address" value={projectFormData?.address} onChange={handleChange} />
            </div>
            <div className="sm:col-span-6">
              <Input
                label="Property Title"
                placeholder="Enter your property name"
                name="propertyTitle"
                value={projectFormData?.propertyTitle}
                onChange={handleChange}
              />
            </div>
            <div className="sm:col-span-6">
              <Input label="Property Slug *" placeholder="Enter your slug name" name="slug" value={slug} disabled className="cursor-not-allowed" />
            </div>
            <div className="sm:col-span-2">
              <Dropdown label="Price Type" name="priceType" items={PriceType} handleChange={handleChange} value={projectFormData.priceType} />
            </div>
            {(projectFormData?.priceType === "Fixed" || projectFormData?.priceType === "") && (
              <>
                <div className="col-span-6">
                  <Input label="Price" placeholder="Enter your price" name="price" value={projectFormData.price} onChange={handleChange} />
                </div>
                <div className="sm:col-span-4">
                  <Dropdown label="Price Unit" name="priceUnit" items={PriceUnit} handleChange={handleChange} value={projectFormData.priceUnit} />
                </div>
              </>
            )}

            {projectFormData?.priceType === "Range" && (
              <>
                <div className="col-span-2">
                  <Input label="Min Price" placeholder="Enter your price" name="minPrice" value={projectFormData.minPrice} onChange={handleChange} />
                </div>
                <div className="sm:col-span-3">
                  <Dropdown label="Min Price Unit" name="minUnit" items={PriceUnit} handleChange={handleChange} value={projectFormData.minUnit} />
                </div>
                <div className="col-span-3">
                  <Input label="Max Price" placeholder="Enter your price" name="maxPrice" value={projectFormData.maxPrice} onChange={handleChange} />
                </div>
                <div className="sm:col-span-2">
                  <Dropdown label="Max Price Unit" name="maxUnit" items={PriceUnit} handleChange={handleChange} value={projectFormData.maxUnit} />
                </div>
              </>
            )}

            <div className="sm:col-span-4">
              <Input label="Topology" type="text" placeholder="Enter your slug name" name="slug" />
            </div>
            <div className="sm:col-span-4">
              <Input label="Topology" type="text" placeholder="Enter your slug name" name="slug" />
            </div>
            <div className="sm:col-span-4">
              <Input label="Microsite" type="text" placeholder="Enter your slug name" name="slug" />
            </div>
            <div className="sm:col-span-4">
              <Input label="Amenties" type="text" placeholder="Enter your slug name" name="slug" />
            </div>
            <div className="sm:col-span-4">
              <Input label="Facility" type="text" placeholder="Enter your property name" name="propertyName" />
            </div>
            <div className="sm:col-span-4">
              <Input label="Related Property Location" type="text" placeholder="Enter your property name" name="propertyName" />
            </div>

            <div className="sm:col-span-4">
              <Input
                label="Property Completion On"
                type="date"
                placeholder="Enter your completion on"
                name="completionOn"
                onChange={handleChange}
                value={projectFormData.completionOn}
              />
            </div>
            <div className="sm:col-span-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Dropdown label="Possion On" name="possionNumber" items={possionNumber} handleChange={handleChange} value={projectFormData.possionNumber} />
                </div>
                <div className="col-span-6">
                  <Dropdown name="possionWMY" items={possionWMY} handleChange={handleChange} value={projectFormData.possionWMY} />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <Dropdown label="Property Order" name="order" items={propertyOrderBy} handleChange={handleChange} value={projectFormData.order} />
            </div>

            <div className="sm:col-span-4">
              <Input label="Property Featured Image" type="file" placeholder="Enter your property name" name="propertyName" />
            </div>
            <div className="sm:col-span-4">
              <Input label="Property Featured Image Title" type="text" placeholder="Enter your property name" name="propertyName" />
            </div>
            <div className="sm:col-span-4">
              <Input label="Property Featured Image Alt" type="text" placeholder="Enter your property name" name="propertyName" />
            </div>

            <div className="col-span-full">
              <CustomEditor onChange={setEditorData} label="Long Description" data={editorData} />
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
      </CustomAccordion>

      {/* Property Image */}
      <CustomAccordion heading="Property Image">
        <p>lorem 20222</p>
      </CustomAccordion>

      {/* Property Gallery Image */}
      <CustomAccordion heading="Property Gallery Image">
        <p>lorem 20222</p>
      </CustomAccordion>

      {/* floor plan */}
      <CustomAccordion heading="Floor Plan">
        <p>lorem 20222</p>
      </CustomAccordion>

      {/* Faq section */}
      <CustomAccordion heading="Faq">
        <p>lorem 20222</p>
      </CustomAccordion>

      {/* Reara details */}
      <CustomAccordion heading="Rera Details">
        <p>lorem 20222</p>
      </CustomAccordion>

      {/* other information container */}
      <CustomAccordion heading="Other Information">
        <p>lorem 20</p>
      </CustomAccordion>
    </>
  );
}
