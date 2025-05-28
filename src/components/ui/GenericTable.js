"use client";

import React, { useState } from "react";

export default function GenericTable({ data = [], renderers = {} }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center text-gray-500 p-4">No data available.</div>;
  }

  const columns = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const renderCell = (row, col) => {
    if (renderers[col]) return renderers[col](row[col], row);
    return row[col] != null && row[col] !== "" ? String(row[col]) : "-";
  };

  return (
    <div className="w-full p-4 bg-white rounded-md shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="text-sm mr-2 text-gray-700">Rows per page:</label>
          <select
            className="border p-1 rounded text-black font"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-black ">
          Page {currentPage} of {totalPages}
          <button
            className="ml-3 px-2 py-1 border rounded disabled:opacity-50 text-black font"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="ml-2 px-2 py-1 border rounded disabled:opacity-50 text-black font"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th key={col} className="border-b p-2 text-left capitalize text-gray-700">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="p-2 border-b">
                    {renderCell(row, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
