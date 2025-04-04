"use client";

import CustomTable from "@/components/custom-table";
import DeleteModal from "@/components/modal/delete-modal";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const router = useRouter();
  const [microcityTableData, setMicrocityTableData] = useState([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isSingleRowData, setIsSingleRowData] = useState("");

  const columns = [
    {
      header: "S.NO",
      accessorKey: "id",
      cell: (cellInfo) => cellInfo.row.index + 1,
    },
    {
      header: "MicroCity	",
      accessorKey: "name",
    },
    {
      header: "City",
      accessorKey: "name",
    },
    {
      header: "State	",
      accessorKey: "name",
    },
    {
      header: "Country",
      accessorKey: "name",
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

  // fetch microcity
  const fetchCities = async () => {
    const response = await apiCall("/microcities");
    if (!response.error) {
      setMicrocityTableData(response);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // redirect to the` microcity form page
  const handleRedirectStateFormPage = (rowData) => {
    router.push(`/dashboard/location/microcities/form?id=${rowData?._id}`);
  };

  // deleted row
  const handleDeletedRow = async () => {
    const response = await apiCall(`/microcities/${isSingleRowData?._id}`, "DELETE");
    if (!response.error) {
      setIsOpenDeleteModal(false);
      fetchCities();
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-semibold">Microcity</h1>
          <Button onClick={() => router.push("/dashboard/location/microcities/form")}>Add Microcity</Button>
        </div>

        <div className="mt-5">
          <CustomTable columns={columns} data={microcityTableData?.data} />
        </div>
      </div>

      {/* Popup modal is used for delete conformation state */}
      {isOpenDeleteModal && (
        <DeleteModal isOpenDeleteModal={isOpenDeleteModal} setIsOpenDeleteModal={setIsOpenDeleteModal} handleDeletedRow={handleDeletedRow} />
      )}
    </>
  );
}
