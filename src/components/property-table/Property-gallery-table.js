"use client";

import { deleteGallery } from "@/actions/project-actions";
import CustomTable from "@/components/custom-table";
import DeleteModal from "@/components/modal/delete-modal";
import { useState } from "react";

export default function PropertyGalleryTable({ hasGalleryData = [], setHasGalleryRowDeleted, setIsEditGalleryId }) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isSingleRowData, setIsSingleRowData] = useState("");
  console.log("s", hasGalleryData);

  const columns = [
    {
      header: "S.NO",
      accessorKey: "id",
      cell: (cellInfo) => cellInfo.row.index + 1,
    },
    {
      header: "Image",
      accessorKey: "image",
      cell: (cellInfo) => (
        <img src={cellInfo?.row?.original?.image} alt="Country" className="w-16 h-16 object-cover rounded-md border border-gray-300 shadow-sm mx-auto" />
      ),
    },
    {
      header: "Image Title",
      accessorKey: "title",
    },
    {
      header: "Image Alt",
      accessorKey: "alt",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (cellInfo) => (
        <div className="space-x-2">
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => {
              setIsEditGalleryId(cellInfo?.row?.original?._id);
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

  // deleted row
  const handleDeletedRow = async () => {
    const response = await deleteGallery(isSingleRowData?._id);
    console.log(response);
    if (response) {
      setHasGalleryRowDeleted((prev) => !prev);
      setIsOpenDeleteModal(false);
    }
  };

  return (
    <>
      <div className="mt-5">
        <CustomTable columns={columns} data={hasGalleryData} />
      </div>
      {isOpenDeleteModal && (
        <DeleteModal isOpenDeleteModal={isOpenDeleteModal} setIsOpenDeleteModal={setIsOpenDeleteModal} handleDeletedRow={handleDeletedRow} />
      )}
    </>
  );
}
