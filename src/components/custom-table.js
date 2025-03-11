"use client";

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import React, { useState } from "react";

export default function Table({ data = [], columns }) {
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      {/* Search Input */}
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        placeholder="Search..."
        className="mb-4 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden border-separate border-spacing-0">
          {data.length > 0 && (
            <>
              {/* Table Header */}
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wider">
                {table?.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="p-3 text-left cursor-pointer hover:bg-gray-200 transition-all border border-gray-200 first:rounded-tl-lg last:rounded-tr-lg"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (header.column.getIsSorted() === "asc" ? " ▲" : " ▼") : ""}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* Table Body */}
              <tbody className="bg-white">
                {table?.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-all border border-gray-200">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 text-gray-800 text-sm border border-gray-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-between items-center mt-4 space-y-2 sm:space-y-0">
        <div className="flex space-x-2">
          <button
            className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 disabled:opacity-50"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 disabled:opacity-50"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>

        {/* Page Input */}
        <div className="flex items-center space-x-2">
          <span>Page</span>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
          </strong>
          <span>| Go to page:</span>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border border-gray-300 rounded-md p-1 w-16 text-center"
          />
        </div>

        {/* Rows Per Page */}
        <select
          className="border border-gray-300 rounded-md p-1"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Rows Count */}
      <div className="mt-2 text-gray-600 text-sm">
        Showing {table.getRowModel().rows.length.toLocaleString()} of {table.getRowCount().toLocaleString()} Rows
      </div>
    </div>
  );
}
