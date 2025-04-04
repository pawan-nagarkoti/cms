"use client";

import CustomTable from "@/components/custom-table";
import DeleteModal from "@/components/modal/delete-modal";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const router = useRouter();
  const [cityTableData, setCityTableData] = useState([]);
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
      header: "Abbrevation",
      accessorKey: "abbrevation",
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
              handleRedirectStateFormPage(cellInfo?.row?.original);
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

  // fetch state
  const fetchCities = async () => {
    const response = await apiCall("/cities");
    if (!response.error) {
      setCityTableData(response);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // redirect to the` state form page
  const handleRedirectStateFormPage = (rowData) => {
    router.push(`/dashboard/location/cities/form?id=${rowData?._id}`);
  };

  // deleted row
  const handleDeletedRow = async () => {
    const response = await apiCall(`/cities/${isSingleRowData?._id}`, "DELETE");
    if (!response.error) {
      setIsOpenDeleteModal(false);
      fetchCities();
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-semibold">Cities</h1>
          <Button onClick={() => router.push("/dashboard/location/cities/form")}>Add city</Button>
        </div>

        <div className="mt-5">
          <CustomTable columns={columns} data={cityTableData?.data} />
        </div>
      </div>

      {/* Popup modal is used for delete conformation state */}
      {isOpenDeleteModal && (
        <DeleteModal isOpenDeleteModal={isOpenDeleteModal} setIsOpenDeleteModal={setIsOpenDeleteModal} handleDeletedRow={handleDeletedRow} />
      )}
    </>
  );
}
