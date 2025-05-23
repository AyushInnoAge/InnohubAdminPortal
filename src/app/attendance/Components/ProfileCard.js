"use client";

import React from "react";

export default function ProfileCard({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading profile...
      </div>
    );
  }

  const profileData = {
    name: data.userDetailed[0].name ,
    avatar:
      data.image ||
      "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(data.userDetailed[0].name),
    role: data.userDetailed[0].designation || "Employee",
    email: data.userDetailed[0].email,
    totalHours: data.totalDuration,
    shiftTiming: "9:00-18:00",
    manager: "Shubham Kumar",
    violations: 6,
  };

  return (
    <div className="flex flex-col items-center text-center gap-3 w-full bg-white rounded-2xl shadow-md h-[767px] p-4 overflow-y-auto">
      <img
        src={profileData.avatar}
        alt="Avatar"
        className="w-20 h-20 rounded-full object-cover border-2 border-[#b05af7] mt-4"
      />
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          {profileData.name}
        </h2>
        <p className="text-sm font-semibold text-gray-500">
          {profileData.role}
        </p>
        <p className="text-sm font-semibold text-gray-500">
          {profileData.email}
        </p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-blue-500">
          {profileData.totalHours}
        </p>
        <p className="text-sm font-semibold text-gray-500">Total hours</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-blue-500">
          {profileData.shiftTiming}
        </p>
        <p className="text-sm font-semibold text-gray-500">Shift Timing</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-blue-500">{profileData.manager}</p>
        <p className="text-sm font-semibold text-gray-500">Reporting Manager</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-red-500">
          {profileData.violations}
        </p>
        <p className="text-sm font-semibold text-gray-500">
          Violations Committed
        </p>
      </div>
    </div>
  );
}
