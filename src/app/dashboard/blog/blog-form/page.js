"use client";

import CustomEditor from "@/components/forms/CustomEditor";
import SelectDropdown from "@/components/forms/CustomSelect";
import Input from "@/components/forms/Input";
import Textarea from "@/components/forms/Textarea";
import { CustomToggle } from "@/components/forms/Toggle";
import { Button } from "@/components/ui/button";
import { useFetchActiveList } from "@/hooks/use-activeList";
import React, { useEffect, useState, useRef } from "react";
import { apiCall } from "@/lib/api";
import { showToast } from "@/components/toastProvider";
import useSlug from "@/hooks/use-slug";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";

export default function Page() {
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIndex, setIndex] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [editorData, setEditorData] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const thumbnailRef = useRef(null);
  const featuredRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);

  const { list: categoryList, isLoading: categoryLoading, error: categoryError } = useFetchActiveList(`category?status=true`); // fetch active category
  const { list: tagList, isLoading: tagLoading, error: tagError } = useFetchActiveList(`tag?status=true`); // fetch active category

  const [blogFieldData, setBlogFieldData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
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

  const slug = useSlug(blogFieldData?.title || ""); // slug genration on the basis of title

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

    const data = new FormData();
    data.append("title", blogFieldData?.title);
    data.append("slug", slug);
    data.append("shortDescription", blogFieldData?.shortDescription);
    data.append("longDescription", JSON.stringify(editorData));
    data.append("metaTitle", blogFieldData?.metaTitle);
    data.append("metaKeywords", blogFieldData?.metaKeywords);
    data.append("metaDescription", blogFieldData?.metaDescription);
    data.append("canonicalTag", blogFieldData?.canonicalTag);
    data.append("hrefLangTag", blogFieldData?.hrefLangTag);
    data.append("geoRegion", blogFieldData?.geoRegion);
    data.append("geoPlacename", blogFieldData?.geoPlacename);
    data.append("geoPosition", blogFieldData?.geoPosition);
    data.append("icbm", blogFieldData?.icbm);
    data.append("twitterCard", blogFieldData?.twitterCard);
    data.append("twitterURL", blogFieldData?.twitterURL);
    data.append("twitterTitle", blogFieldData?.twitterTitle);
    data.append("thumbnailImage", thumbnailImage);
    data.append("featuredImage", featuredImage);

    selectedCategory?.forEach((v, i) => {
      data.append(`categories[${i}]`, v.value);
    });

    selectedTag?.forEach((v, i) => {
      data.append(`tags[${i}]`, v.value);
    });

    data.append("featured", isFeatured);
    data.append("index", isIndex);
    data.append("status", isActive);

    const response = blogId ? await apiCall(`blog/${blogId}`, "PUT", data) : await apiCall(`blog`, "POST", data);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      // ✅ Reset all form fields
      setBlogFieldData({
        title: "",
        slug: "",
        shortDescription: "",
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

      setSelectedCategory(null);
      setSelectedTag(null);
      setEditorData(null);
      setThumbnailImage("");
      setFeaturedImage("");
      setIsFeatured(false);
      setIndex(false);
      setIsActive(false);

      if (thumbnailRef.current) thumbnailRef.current.value = "";
      if (featuredRef.current) featuredRef.current.value = "";

      router.push("/dashboard/blog"); // redirect to the dashboard blog page
    }
  };

  const fetchBlogOntheBasisOfId = async () => {
    if (!blogId) return;

    setIsLoadingBlog(true); // Start loading

    const response = await apiCall(`blog/${blogId}`);
    if (response?.data) {
      const data = response.data;
      setBlogFieldData({
        title: data?.title || "",
        slug: data?.slug || "",
        shortDescription: data?.shortDescription || "",
        metaTitle: data?.metaTitle || "",
        metaKeywords: data?.metaKeywords || "",
        metaDescription: data?.metaDescription || "",
        canonicalTag: data?.canonicalTag || "",
        hrefLangTag: data?.hrefLangTag || "",
        geoRegion: data?.geoRegion || "",
        geoPlacename: data?.geoPlacename || "",
        geoPosition: data?.geoPosition || "",
        icbm: data?.icbm || "",
        twitterCard: data?.twitterCard || "",
        twitterURL: data?.twitterURL || "",
        twitterTitle: data?.twitterTitle || "",
      });

      setEditorData(data?.longDescription || null);
      setThumbnailImage(data?.thumbnailImage || "");
      setFeaturedImage(data?.featuredImage || "");
      setIsFeatured(data?.featured || false);
      setIndex(data?.index || false);
      setIsActive(data?.status || false);

      if ((categoryList.length > 0 && data?.categories.length > 0) || (tagList.length > 0 && data?.tags.length > 0)) {
        const selectedCat = categoryList?.filter((cat) => data?.categories?.includes(cat.value));
        const selectedTags = tagList?.filter((tag) => data?.tags?.includes(tag.value));
        setSelectedCategory(selectedCat);
        setSelectedTag(selectedTags);
      }
    }

    setIsLoadingBlog(false); // End loading
  };
  useEffect(() => {
    fetchBlogOntheBasisOfId();
  }, [blogId, categoryList, tagList]);

  if (blogId && isLoadingBlog) return <Loading />;

  return (
    <>
      <form onSubmit={handleBlogFormSubmit}>
        {/* Title & Slug Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Title *" placeholder="Enter your category name" name="title" value={blogFieldData?.title} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input value={slug} label="Slug" placeholder="Slug on the basis of title" disabled />
          </div>
        </div>

        {/* Short Description */}
        <div className="mt-6">
          <Textarea label="Short Description" name="shortDescription" value={blogFieldData?.shortDescription} onChange={handleChange} />
        </div>

        {/* Editor */}
        <div className="mt-6">
          {/* <CustomEditor /> */}
          <CustomEditor onChange={setEditorData} label="Long Description" />
        </div>

        {/* File Upload Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6">
          <div className="sm:col-span-6 col-span-12">
            <Input type="file" ref={thumbnailRef} label="Thumbnail Image *" name="thumbnailImage" onChange={(e) => setThumbnailImage(e.target.files[0])} />
            {thumbnailImage && (
              <img
                src={thumbnailRef.current?.files?.length > 0 ? URL?.createObjectURL(thumbnailImage) : thumbnailImage}
                alt="Thumbnail Preview"
                className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
              />
            )}
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input type="file" ref={featuredRef} label="Featured Image *" name="featuredImage" onChange={(e) => setFeaturedImage(e.target.files[0])} />
            {featuredImage && (
              <img
                src={featuredRef?.current?.files?.length > 0 ? URL.createObjectURL(featuredImage) : featuredImage}
                alt="Thumbnail Preview"
                className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
              />
            )}
          </div>
        </div>

        {/* Meta Title & Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Meta Title" placeholder="Enter meta title" name="metaTitle" value={blogFieldData?.metaTitle} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input label="Meta Keywords" placeholder="Enter meta keyword" name="metaKeywords" value={blogFieldData?.metaKeywords} onChange={handleChange} />
          </div>
        </div>

        {/* Meta Description */}
        <div className="mt-4">
          <Textarea label="Meta Description" name="metaDescription" value={blogFieldData?.metaDescription} onChange={handleChange} />
        </div>

        {/* SEO & Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Input label="Canonical Tag" placeholder="Enter canonical tag" name="canonicalTag" value={blogFieldData?.canonicalTag} onChange={handleChange} />
          <Input label="Href Lang Tag" placeholder="Enter href lang tag" name="hrefLangTag" value={blogFieldData?.hrefLangTag} onChange={handleChange} />
          <Input label="Geo Region" placeholder="Enter geo region" name="geoRegion" value={blogFieldData?.geoRegion} onChange={handleChange} />
          <Input label="Geo Placename" placeholder="Enter geo placename" name="geoPlacename" value={blogFieldData?.geoPlacename} onChange={handleChange} />
          <Input label="Geo Position" placeholder="Enter geo position" name="geoPosition" value={blogFieldData?.geoPosition} onChange={handleChange} />
          <Input label="ICBM" name="icbm" placeholder="Enter ICBM" value={blogFieldData?.icbm} onChange={handleChange} />
          <Input label="Twitter Card" placeholder="Enter twitter card" name="twitterCard" value={blogFieldData?.twitterCard} onChange={handleChange} />
          <Input label="Twitter URL" placeholder="Enter twitter url" name="twitterURL" value={blogFieldData?.twitterURL} onChange={handleChange} />
          <Input label="Twitter Title" placeholder="Enter twitter title" name="twitterTitle" value={blogFieldData?.twitterTitle} onChange={handleChange} />

          {/* active category dropdown list */}
          {categoryLoading && <p>Loading...</p>}
          {categoryList?.length <= 0 && (
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Category</label>
              <p className="mt-1 text-sm text-gray-500">Create Active Category</p>
            </div>
          )}
          {categoryList?.length > 0 && (
            <>
              <SelectDropdown
                label="Category"
                value={selectedCategory}
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
              <SelectDropdown label="Tag" value={selectedTag} options={tagList} onChange={setSelectedTag} placeholder="Choose an tag" isMulti={true} />
            </>
          )}
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
