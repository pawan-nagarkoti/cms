"use client";

import CustomEditor from "@/components/forms/CustomEditor";
import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { CustomToggle } from "@/components/forms/Toggle";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function Page() {
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const [formData, setFormData] = useState({
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlogFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData, isActive, isFeatured, isIndex);
  };
  return (
    <>
      <form onSubmit={handleBlogFormSubmit}>
        {/* Title & Slug Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Title *" placeholder="Enter your category name" name="title" value={formData?.title} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input label="Slug" placeholder="Slug on the basis of title" disabled />
          </div>
        </div>

        {/* Short Description */}
        <div className="mt-6">
          <Textarea label="Short Description" name="shortDescription" value={formData?.shortDescription} onChange={handleChange} />
        </div>

        {/* Editor */}
        <div className="mt-6">
          <CustomEditor />
        </div>

        {/* File Upload Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6">
          <div className="sm:col-span-6 col-span-12">
            <Input type="file" label="Thumbnail Image *" name="thumbnailImage" value={formData?.thumbnailImage} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input type="file" label="Featured Image *" name="featuredImage" value={formData?.featuredImage} onChange={handleChange} />
          </div>
        </div>

        {/* Meta Title & Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Meta Title" placeholder="Enter meta title" name="metaTitle" value={formData?.metaTitle} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input
              label="Meta Keywords"
              placeholder="Enter meta keyword"
              name="metaKeywords"
              value={formData?.metaKeywords}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Meta Description */}
        <div className="mt-4">
          <Textarea label="Meta Description" name="metaDescription" value={formData?.metaDescription} onChange={handleChange} />
        </div>

        {/* SEO & Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Input label="Canonical Tag" placeholder="Enter canonical tag" name="canonicalTag" value={formData?.canonicalTag} onChange={handleChange} />
          <Input label="Href Lang Tag" placeholder="Enter href lang tag" name="hrefLangTag" value={formData?.hrefLangTag} onChange={handleChange} />
          <Input label="Geo Region" placeholder="Enter geo region" name="geoRegion" value={formData?.geoRegion} onChange={handleChange} />
          <Input label="Geo Placename" placeholder="Enter geo placename" name="geoPlacename" value={formData?.geoPlacename} onChange={handleChange} />
          <Input label="Geo Position" placeholder="Enter geo position" name="geoPosition" value={formData?.geoPosition} onChange={handleChange} />
          <Input label="ICBM" name="icbm" placeholder="Enter ICBM" value={formData?.icbm} onChange={handleChange} />
          <Input label="Twitter Card" placeholder="Enter twitter card" name="twitterCard" value={formData?.twitterCard} onChange={handleChange} />
          <Input label="Twitter URL" placeholder="Enter twitter url" name="twitterURL" value={formData?.twitterURL} onChange={handleChange} />
          <Input label="Twitter Title" placeholder="Enter twitter title" name="twitterTitle" value={formData?.twitterTitle} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-4 gap-5 mt-6">
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
