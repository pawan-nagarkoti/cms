"use client";

import React, { useEffect, useRef, useState } from "react";
import { CustomAccordion } from "@/components/custom-accordion";
import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import Dropdown from "@/components/forms/Dropdown";
import { CustomToggle } from "@/components/forms/Toggle";
import SelectDropdown from "@/components/forms/CustomSelect";
import { useFetchActiveList } from "@/hooks/use-activeList";
import { Button } from "@/components/ui/button";
import useSlug from "@/hooks/use-slug";
import { maxSizeUnit, minSizeUnit, possionNumber, possionWMY, PriceType, PriceUnit, propertyOrderBy } from "@/config/constants";
// import CustomEditor from "@/components/forms/CustomEditor";
import {
  addFloorPlan,
  addGallery,
  addProperty,
  addPropertyImage,
  addRera,
  fetchAllFloorPlan,
  fetchAllRera,
  fetchGallery,
  fetchPropertyImage,
  fetchPropertyMicrocity,
  fetchPropertySubCategory,
  fetchPropertyTopology,
  fetchSingleFloorPlan,
  fetchSingleGallery,
  fetchSinglePropertyImage,
  fetchSingleRera,
  updateFloorPlan,
  updateGallery,
  updatePropertyImage,
  updateRera,
} from "@/actions/project-actions";
import PropertyImageTable from "@/components/property-table/Property-Image-Table";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PropertyGalleryTable from "@/components/property-table/Property-gallery-table";
import FloorPlanTable from "@/components/property-table/Floor-plan-table";
import ReraTable from "@/components/property-table/Rera-table";

const CustomEditor = dynamic(() => import("@/components/forms/CustomEditor"), {
  ssr: false,
});

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectID = searchParams.get("projectId" || "");
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editorData, setEditorData] = useState(null);

  const [hasSubCategory, setHasSubCategory] = useState([]); // get sub category form actions/mution
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [hasTopology, setHasTopology] = useState([]); // get topology form actions/mution
  const [selectedTopology, setSelectedTopology] = useState(null);

  const [hasMicrocity, setHasMicrocity] = useState([]); // get microcity form actions/mution
  const [selectedMicrocity, setSelectedMicrocity] = useState(null);

  const [selectedAmenties, setSelectedAmenties] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedRelatedProperties, setSelectedRelatedProperties] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isPropertyImageDataLoding, setIsPropertyImageDataLoding] = useState(false);

  const [propertyImageDataContainer, setPropertyImageDataContainer] = useState([]);

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
    minSize: "",
    minSizeUnit: "",
    maxSize: "",
    maxSizeUnit: "",
    completionOn: "",
    possionNumber: "",
    possionWMY: "",
    order: "",
    featuredImage: "",
    featuredImageTitle: "",
    featuredImageAlt: "",
  });
  const slug = useSlug(projectFormData?.propertyTitle || "");

  const [hasImageRowDeleted, setHasImageRowDeleted] = useState(false); // is it deleted property image row ?
  const [isEditPropertyImageId, setIsEditPropertyImageId] = useState(null); // get project image id when we click on edit button on the table
  const propertyImageRef = useRef(null);

  const [hasGalleryData, setHasGalleryData] = useState([]);
  const [hasGalleryRowDeleted, setHasGalleryRowDeleted] = useState(false);
  const [isEditGalleryId, setIsEditGalleryId] = useState(null); // get project image id when we click on edit button on the table
  const galleryRef = useRef(null);

  // Add property image states
  const [propertyImageFormData, setPropertyImageData] = useState({
    propertyImageTable: "",
    propertyTitleTable: "",
    propertyAltTable: "",
  });

  // Add gallery images states
  const [galleryFormData, setGalleryFormData] = useState({
    galleryImageTable: "",
    galleryTitleTable: "",
    galleryAltTable: "",
  });

  // Add floor plan states ===================================================================
  const [floorPlan, setFloorPlan] = useState({
    floorType: "",
    floorPrice: "",
    floorImageTitle: "",
    floorAlt: "",
    image: "",
  });

  const [hasFloorPlanData, setHasFloorPlanData] = useState([]);
  const [hasFloorPlanRowDeleted, setHasFloorPlanRowDeleted] = useState(false);
  const floorPlanRef = useRef(null);
  const [isFloorPlanLoading, setIsFloorPlanLoading] = useState(false);
  const [isFloorPlanEditId, setIsFloorPlanEditId] = useState(null);

  // Add rera detail states =======================================================================
  const [reraData, setReraData] = useState({
    name: "",
    number: "",
    url: "",
    image: "",
  });
  const [hasReraData, setHasReraData] = useState([]);
  const [hasReraRowDeleted, setHasReraRowDeleted] = useState(false);
  const reraRef = useRef(null);
  const [isReraLoading, setIsReraLoading] = useState(false);
  const [isReraEditId, setIsReraEditId] = useState(null);

  // Propery all fields onChange common function
  const handleChange = (e, file) => {
    if (file) {
      const name = e.target.name;
      const value = e.target.files[0];
      setProjectFormData({
        ...projectFormData,
        [name]: value,
      });
    } else {
      const { name, value } = e.target;
      setProjectFormData({
        ...projectFormData,
        [name]: value,
      });
    }
  };

  // Property image all fields onChange common function
  const handlePropertyImageChange = (e, file) => {
    if (file) {
      const name = e.target.name;
      const value = e.target.files[0];
      setPropertyImageData({
        ...propertyImageFormData,
        [name]: value,
      });
    } else {
      const { name, value } = e.target;
      setPropertyImageData({
        ...propertyImageFormData,
        [name]: value,
      });
    }
  };

  // Property gallery all fields onchange common function
  const handleGalleryChange = (e, file) => {
    if (file) {
      const name = e.target.name;
      const value = e.target.files[0];
      setGalleryFormData({
        ...galleryFormData,
        [name]: value,
      });
    } else {
      const { name, value } = e.target;
      setGalleryFormData({
        ...galleryFormData,
        [name]: value,
      });
    }
  };

  const { list: projectList, isLoading: isProjectLoading, error: projectError } = useFetchActiveList(`project?status=true`); // fetch projcet whose status is true
  const { list: amentiesList, isLoading: isAmentiesLoading, error: amentiesError } = useFetchActiveList(`amenity?status=true`); // fetch amenties whose status is true
  const { list: facilityList, isLoading: isFacilityLoading, error: facilityError } = useFetchActiveList(`facility?status=true`); // fetch facility whose status is true
  const { list: microcityList, isLoading: ismicrocityLoading, error: microcitError } = useFetchActiveList(`microcities?status=true`); // fetch microcity whose status is true

  // Add property after submit the form
  const handleProjectInfo = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("projectName", selectedProject.value);
    formData.append("builder", selectedProject.builderName);
    formData.append("address", projectFormData.address);
    formData.append("propertyTitle", projectFormData.propertyTitle);
    formData.append("propertySlug", slug);
    formData.append("priceType", projectFormData.priceType);
    formData.append("price", projectFormData.price);
    formData.append("priceUnit", projectFormData.priceUnit);
    formData.append("minPrice", projectFormData.minPrice);
    formData.append("minPriceUnit", projectFormData.minUnit);
    formData.append("maxPrice", projectFormData.maxPrice);
    formData.append("maxPriceUnit", projectFormData.maxUnit);
    formData.append("minSize", projectFormData.minSize);
    formData.append("minSizeUnit", projectFormData.minSizeUnit);
    formData.append("maxSize", projectFormData.maxSize);
    formData.append("maxSizeUnit", projectFormData.maxSizeUnit);

    formData.append("propertySubCategory", JSON.stringify(selectedSubCategory?.map((item) => item.value) || []));
    formData.append("topology", JSON.stringify(selectedTopology?.map((item) => item.value) || []));
    formData.append("microsite", JSON.stringify(selectedMicrocity?.map((item) => item.value) || []));
    formData.append("amenties", JSON.stringify(selectedAmenties?.map((item) => item.value) || []));
    formData.append("facility", JSON.stringify(selectedFacility?.map((item) => item.value) || []));
    formData.append("relatedProperties", JSON.stringify(selectedRelatedProperties?.map((item) => item.value) || []));

    // Dates and dropdowns
    formData.append("completionOn", projectFormData.completionOn);
    formData.append("possionNumber", projectFormData.possionNumber);
    formData.append("possionWMY", projectFormData.possionWMY);
    formData.append("order", projectFormData.order);

    // Images
    formData.append("featuredImage", projectFormData.featuredImage);
    formData.append("featuredImageTitle", projectFormData.featuredImageTitle);
    formData.append("featuredImageAlt", projectFormData.featuredImageAlt);

    // Description
    formData.append("longDescription", editorData);

    // Boolean values as strings
    formData.append("featured", JSON.stringify(isFeatured));
    formData.append("index", JSON.stringify(isIndex));
    formData.append("status", JSON.stringify(isActive));

    setIsLoading(true);
    try {
      const response = await addProperty(formData); // call server action for create property
      if (response.success) {
        router.push(`/dashboard/property/form?projectId=${response?.data?.projectName}`); // set project id on prams
      }
    } catch (e) {
      console.log(e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch sub category on the basis of select project name
  const fetchSubCategory = async () => {
    try {
      const response = await fetchPropertySubCategory(selectedProject?.completeData?.propertyCategory?._id);
      const data = response?.data?.map((v, i) => ({
        label: v?.subCategoryName,
        value: v?._id,
      }));
      setHasSubCategory(data);
    } catch (error) {
      console.log(error?.message);
    }
  };

  // fetch topology on the basis of selected project name
  const fetchTopology = async () => {
    try {
      const response = await fetchPropertyTopology(selectedProject?.completeData?.propertyCategory?._id);
      const data = response?.data?.map((v, i) => ({
        label: v?.name,
        value: v?._id,
      }));
      setHasTopology(data);
    } catch (e) {
      console.log(e?.message);
    }
  };

  // fetch microcity on the basis of selected project name
  const fetchMicrocity = async () => {
    try {
      const response = await fetchPropertyMicrocity(selectedProject?.completeData?.city?._id);
      const data = response?.data?.map((v, i) => ({
        label: v?.name,
        value: v?._id,
      }));
      setHasMicrocity(data);
    } catch (e) {
      console.log(e?.message);
    }
  };

  useEffect(() => {
    if (projectList.length > 0) {
      setSelectedSubCategory(null); // clear  sub category selected option when we change the project name
      setSelectedTopology(null); // clear topology selected option when we change the project name
      setSelectedMicrocity(null); // clear microcity selected option when we change the project name

      fetchSubCategory();
      fetchTopology();
      fetchMicrocity();
    }
  }, [selectedProject]); // Run whenever we select project

  // Add property image after submit the property image form
  const handleSubmitPropertyImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("galleryImageTable", galleryFormData?.galleryImageTable);
    formData.append("galleryTitleTable", galleryFormData?.galleryTitleTable);
    formData.append("galleryAltTable", galleryFormData?.galleryAltTable);
    formData.append("porjectNameID", projectID);

    setIsPropertyImageDataLoding(true);
    const response = isEditPropertyImageId ? await updatePropertyImage(isEditPropertyImageId, formData) : await addPropertyImage(formData);
    try {
      if (response.success) {
        fetchAllPropertyImage();
        setPropertyImageData({
          galleryImageTable: "",
          galleryTitleTable: "",
          galleryAltTable: "",
        });
        setIsEditPropertyImageId(null); // reset edit property id
        if (propertyImageRef.current) propertyImageRef.current.value = "";
      }
    } catch (e) {
      console.log(e?.message);
    } finally {
      setIsPropertyImageDataLoding(false);
    }
  };

  // Add gallery
  const handleSubmitGallery = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("galleryImageTable", galleryFormData?.galleryImageTable);
    formData.append("galleryTitleTable", galleryFormData?.galleryTitleTable);
    formData.append("galleryAltTable", galleryFormData?.galleryAltTable);
    formData.append("porjectNameID", projectID);

    // setIsPropertyImageDataLoding(true);
    try {
      const response = isEditGalleryId ? await updateGallery(isEditGalleryId, formData) : await addGallery(formData);
      fetchGalleryData();
      setGalleryFormData({
        galleryImageTable: "",
        galleryTitleTable: "",
        galleryAltTable: "",
      });
      setIsEditGalleryId(null); // reset edit gallery id
      if (galleryRef.current) galleryRef.current.value = "";
    } catch (e) {
      console.log(e?.message);
    } finally {
      // setIsPropertyImageDataLoding(false);
    }
  };
  // fetch all property image
  const fetchAllPropertyImage = async () => {
    try {
      const response = await fetchPropertyImage();
      if (response?.success) {
        setPropertyImageDataContainer(response);
      }
    } catch (e) {
      console.log(e?.message);
    }
  };
  useEffect(() => {
    fetchAllPropertyImage();
  }, [hasImageRowDeleted]);
  // fetch single property
  const fetchSinglePropertyImageCall = async () => {
    const response = await fetchSinglePropertyImage(isEditPropertyImageId);
    setPropertyImageData({
      propertyImageTable: response?.image,
      propertyTitleTable: response?.title,
      propertyAltTable: response?.alt,
    });
  };
  useEffect(() => {
    if (isEditPropertyImageId) {
      fetchSinglePropertyImageCall();
    }
  }, [isEditPropertyImageId]);

  // fetch all gallery images
  const fetchGalleryData = async () => {
    const response = await fetchGallery();
    if (response.length > 0) {
      setHasGalleryData(response);
    }
  };
  useEffect(() => {
    fetchGalleryData(); // fetch gallery
  }, [hasGalleryRowDeleted]);
  // fetch single property
  const fetchSingleGalleryCall = async () => {
    const response = await fetchSingleGallery(isEditGalleryId);
    setGalleryFormData({
      galleryImageTable: response?.image,
      galleryTitleTable: response?.title,
      galleryAltTable: response?.alt,
    });
  };
  useEffect(() => {
    if (isEditGalleryId) {
      fetchSingleGalleryCall();
    }
  }, [isEditGalleryId]);

  // ============================== Floor plan ============================================
  // Add floor plan
  const handleSubmitFloorPlan = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("floorAlt", floorPlan.floorAlt);
    formData.append("floorImageTitle", floorPlan.floorImageTitle);
    formData.append("floorPrice", floorPlan.floorPrice);
    formData.append("floorType", floorPlan.floorType);
    formData.append("image", floorPlan.image);

    setIsFloorPlanLoading(true);
    try {
      const response = isFloorPlanEditId ? await updateFloorPlan(isFloorPlanEditId, formData) : await addFloorPlan(formData);
      if (response) {
        setFloorPlan({
          floorAlt: "",
          floorImageTitle: "",
          floorPrice: "",
          floorType: "",
        });
        fetchFloorPlan();
        if (floorPlanRef.current) floorPlanRef.current.value = "";
      }
    } catch (e) {
      console.log(e?.message);
    } finally {
      setIsFloorPlanLoading(false);
    }
  };

  // Floor plan all fields onChange common function
  const onChangeFloorPlan = (e, file) => {
    if (file) {
      const name = e.target.name;
      const value = e.target.files[0];
      setFloorPlan({
        ...floorPlan,
        [name]: value,
      });
    } else {
      const { name, value } = e.target;
      setFloorPlan({
        ...floorPlan,
        [name]: value,
      });
    }
  };

  // fetch all floor plan data
  const fetchFloorPlan = async () => {
    const response = await fetchAllFloorPlan();
    if (response.length > 0) {
      setHasFloorPlanData(response);
    }
  };
  useEffect(() => {
    fetchFloorPlan(); // fetch all flor plan data
  }, [hasFloorPlanRowDeleted]);

  // fetch single property
  const fetchSinglehFloorPlanData = async () => {
    const response = await fetchSingleFloorPlan(isFloorPlanEditId);
    setFloorPlan({
      floorType: response?.type,
      floorPrice: response?.price,
      floorImageTitle: response?.title,
      floorAlt: response?.alt,
      image: response?.image,
    });
  };
  useEffect(() => {
    fetchSinglehFloorPlanData();
  }, [isFloorPlanEditId]);

  // ============================= RERA DETAIL ==============================================
  // Add floor plan
  const handleSubmitRera = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", reraData.name);
    formData.append("number", reraData.number);
    formData.append("url", reraData.url);
    formData.append("image", reraData.image);

    setIsReraLoading(true);
    try {
      const response = isReraEditId ? await updateRera(isReraEditId, formData) : await addRera(formData);
      if (response) {
        setReraData({
          name: "",
          number: "",
          url: "",
          image: "",
        });
        fetchReraData();
        if (reraRef.current) reraRef.current.value = "";
      }
    } catch (e) {
      console.log(e?.message);
    } finally {
      setIsReraLoading(false);
    }
  };

  // Floor plan all fields onChange common function
  const onChangeRera = (e, file) => {
    if (file) {
      const name = e.target.name;
      const value = e.target.files[0];
      setReraData({
        ...reraData,
        [name]: value,
      });
    } else {
      const { name, value } = e.target;
      setReraData({
        ...reraData,
        [name]: value,
      });
    }
  };

  // fetch all floor plan data
  const fetchReraData = async () => {
    const response = await fetchAllRera();
    if (response.length > 0) {
      setHasReraData(response);
    }
  };
  useEffect(() => {
    fetchReraData(); // fetch all flor plan data
  }, [hasReraRowDeleted]);

  // fetch single property
  const fetchReraSingleData = async () => {
    const response = await fetchSingleRera(isReraEditId);
    setReraData({
      name: response?.name,
      number: response?.number,
      url: response?.url,
      image: response?.image,
    });
  };
  useEffect(() => {
    fetchReraSingleData();
  }, [isReraEditId]);

  return (
    <>
      {/* Project information container */}
      <CustomAccordion heading="Project Information">
        <form onSubmit={handleProjectInfo}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <div>
                {isProjectLoading ? (
                  <p>Loading...</p>
                ) : projectList && projectList.length === 0 ? (
                  <div className="space-y-2">
                    <label className="font-medium text-gray-700">Project Name</label>
                    <p className="mt-1 text-sm text-gray-500">Create Active Project</p>
                  </div>
                ) : (
                  <SelectDropdown
                    label="Project Name"
                    value={selectedProject}
                    options={projectList}
                    onChange={setSelectedProject}
                    placeholder="Choose a country"
                  />
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

            <div className="sm:col-span-3">
              <Input label="Min Size" placeholder="Enter your min size" name="minSize" value={projectFormData.minSize} onChange={handleChange} />
            </div>
            <div className="sm:col-span-3">
              <Dropdown label="Min Size Unit" name="minSizeUnit" items={minSizeUnit} handleChange={handleChange} value={projectFormData.minSizeUnit} />
            </div>
            <div className="sm:col-span-3">
              <Input label="Max Size" placeholder="Enter your maxSize" name="maxSize" value={projectFormData.maxSize} onChange={handleChange} />
            </div>
            <div className="sm:col-span-3">
              <Dropdown label="Max Size Unit" name="maxSizeUnit" items={maxSizeUnit} handleChange={handleChange} value={projectFormData.maxSizeUnit} />
            </div>

            <div className="sm:col-span-4">
              <SelectDropdown
                label="Property Sub Category"
                value={selectedSubCategory}
                options={hasSubCategory}
                onChange={setSelectedSubCategory}
                placeholder="Choose an sub category"
                isMulti={true}
              />
            </div>

            <div className="sm:col-span-4">
              <SelectDropdown
                label="Topology"
                value={selectedTopology}
                options={hasTopology}
                onChange={setSelectedTopology}
                placeholder="Choose an sub topology"
                isMulti={true}
              />
            </div>
            <div className="sm:col-span-4">
              <SelectDropdown
                label="Microsite"
                value={selectedMicrocity}
                options={hasMicrocity}
                onChange={setSelectedMicrocity}
                placeholder="Choose an sub microcity"
                isMulti={true}
              />
            </div>
            <div className="sm:col-span-4">
              {isAmentiesLoading ? (
                <p>Loading...</p>
              ) : amentiesList && amentiesList.length === 0 ? (
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">Amenties</label>
                  <p className="mt-1 text-sm text-gray-500">Create Active Amenties</p>
                </div>
              ) : (
                <SelectDropdown
                  label="Amenties"
                  value={selectedAmenties}
                  options={amentiesList}
                  onChange={setSelectedAmenties}
                  placeholder="Choose a Amenties"
                  isMulti={true}
                />
              )}
            </div>
            <div className="sm:col-span-4">
              {isFacilityLoading ? (
                <p>Loading...</p>
              ) : facilityList && facilityList.length === 0 ? (
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">Facility</label>
                  <p className="mt-1 text-sm text-gray-500">Create Active Facility</p>
                </div>
              ) : (
                <SelectDropdown
                  label="Facility"
                  value={selectedFacility}
                  options={facilityList}
                  onChange={setSelectedFacility}
                  placeholder="Choose a Amenties"
                  isMulti={true}
                />
              )}
            </div>
            <div className="sm:col-span-4">
              {ismicrocityLoading ? (
                <p>Loading...</p>
              ) : microcityList && microcityList.length === 0 ? (
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">Related Property Location</label>
                  <p className="mt-1 text-sm text-gray-500">Create Active Microcity</p>
                </div>
              ) : (
                <SelectDropdown
                  label="Related Property Location"
                  value={selectedRelatedProperties}
                  options={microcityList}
                  onChange={setSelectedRelatedProperties}
                  placeholder="Choose a realted property location"
                  isMulti={true}
                />
              )}
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
              <Input
                label="Property Featured Image"
                type="file"
                placeholder="Enter your property featured iamge"
                name="featuredImage"
                onChange={(e) => handleChange(e, true)}
              />
            </div>
            <div className="sm:col-span-4">
              <Input
                label="Property Featured Image Title"
                type="text"
                placeholder="Enter your featured image title"
                name="featuredImageTitle"
                onChange={handleChange}
                value={projectFormData?.featuredImageTitle}
              />
            </div>
            <div className="sm:col-span-4">
              <Input
                label="Property Featured Image Alt"
                type="text"
                placeholder="Enter your featured image alt"
                name="featuredImageAlt"
                onChange={handleChange}
                value={projectFormData?.featuredImageAlt}
              />
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loding..." : "Submit"}
            </Button>
          </div>
        </form>
      </CustomAccordion>

      {/* Property Image */}
      <CustomAccordion heading="Property Image">
        {/* Add Property image form */}
        <form onSubmit={handleSubmitPropertyImage}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="col-span-3">
              <Input
                label="Property Image"
                type="file"
                placeholder="Enter your property image"
                name="propertyImageTable"
                ref={propertyImageRef}
                onChange={(e) => handlePropertyImageChange(e, true)}
              />
              {propertyImageFormData?.propertyImageTable && (
                <img
                  src={
                    propertyImageRef.current?.files?.length > 0
                      ? URL?.createObjectURL(propertyImageFormData?.propertyImageTable)
                      : propertyImageFormData?.propertyImageTable
                  }
                  alt="Thumbnail Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                />
              )}
            </div>
            <div className="col-span-3">
              <Input
                label="Title"
                type="text"
                placeholder="Enter your title"
                name="propertyTitleTable"
                onChange={(e) => handlePropertyImageChange(e)}
                value={propertyImageFormData?.propertyTitleTable}
              />
            </div>
            <div className="col-span-3">
              <Input
                label="Alt"
                type="text"
                placeholder="Enter your alt"
                name="propertyAltTable"
                onChange={handlePropertyImageChange}
                value={propertyImageFormData?.propertyAltTable}
              />
            </div>
            <div className="col-span-3 mt-[32px]">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isPropertyImageDataLoding ||
                  !propertyImageFormData?.propertyImageTable ||
                  !propertyImageFormData?.propertyTitleTable ||
                  !propertyImageFormData?.propertyAltTable
                }
              >
                {isPropertyImageDataLoding ? "Loding..." : "save"}
              </Button>
            </div>
          </div>
        </form>
        {/* Table for add property image form */}
        <div className="mt-10">
          <PropertyImageTable
            propertyImageDataContainer={propertyImageDataContainer}
            setHasImageRowDeleted={setHasImageRowDeleted}
            setIsEditPropertyImageId={setIsEditPropertyImageId}
          />
        </div>
      </CustomAccordion>

      {/* Property Gallery Image */}
      <CustomAccordion heading="Property Gallery Image">
        {/* Add Property gallery form */}
        <form onSubmit={handleSubmitGallery}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="col-span-3">
              <Input
                label="Property Image"
                type="file"
                placeholder="Enter your property image"
                name="galleryImageTable"
                ref={galleryRef}
                onChange={(e) => handleGalleryChange(e, true)}
              />
              {galleryFormData?.galleryImageTable && (
                <img
                  src={galleryRef.current?.files?.length > 0 ? URL?.createObjectURL(galleryFormData?.galleryImageTable) : galleryFormData?.galleryImageTable}
                  alt="Thumbnail Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                />
              )}
            </div>
            <div className="col-span-3">
              <Input
                label="Title"
                type="text"
                placeholder="Enter your title"
                name="galleryTitleTable"
                onChange={(e) => handleGalleryChange(e)}
                value={galleryFormData?.galleryTitleTable}
              />
            </div>
            <div className="col-span-3">
              <Input
                label="Alt"
                type="text"
                placeholder="Enter your alt"
                name="galleryAltTable"
                onChange={handleGalleryChange}
                value={galleryFormData?.galleryAltTable}
              />
            </div>
            <div className="col-span-3 mt-[32px]">
              <Button
                type="submit"
                className="w-full"
                // disabled={
                //   isPropertyImageDataLoding || !galleryFormData?.galleryImageTable || !galleryFormData?.galleryTitleTable || !galleryFormData?.galleryAltTable
                // }
              >
                save
                {/* {isPropertyImageDataLoding ? "Loding..." : "save"} */}
              </Button>
            </div>
          </div>
        </form>
        {/* Table for add property gallery form */}
        <div className="mt-10">
          {hasGalleryData.length > 0 && (
            <PropertyGalleryTable hasGalleryData={hasGalleryData} setHasGalleryRowDeleted={setHasGalleryRowDeleted} setIsEditGalleryId={setIsEditGalleryId} />
          )}
        </div>
      </CustomAccordion>

      {/* floor plan */}
      <CustomAccordion heading="Floor Plan">
        <form onSubmit={handleSubmitFloorPlan}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="col-span-2">
              <Input
                label="Floor Type"
                type="text"
                placeholder="Enter your title"
                name="floorType"
                onChange={(e) => onChangeFloorPlan(e)}
                value={floorPlan?.floorType}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Floor Price"
                type="text"
                placeholder="Enter your Floor Price"
                name="floorPrice"
                onChange={(e) => onChangeFloorPlan(e)}
                value={floorPlan?.floorPrice}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Floor Image Title"
                type="text"
                placeholder="Enter your Floor Image Title"
                name="floorImageTitle"
                onChange={(e) => onChangeFloorPlan(e)}
                value={floorPlan?.floorImageTitle}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Floor ALT"
                type="text"
                placeholder="Enter your Floor ALT"
                name="floorAlt"
                onChange={(e) => onChangeFloorPlan(e)}
                value={floorPlan?.floorAlt}
              />
            </div>
            <div className="col-span-2">
              <Input label="Image" type="file" placeholder="Enter your image" ref={floorPlanRef} name="image" onChange={(e) => onChangeFloorPlan(e, true)} />
              {floorPlan?.image && (
                <img
                  src={floorPlanRef.current?.files?.length > 0 ? URL?.createObjectURL(floorPlan?.image) : floorPlan?.image}
                  alt="Thumbnail Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                />
              )}
            </div>
            <div className="col-span-2 mt-[32px]">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isFloorPlanLoading ||
                  !floorPlan?.floorType ||
                  !floorPlan?.floorPrice ||
                  !floorPlan?.floorImageTitle ||
                  !floorPlan?.floorAlt ||
                  !floorPlan?.image
                }
              >
                {isFloorPlanLoading ? "Loading..." : "save"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-10">
          <FloorPlanTable
            hasFloorPlanData={hasFloorPlanData}
            setHasFloorPlanRowDeleted={setHasFloorPlanRowDeleted}
            setIsFloorPlanEditId={setIsFloorPlanEditId}
          />
        </div>
      </CustomAccordion>

      {/* Faq section */}
      <CustomAccordion heading="Faq">
        <p>lorem 20222</p>
      </CustomAccordion>

      {/* Reara details */}
      <CustomAccordion heading="Rera Details">
        <form onSubmit={handleSubmitRera}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="col-span-2">
              <Input label="RERA Name" type="text" placeholder="Enter your name" name="name" onChange={(e) => onChangeRera(e)} value={reraData?.name} />
            </div>
            <div className="col-span-2">
              <Input
                label="RERA Number"
                type="text"
                placeholder="Enter your RERA Number"
                name="number"
                onChange={(e) => onChangeRera(e)}
                value={reraData?.number}
              />
            </div>
            <div className="col-span-2">
              <Input label="Rera URL" type="text" placeholder="Enter your Rera URL" name="url" onChange={(e) => onChangeRera(e)} value={reraData?.url} />
            </div>
            <div className="col-span-4">
              <Input label="Image" type="file" placeholder="Enter your image" ref={reraRef} name="image" onChange={(e) => onChangeRera(e, true)} />
              {reraData?.image && (
                <img
                  src={reraRef.current?.files?.length > 0 ? URL?.createObjectURL(reraData?.image) : reraData?.image}
                  alt="Thumbnail Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                />
              )}
            </div>
            <div className="col-span-2 mt-[32px]">
              <Button type="submit" className="w-full" disabled={isReraLoading || !reraData?.name || !reraData?.number || !reraData?.url || !reraData?.image}>
                {isReraLoading ? "Loading..." : "save"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-10">
          <ReraTable hasReraData={hasReraData} setHasReraRowDeleted={setHasReraRowDeleted} setIsReraEditId={setIsReraEditId} />
        </div>
      </CustomAccordion>

      {/* other information container */}
      <CustomAccordion heading="Other Information">
        <p>lorem 20</p>
      </CustomAccordion>
    </>
  );
}
