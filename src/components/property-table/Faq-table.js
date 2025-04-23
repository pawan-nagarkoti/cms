"use client";

import { deleteFaq, deleteGallery } from "@/actions/project-actions";
import CustomTable from "@/components/custom-table";
import DeleteModal from "@/components/modal/delete-modal";
import { useState } from "react";

export default function FaqTable({ hasFaq = [], setHasFaqDeleted, setIsFaqEditId }) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isSingleRowData, setIsSingleRowData] = useState("");

  const columns = [
    {
      header: "S.NO",
      accessorKey: "id",
      cell: (cellInfo) => cellInfo.row.index + 1,
    },
    {
      header: "FAQ Question",
      accessorKey: "question",
    },
    {
      header: "FAQ Answer",
      accessorKey: "answer",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (cellInfo) => (
        <div className="space-x-2">
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => {
              setIsFaqEditId(cellInfo?.row?.original?._id);
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
    const response = await deleteFaq(isSingleRowData?._id);
    if (response) {
      setHasFaqDeleted((prev) => !prev);
      setIsOpenDeleteModal(false);
    }
  };

  return (
    <>
      <div className="mt-5">
        <CustomTable columns={columns} data={hasFaq} />
      </div>
      {isOpenDeleteModal && (
        <DeleteModal isOpenDeleteModal={isOpenDeleteModal} setIsOpenDeleteModal={setIsOpenDeleteModal} handleDeletedRow={handleDeletedRow} />
      )}
    </>
  );
}
