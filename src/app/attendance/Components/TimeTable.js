"use client";

import React, { useState } from "react";
import { Check, X, Info } from "lucide-react";
import { Eye } from "lucide-react";

export default function TimeTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  const totalPages = Math.ceil(data.length / pageSize);

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-md shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 text-gray-900">Rows per page:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="p-1 border rounded text-gray-900"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="text-gray-900">
          Page {currentPage} of {totalPages}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="ml-3 px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-2 px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="bg-gray-50 text-gray-900 font-semibold">
              <th className="p-3 text-left border-b border-gray-200">Date</th>
              <th className="p-3 text-left border-b border-gray-200">
                Checkin
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                Checkout
              </th>

              <th className="p-3 text-left border-b border-gray-200">
                Work hours
              </th>

              {/* <th className="p-3 text-left border-b border-gray-200">
                Overtime
              </th>
              <th className="p-3 text-left border-b border-gray-200">
                Violations
              </th> */}
              <th className="p-3 text-left border-b border-gray-200">Note</th>
              <th className="p-3 text-left border-b border-gray-200">Status</th>
              <th className="p-3 text-left border-b border-gray-200">
                Punch Records
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {currentData.map((row, index) => (
              <tr key={index}>
                <td className="p-3 border-b border-gray-200">{row.date}</td>
                <td className="p-3 border-b border-gray-200">{row.checkin}</td>
                <td className="p-3 border-b border-gray-200">{row.checkout}</td>
                <td className="p-3 border-b border-gray-200">
                  {row.workHours ? `${row.workHours} hrs` : "-"}
                </td>

                {/* <td className="p-3 border-b border-gray-200">
                  {row.overtime ? `${row.overtime} ` : "-"}
                </td>
                <td className="p-3 border-b border-gray-200 text-red-500">
                  {row.double}
                </td> */}
                <td className="p-3 border-b border-gray-200">
                  <div className="relative group">
                    <button>
                      <Info className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100">
                      {row.note}
                    </div>
                  </div>
                </td>
                <td className="p-3 border-b border-gray-200">
                  {row.Status === "Present" ? (
                    <span className="text-green-500 font-semibold">
                      {row.Status}
                    </span>
                  ) : row.Status === "Absent" ? (
                    <span className="text-red-500 font-semibold">
                      {row.Status}
                    </span>
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      {row.Status}
                    </span>
                  )}
                </td>
                <td className="p-3 border-b border-gray-200">
                  {row.punchrecords != "" ? (
                    <button onClick={() => openModal(row.punchrecords)}>
                      <Eye className="w-5 h-5 text-blue-600 hover:scale-110 transition-transform" />
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentData.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            No data available.
          </p>
        )}
      </div>
      {modalContent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Punch Records
            </h2>

            {(() => {
              const contentStr =
                typeof modalContent === "string"
                  ? modalContent
                  : JSON.stringify(modalContent);
              const rows = [];

              const punches =
                contentStr.match(/\d{2}:\d{2}:\d{2}\((in|out)\)/gi) || [];
              if (punches.length === 1) {
                const inPunch = punches[0]?.match(/(\d{2}:\d{2}:\d{2})\(in\)/i);
                const outPunch = punches[0]?.match(
                  /(\d{2}:\d{2}:\d{2})\(out\)/i
                );
                rows.push({
                  inTime: inPunch ? inPunch[1] : "-",
                  outTime: outPunch ? outPunch[1] : "-",
                });
              }

              for (let i = 0; i < punches.length; i += 1) {
                const inPunch = punches[i]?.match(/(\d{2}:\d{2}:\d{2})\(in\)/i);
                const outPunch = punches[i + 1]?.match(
                  /(\d{2}:\d{2}:\d{2})\(out\)/i
                );

                rows.push({
                  inTime: inPunch ? inPunch[1] : "-",
                  outTime: outPunch ? outPunch[1] : "-",
                });
              }

              return (
                <table className="w-full text-left border border-gray-300 rounded overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border-b border-green-300 text-blue-600">
                        In
                      </th>
                      <th className="p-2 border-b border-red-300 text-blue-600">
                        Out
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="p-2 text-center text-gray-500"
                        >
                          No punch records available.
                        </td>
                      </tr>
                    )}
                    {rows.map((row, idx) => (
                      <tr key={idx} className="even:bg-gray-50">
                        <td className="p-2 border-b border-gray-300 text-green-600 font-mono">
                          {row.inTime}
                        </td>
                        <td className="p-2 border-b border-gray-300 text-red-600 font-mono">
                          {row.outTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
