"use client";

import { CustomCheckbox } from "@/components/forms/Checkbox";
import Input from "@/components/forms/Input";
import { CustomToggle } from "@/components/forms/Toggle";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/custom-table";
import { apiCall } from "@/lib/api";
import { showToast } from "@/components/toastProvider";
import { ModalContainer } from "@/components/modal/modal-container";
import { DateTime } from "luxon";

export default function page() {
  const inputRef = useRef(null);
  const checkboxRef = useRef(null);
  const toggleRef = useRef(null);
  const [TagName, setTagName] = useState("");
  const [isCheckedIndex, setIsCheckedIndex] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tagTableData, setTagTableData] = useState([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isSingleRowData, setIsSingleRowData] = useState("");

  // Table columns
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
              setIsSingleRowData(cellInfo?.row?.original);
              setTagName(cellInfo?.row?.original?.name);
              setIsCheckedIndex(cellInfo?.row?.original?.index);
              setIsActive(cellInfo?.row?.original?.status);
              setIsOpen(true);
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

  // Added tag
  const handleTagFromSubmit = async (e) => {
    e.preventDefault();

    const tagObj = {
      name: TagName,
      index: isCheckedIndex,
      status: isActive,
    };

    // calling api update and add api
    const response = isSingleRowData?._id ? await apiCall(`/tag/${isSingleRowData?._id}`, "PUT", tagObj) : await apiCall(`tag`, "POST", tagObj);

    if (response?.error) {
      showToast(response.message);
    } else {
      showToast(response.message, "success");
      setIsOpen(false);
      fetchTagData();
    }

    setTagName("");
    setIsCheckedIndex(false);
    setIsActive(false);
  };

  // Fetch tag data
  const fetchTagData = async () => {
    const response = await apiCall("/tag");
    setTagTableData(response);
  };
  useEffect(() => {
    fetchTagData();
  }, []);

  // Deleted tag
  const handleDeleteTag = async () => {
    const response = await apiCall(`/tag/${isSingleRowData?._id}`, "DELETE");
    if (!response.error) {
      fetchTagData();
      setIsOpenDeleteModal(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-semibold ">Blog Tag</h1>

          {/* Add tag and update tag mdoal */}
          <Button onClick={() => setIsOpen(true)}>Add Tag</Button>
          <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
            <form action="" onSubmit={handleTagFromSubmit}>
              <div className="mb-5">
                <Input ref={inputRef} label="Tag Name" placeholder="Enter your tag name" onChange={(e) => setTagName(e.target.value)} value={TagName} />
              </div>
              <div className="mb-5">
                <CustomCheckbox ref={checkboxRef} label="Index" onCheckedChange={(checked) => setIsCheckedIndex(checked)} checked={isCheckedIndex} />
              </div>
              <div className="mb-[40px]">
                <CustomToggle ref={toggleRef} label="status (Active / Inactive)" onCheckedChange={(checked) => setIsActive(checked)} checked={isActive} />
              </div>
              <Button onClick={() => setIsOpen(false)} type="button">
                Close
              </Button>{" "}
              &nbsp;
              <Button type="submit">Submit</Button>
            </form>
          </ModalContainer>
        </div>

        <div className="mt-5">
          <CustomTable columns={columns} data={tagTableData?.data} />
        </div>
      </div>

      {/* This popup modal open after click on table delete button */}
      <ModalContainer isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
        <h3 className="text-lg font-semibold text-gray-800">Are you sure you want to delete this tag?</h3>
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
            onClick={handleDeleteTag}
          >
            Delete
          </button>
        </div>
      </ModalContainer>
    </>
  );
}
