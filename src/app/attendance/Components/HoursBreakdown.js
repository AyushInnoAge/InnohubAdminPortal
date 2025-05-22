import React from 'react';
import { useContext, useState, useEffect } from "react";

export default function HoursBreakdown() {
  const [selectedMonth, setSelectedMonth] = useState('June');
  const numericData = {
    totalHours: 264.0,
    distribution: [
      { percentage: 50, color: 'green' },   
      { percentage: 15, color: 'red' },    
      { percentage: 5, color: 'gray' }      
    ]
  };
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6 w-full">
      <div className="flex justify-between text-sm text-black mb-2">
      <div className="flex items-center">
          <span className="mr-2">Select Month:</span>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="June">January</option>
            <option value="June">February</option>
            <option value="June">March</option>
            <option value="June">April</option>
            <option value="June">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <span>
          <strong>Hour breakdown:</strong>{' '}
          <span className="text-blue-500">{numericData.totalHours.toFixed(2)} hrs</span>
        </span>
      </div>

      <div className="flex h-[10px] overflow-hidden rounded-lg bg-gray-200 mb-4">
        {numericData.distribution.map((item, index) => (
          <div
            key={index}
            className={`bg-${item.color}-500`}
            style={{ width: `${item.percentage}%` }}
          ></div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600">
          Add Time off
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
          Reject All
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
          Approve All
        </button>
      </div>
    </div>
  );
}

