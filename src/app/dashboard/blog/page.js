"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import CustomTable from "@/components/custom-table";
import { apiCall } from "@/lib/api";
import { DateTime } from "luxon";
import { ModalContainer } from "@/components/modal/modal-container";

export default function Page() {
  const router = useRouter();
  const [blogTableData, setBlogTableData] = useState([]);
  const [isSingleRowData, setIsSingleRowData] = useState("");
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const columns = [
    {
      header: "S.NO",
      accessorKey: "id",
      // cell: (cellInfo) => pagination.serialNumberStartFrom + cellInfo.row.index,
    },
    {
      header: "Title",
      accessorKey: "title",
    },

    {
      header: "Index/No-Index",
      accessorKey: "index",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.index === true ? "Index" : "No Index"}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.status === true ? "Active" : "Inactive"}</div>,
    },
    {
      header: "Creation Date",
      accessorKey: "createdAt",
      cell: (info) => DateTime?.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
    },
    {
      header: "Last Updated Date	",
      accessorKey: "updatedAt",
      cell: (info) => DateTime?.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (cellInfo) => (
        <div className="space-x-2">
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => {
              handleRedirectBlogPage(cellInfo?.row?.original);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
            onClick={(e) => {
              e.preventDefault();
              setIsSingleRowData(cellInfo?.row?.original);
              setIsOpenDeleteModal(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // fetch blogs
  const fetchBlogs = async () => {
    const response = await apiCall("/blog");
    if (!response.error) {
      setBlogTableData(response);
      setIsOpenDeleteModal(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // deleted blogs
  const handleDeletedBlog = async () => {
    const response = await apiCall(`/blog/${isSingleRowData?._id}`, "DELETE");
    if (!response.error) {
      fetchBlogs();
    }
  };

  // redirect to the blog page
  const handleRedirectBlogPage = async (rowData) => {
    router.push(`/dashboard/blog/blog-form?id=${rowData?._id}`);
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-semibold">Blog</h1>
          <Button onClick={() => router.push("/dashboard/blog/blog-form")}>Add Blog</Button>
        </div>

        <div className="mt-5">
          <CustomTable columns={columns} data={blogTableData?.data} />
        </div>
      </div>

      {/* This popup modal open after click on table delete button */}
      <ModalContainer isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
        <h3 className="text-lg font-semibold text-gray-800">Are you sure you want to delete this category?</h3>
        <div className="flex gap-2 justify-center mt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
            onClick={() => setIsOpenDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
            onClick={handleDeletedBlog}
          >
            Delete
          </button>
        </div>
      </ModalContainer>
    </>
  );
}
