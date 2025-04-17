"use client";

import { deletePropertyImage } from "@/actions/project-actions";
import CustomTable from "@/components/custom-table";
import DeleteModal from "@/components/modal/delete-modal";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertyImageTable({
  propertyImageDataContainer,
  setHasImageRowDeleted,
}) {
  console.log(propertyImageDataContainer);
  const router = useRouter();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isSingleRowData, setIsSingleRowData] = useState("");

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
        <img
          src={cellInfo?.row?.original?.image}
          alt="Country"
          className="w-16 h-16 object-cover rounded-md border border-gray-300 shadow-sm mx-auto"
        />
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
      accessorKey: "title",
      cell: (cellInfo) => (
        <div className="space-x-2">
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => {
              handleRedirectBuilderFormPage(cellInfo?.row?.original);
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

  // redirect to the builder form page
  const handleRedirectBuilderFormPage = (rowData) => {
    router.push(`/dashboard/builder/form?id=${rowData?._id}`);
  };

  // deleted row
  const handleDeletedRow = async () => {
    // const response = await apiCall(`/builder/${isSingleRowData?._id}`, "DELETE");
    const response = await deletePropertyImage(isSingleRowData?._id);
    if (!response.error) {
      setHasImageRowDeleted((prev) => !prev);
      setIsOpenDeleteModal(false);
    }
  };

  return (
    <>
      {/* <div className="p-4 bg-white rounded-lg border border-gray-200"> */}
      <div className="mt-5">
        <CustomTable
          columns={columns}
          data={propertyImageDataContainer?.data}
        />
      </div>
      {/* </div> */}

      {isOpenDeleteModal && (
        <DeleteModal
          isOpenDeleteModal={isOpenDeleteModal}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
          handleDeletedRow={handleDeletedRow}
        />
      )}
    </>
  );
}
