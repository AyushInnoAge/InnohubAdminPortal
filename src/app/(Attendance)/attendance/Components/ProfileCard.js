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
    name: data.userDetailed.name ,
    avatar:
      data.userDetailed.image ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${data.userDetailed.name}`,
    role: data.userDetailed.designation || "Employee",
    email: data.userDetailed.email,
    totalHours: data.totalDuration|| "0:00",
    reportingManager: data.userDetailed.manager || "N/A",   
    
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
        {/* <p className="text-xl font-bold text-blue-500">
          {profileData.shiftTiming}
        </p>
        <p className="text-sm font-semibold text-gray-500">Shift Timing</p> */}
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-blue-500">{profileData.reportingManager}</p>
        <p className="text-sm font-semibold text-gray-500">Reporting Manager</p>
      </div>
      <div className="text-center">
        {/* <p className="text-xl font-bold text-red-500">
        
        </p>
        <p className="text-sm font-semibold text-gray-500">
          Violations Committed
        </p> */}
      </div>
    </div>
  );
}
