"use client";

import CustomTable from "@/components/custom-table";
import DeleteModal from "@/components/modal/delete-modal";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const router = useRouter();
  const [propertyCategoryTableData, setPropertyCategoryTableData] = useState([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isSingleRowData, setIsSingleRowData] = useState("");

  const columns = [
    {
      header: "S.NO",
      accessorKey: "id",
      cell: (cellInfo) => cellInfo.row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Image",
      accessorKey: "image",
      cell: (cellInfo) => (
        <img src={cellInfo?.row?.original?.image} alt="Country" className="w-16 h-16 object-cover rounded-md border border-gray-300 shadow-sm mx-auto" />
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.status === true ? "Active" : "Inactive"}</div>,
    },
    {
      header: "Featured",
      accessorKey: "featured",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.featured === true ? "Featured" : "No Featured"}</div>,
    },
    {
      header: "Index",
      accessorKey: "index",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.index === true ? "Index" : "No Index"}</div>,
    },
    {
      header: "Action",
      accessorKey: "title",
      cell: (cellInfo) => (
        <div className="space-x-2">
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => {
              handleRedirectPropertyCategoryFormPage(cellInfo?.row?.original);
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

  // fetch countries
  const fetchPropertyCategory = async () => {
    const response = await apiCall("/propertyCategory");
    if (!response.error) {
      setPropertyCategoryTableData(response);
    }
  };

  useEffect(() => {
    fetchPropertyCategory();
  }, []);

  // redirect to the propertyCategory form page
  const handleRedirectPropertyCategoryFormPage = (rowData) => {
    router.push(`/dashboard/propertyCategory/form?id=${rowData?._id}`);
  };

  // deleted row
  const handleDeletedRow = async () => {
    const response = await apiCall(`/propertyCategory/${isSingleRowData?._id}`, "DELETE");
    if (!response.error) {
      setIsOpenDeleteModal(false);
      fetchPropertyCategory();
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-semibold">Property Category</h1>
          <Button onClick={() => router.push("/dashboard/propertyCategory/form")}>Add Property Category</Button>
        </div>

        <div className="mt-5">
          <CustomTable columns={columns} data={propertyCategoryTableData?.data} />
        </div>
      </div>

      {isOpenDeleteModal && (
        <DeleteModal isOpenDeleteModal={isOpenDeleteModal} setIsOpenDeleteModal={setIsOpenDeleteModal} handleDeletedRow={handleDeletedRow} />
      )}
    </>
  );
}
