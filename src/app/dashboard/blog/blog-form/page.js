"use client";

import CustomEditor from "@/components/forms/CustomEditor";
import SelectDropdown from "@/components/forms/CustomSelect";
import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { CustomToggle } from "@/components/forms/Toggle";
import { Button } from "@/components/ui/button";
import { useFetchActiveList } from "@/hooks/use-activeList";
import React, { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";
import { showToast } from "@/components/toastProvider";

export default function Page() {
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [editorData, setEditorData] = useState(null);

  const {
    list: categoryList,
    isLoading: categoryLoading,
    error: categoryError,
  } = useFetchActiveList(`category?status=true`); // fetch active category
  const {
    list: tagList,
    isLoading: tagLoading,
    error: tagError,
  } = useFetchActiveList(`tag?status=true`); // fetch active category

  const [blogFieldData, setBlogFieldData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    thumbnailImage: "",
    featuredImage: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    canonicalTag: "",
    hrefLangTag: "",
    geoRegion: "",
    geoPlacename: "",
    geoPosition: "",
    icbm: "",
    twitterCard: "",
    twitterURL: "",
    twitterTitle: "",
  });

  // Handle Change for Input Fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogFieldData({
      ...blogFieldData,
      [name]: value,
    });
  };

  const handleBlogFormSubmit = async (e) => {
    e.preventDefault();
    const dataobj = {
      title: blogFieldData?.title,
      slug: blogFieldData?.slug,
      shortDescription: blogFieldData?.shortDescription,
      thumbnailImage: blogFieldData?.thumbnailImage,
      featuredImage: blogFieldData?.featuredImage,
      metaTitle: blogFieldData?.metaTitle,
      metaKeywords: blogFieldData?.metaKeywords,
      metaDescription: blogFieldData?.metaDescription,
      canonicalTag: blogFieldData?.canonicalTag,
      hrefLangTag: blogFieldData?.hrefLangTag,
      geoRegion: blogFieldData?.geoRegion,
      geoPlacename: blogFieldData?.geoPlacename,
      geoPosition: blogFieldData?.geoPosition,
      icbm: blogFieldData?.icbm,
      twitterCard: blogFieldData?.twitterCard,
      twitterURL: blogFieldData?.twitterURL,
      twitterTitle: blogFieldData?.metaTitle,
      longDescription: blogFieldData?.metaTitle,
      categories: selectedCategory,
      tags: selectedTag,
      featured: isFeatured,
      index: isIndex,
      status: isActive,
    };
    // const blogObject = {
    //   blogFieldData,
    //   isActive,
    //   isFeatured,
    //   isIndex,
    //   selectedCategory,
    //   selectedTag,
    //   editorData,
    // };

    const data = new FormData();
    data.append("title", blogFieldData?.title);
    data.append("slug", blogFieldData?.slug);
    data.append("shortDescription", blogFieldData?.slug);

    const response = await apiCall(`blog`, "POST", data);
    console.log(response);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
    }
  };

  return (
    <>
      <form onSubmit={handleBlogFormSubmit}>
        {/* Title & Slug Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Title *"
              placeholder="Enter your category name"
              name="title"
              value={blogFieldData?.title}
              onChange={handleChange}
            />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Slug"
              placeholder="Slug on the basis of title"
              disabled
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="mt-6">
          <Textarea
            label="Short Description"
            name="shortDescription"
            value={blogFieldData?.shortDescription}
            onChange={handleChange}
          />
        </div>

        {/* Editor */}
        <div className="mt-6">
          {/* <CustomEditor /> */}
          <CustomEditor onChange={setEditorData} label="Long Description" />
        </div>

        {/* File Upload Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6">
          <div className="sm:col-span-6 col-span-12">
            <Input
              type="file"
              label="Thumbnail Image *"
              name="thumbnailImage"
              value={blogFieldData?.thumbnailImage}
              onChange={handleChange}
            />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              type="file"
              label="Featured Image *"
              name="featuredImage"
              value={blogFieldData?.featuredImage}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Meta Title & Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6">
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Meta Title"
              placeholder="Enter meta title"
              name="metaTitle"
              value={blogFieldData?.metaTitle}
              onChange={handleChange}
            />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Meta Keywords"
              placeholder="Enter meta keyword"
              name="metaKeywords"
              value={blogFieldData?.metaKeywords}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Meta Description */}
        <div className="mt-4">
          <Textarea
            label="Meta Description"
            name="metaDescription"
            value={blogFieldData?.metaDescription}
            onChange={handleChange}
          />
        </div>

        {/* SEO & Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Input
            label="Canonical Tag"
            placeholder="Enter canonical tag"
            name="canonicalTag"
            value={blogFieldData?.canonicalTag}
            onChange={handleChange}
          />
          <Input
            label="Href Lang Tag"
            placeholder="Enter href lang tag"
            name="hrefLangTag"
            value={blogFieldData?.hrefLangTag}
            onChange={handleChange}
          />
          <Input
            label="Geo Region"
            placeholder="Enter geo region"
            name="geoRegion"
            value={blogFieldData?.geoRegion}
            onChange={handleChange}
          />
          <Input
            label="Geo Placename"
            placeholder="Enter geo placename"
            name="geoPlacename"
            value={blogFieldData?.geoPlacename}
            onChange={handleChange}
          />
          <Input
            label="Geo Position"
            placeholder="Enter geo position"
            name="geoPosition"
            value={blogFieldData?.geoPosition}
            onChange={handleChange}
          />
          <Input
            label="ICBM"
            name="icbm"
            placeholder="Enter ICBM"
            value={blogFieldData?.icbm}
            onChange={handleChange}
          />
          <Input
            label="Twitter Card"
            placeholder="Enter twitter card"
            name="twitterCard"
            value={blogFieldData?.twitterCard}
            onChange={handleChange}
          />
          <Input
            label="Twitter URL"
            placeholder="Enter twitter url"
            name="twitterURL"
            value={blogFieldData?.twitterURL}
            onChange={handleChange}
          />
          <Input
            label="Twitter Title"
            placeholder="Enter twitter title"
            name="twitterTitle"
            value={blogFieldData?.twitterTitle}
            onChange={handleChange}
          />

          {/* active category dropdown list */}
          {categoryLoading && <p>Loading...</p>}
          {categoryList?.length <= 0 && (
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Category</label>
              <p className="mt-1 text-sm text-gray-500">
                Create Active Category
              </p>
            </div>
          )}
          {categoryList?.length > 0 && (
            <>
              <SelectDropdown
                label="Category"
                options={categoryList}
                onChange={setSelectedCategory}
                placeholder="Choose an category"
                isMulti={true}
              />
            </>
          )}

          {/* active tag dropdown list */}
          {tagLoading && <p>Loading...</p>}
          {tagList?.length <= 0 && (
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Tag</label>
              <p className="mt-1 text-sm text-gray-500">Create Active Tag</p>
            </div>
          )}
          {tagList?.length > 0 && (
            <>
              <SelectDropdown
                label="Tag"
                options={tagList}
                onChange={setSelectedTag}
                placeholder="Choose an tag"
                isMulti={true}
              />
            </>
          )}
        </div>

        <div className="grid gap-3 mt-6">
          <CustomToggle
            label="Is Featured"
            onCheckedChange={(checked) => setIsFeatured(checked)}
            checked={isFeatured}
          />
          <CustomToggle
            label="Index"
            onCheckedChange={(checked) => setIndex(checked)}
            checked={isIndex}
          />
          <CustomToggle
            label="status (Active / Inactive)"
            onCheckedChange={(checked) => setIsActive(checked)}
            checked={isActive}
          />
        </div>

        <div className="text-center my-10">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </>
  );
}
