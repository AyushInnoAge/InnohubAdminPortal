import React, { useState, useEffect } from "react";

export default function HoursBreakdown({ data }) {
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [totalHours, setTotalHours] = useState(0);
  const [distribution, setDistribution] = useState([
    { percentage: 0, color: "green" },
    { percentage: 0, color: "red" },
    { percentage: 0, color: "gray" },
  ]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setTotalHours(0);
      setDistribution([
        { percentage: 0, color: "green" },
        { percentage: 0, color: "red" },
        { percentage: 0, color: "gray" },
      ]);
      return;
    }

    const total = data.reduce((acc, item) => {
      const wh = parseFloat(item.workHours);
      return acc + (isNaN(wh) ? 0 : wh);
    }, 0);
    setTotalHours(total);

    const dist = [
      { percentage: 80, color: "green" },
      { percentage: 10, color: "red" },
      { percentage: 10, color: "gray" },
    ];
    setDistribution(dist);
  }, [data]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6 w-full">
      <div className="flex justify-between text-sm text-black mb-2">
       
        <span>
          <strong>Hour breakdown:</strong>{" "}
          <span className="text-blue-500">
            {typeof totalHours === "number" ? totalHours.toFixed(2) : "0.00"}{" "}
            hrs
          </span>
        </span>
      </div>

      <div className="flex h-[10px] overflow-hidden rounded-lg bg-gray-200 mb-4">
        {distribution.map((item, index) => (
          <div
            key={index}
            className={`bg-${item.color}-500`}
            style={{ width: `${item.percentage}%` }}
          />
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
