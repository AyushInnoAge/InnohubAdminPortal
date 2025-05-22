'use client'

import React from 'react'
import ProfileCard from './Components/ProfileCard'
import HoursBreakdown from './Components/HoursBreakdown'
import TimeTable from './Components/TimeTable'

export default function TimeAttendance() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 md:px-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 font-['Segoe_UI',sans-serif]">

     
      <div className="md:col-span-2 flex items-center gap-2 mb-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#b05af7]">
          Time & Attendance
        </h1>
      </div>

     
      <div>
        <ProfileCard />
      </div>

     
      <div className="flex flex-col gap-6">
        <HoursBreakdown />
        <TimeTable />
      </div>
    </div>
  )
}
