import React from "react";

export default function page() {
  const handleCitiesFormData = (e) => {};
  return (
    <>
      <form onSubmit={handleCitiesFormData}>
        <div className="grid grid-cols-1 sm:grid-cols-6">
          <div className="sm:col-span-6 col-span-12">
            <Input label="Title *" placeholder="Enter your category name" name="title" value={blogFieldData?.title} onChange={handleChange} />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Input label="Title *" placeholder="Enter your category name" name="title" value={blogFieldData?.title} onChange={handleChange} />
          </div>
        </div>
      </form>
    </>
  );
}
