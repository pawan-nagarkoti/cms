"use client";

import CustomTable from "@/components/custom-table";
import DeleteModal from "@/components/modal/delete-modal";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const router = useRouter();
  const [builderTableData, setProjectTableData] = useState([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isSingleRowData, setIsSingleRowData] = useState("");

  const columns = [
    {
      header: "S.NO",
      accessorKey: "id",
      cell: (cellInfo) => cellInfo.row.index + 1,
    },
    {
      header: "Project",
      accessorKey: "name",
    },
    {
      header: "Builder",
      accessorKey: "builder",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.builder?.name}</div>,
    },
    {
      header: "Property Category",
      accessorKey: "propertyCategory",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.propertyCategory?.name}</div>,
    },
    {
      header: "Country",
      accessorKey: "country",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.country?.name}</div>,
    },
    {
      header: "State",
      accessorKey: "state",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.state?.name}</div>,
    },
    {
      header: "City",
      accessorKey: "city",
      cell: (cellInfo) => <div>{cellInfo?.row?.original?.city?.name}</div>,
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

  // fetch countries
  const fetchBuilder = async () => {
    const response = await apiCall("/project");
    if (!response.error) {
      setProjectTableData(response);
    }
  };

  useEffect(() => {
    fetchBuilder();
  }, []);

  // redirect to the project form page
  const handleRedirectBuilderFormPage = (rowData) => {
    router.push(`/dashboard/project/form?id=${rowData?._id}`);
  };

  // deleted row
  const handleDeletedRow = async () => {
    const response = await apiCall(`/project/${isSingleRowData?._id}`, "DELETE");
    if (!response.error) {
      setIsOpenDeleteModal(false);
      fetchBuilder();
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-semibold">Project</h1>
          <Button onClick={() => router.push("/dashboard/project/form")}>Add Project</Button>
        </div>

        <div className="mt-5">
          <CustomTable columns={columns} data={builderTableData?.data} />
        </div>
      </div>

      {isOpenDeleteModal && (
        <DeleteModal isOpenDeleteModal={isOpenDeleteModal} setIsOpenDeleteModal={setIsOpenDeleteModal} handleDeletedRow={handleDeletedRow} />
      )}
    </>
  );
}
