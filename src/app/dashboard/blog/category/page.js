"use client";

import { CustomCheckbox } from "@/components/forms/Checkbox";
import Input from "@/components/forms/Input";
import { CustomToggle } from "@/components/forms/Toggle";
import ModalController from "@/components/modal/wraperForCloseAndOpenModal";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/custom-table";

export default function page() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // ✅ This will focus on the input field
    }
  };

  const checkboxRef = useRef(null);

  const handleCheck = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = !checkboxRef.current.checked; // ✅ Toggles the checkbox state
    }
  };

  const toggleRef = useRef(null);

  const handleToggle = () => {
    if (toggleRef.current) {
      toggleRef.current.click(); // ✅ Programmatically toggles the switch
    }
  };

  const columns = [
    {
      header: "S.NO",
      accessorKey: "id",
      // cell: (cellInfo) => pagination.serialNumberStartFrom + cellInfo.row.index,
    },
    {
      header: "Name",
      accessorKey: "name",
    },

    // {
    //   header: "Index/No-Index",
    //   accessorKey: "indexing",
    // },
    {
      header: "Creation Date",
      accessorKey: "created_date",
      // cell: (info) => DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
    },
    {
      header: "Last Updated Date	",
      accessorKey: "last_update_date",
      // cell: (info) => DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
    },
    {
      header: "Action",
      accessorKey: "action",
      // cell: (cellInfo) => (
      //   <div className="d-flex gap-2 justify-content-center">
      //     <div className="cursor" onClick={() => handleEditCategory(cellInfo?.row?.original)} data-bs-toggle="modal" data-bs-target="#commonModal">
      //       {editIcon}
      //     </div>
      //     <div className="cursor" onClick={() => handleDeleteCategory(cellInfo?.row?.original?.id)} data-bs-toggle="modal" data-bs-target="#deleteModal">
      //       {deleteIcon}
      //     </div>
      //   </div>
      // ),
    },
    {
      header: "Status",
      accessorKey: "status",
      // cell: (cellInfo) => (
      //   <div>{cellInfo?.row?.original?.status === "INACTIVE" ? <span className="status-red"></span> : <span className="status-green"></span>}</div>
      // ),
    },
  ];
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];
  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-semibold ">Blog Category</h1>
          {/* mdoal */}
          <ModalController btnName="Add Category">
            <div className="mb-5">
              <Input ref={inputRef} label="Category Name" placeholder="Enter your category name" />
            </div>
            <div className="mb-5">
              <CustomCheckbox ref={checkboxRef} label="Index" />
            </div>
            <div className="mb-[40px]">
              <CustomToggle ref={toggleRef} label="status (Active / Inactive)" />
            </div>
            <Button>Close</Button> &nbsp;
            <Button>Submit</Button>
          </ModalController>
        </div>

        <div className="mt-5">
          <CustomTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
