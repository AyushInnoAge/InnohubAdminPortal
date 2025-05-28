"use client";

import React, { useState } from "react";
import { Eye, Info } from "lucide-react";
import GenericTable from "@/components/ui/GenericTable"; // adjust the path as needed

export default function TimeTable({ data }) {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);
  const note = data?.note;

  const renderers = {
    date: (value) =>
      value ? (
        <span className="text-black font">{value}</span>
      ) : (
        <span className="text-black font">-</span>
      ),
    checkin: (value) =>
      value ? (
        <span className="text-black font">{value}</span>
      ) : (
        <span className="text-black font">-</span>
      ),
    checkout: (value) =>
      value ? (
        <span className="text-black font">{value}</span>
      ) : (
        <span className="text-black font">-</span>
      ),
    workHours: (value) =>
      value ? (
        <span className="text-black font">{value} hrs</span>
      ) : (
        <span className="text-black font">-</span>
      ),
    Status: (value) =>
      value === "Present" ? (
        <span className="text-green-500 font-semibold">{value}</span>
      ) : value === "Absent" ? (
        <span className="text-red-500 font-semibold">{value}</span>
      ) : (
        <span className="text-gray-500 font-semibold">{value}</span>
      ),
    punchrecords: (value, row) =>
      value && Array.isArray(value) ? (
        <button onClick={() => openModal(value)}>
          <Eye className="w-5 h-5 text-blue-600 hover:scale-110 transition-transform" />
        
        </button>
      ) : (
        <div className="flex items-center gap-2 relative group">
          <span className="text-red-500 font-semibold">Absent</span>
          <Info className="w-5 h-5 text-blue-600 hover:scale-110 transition-transform" />
          <span className="absolute bottom-full right- transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100">
            {value || "No punch records available."}
          </span>
        </div>
      ),
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6 w-full">
      <GenericTable data={data} renderers={renderers} />

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
              const punches =
                contentStr.match(/\d{2}:\d{2}:\d{2}\((in|out)\)/gi) || [];
              const rows = [];

              for (let i = 0; i < punches.length; i++) {
                const inMatch = punches[i]?.match(/(\d{2}:\d{2}:\d{2})\(in\)/i);
                const outMatch = punches[i + 1]?.match(
                  /(\d{2}:\d{2}:\d{2})\(out\)/i
                );
                if (inMatch || outMatch) {
                  rows.push({
                    inTime: inMatch ? inMatch[1] : "-",
                    outTime: outMatch ? outMatch[1] : "-",
                  });
                  if (outMatch) i++; 
                }
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
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="p-2 text-center text-gray-500"
                        >
                          No punch records available.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row, idx) => (
                        <tr key={idx} className="even:bg-gray-50">
                          <td className="p-2 border-b border-gray-300 text-green-600 font-mono">
                            {row.inTime}
                          </td>
                          <td className="p-2 border-b border-gray-300 text-red-600 font-mono">
                            {row.outTime}
                          </td>
                        </tr>
                      ))
                    )}
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
