"use client";
import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "./Components/ProfileCard";
import HoursBreakdown from "./Components/HoursBreakdown";
import TimeTable from "./Components/TimeTable";
import { attendanceApi } from "@/_api_/userattendance";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function TimeAttendance() {
  const { user } = useContext(AuthContext);
  const [attendanceData, setAttendanceData] = useState([]);
  const [profileData, setProfileData] = useState({});
const currentDate = new Date();
const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); 
const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [employeeId, setEmployeeId] = useState(null);

  const router = useRouter();
  const route = useSearchParams();

  useEffect(() => {
    if (user && user.userRole !== 1 && user.userRole !== 2 && user.userRole !== 3) {
      router.push("/dashboard");
      return;
    }
  }, [user]);

  useEffect(() => {
    const empIdFromQuery = route.get("employeeid");
    if (empIdFromQuery) {
      setEmployeeId(empIdFromQuery);
    }
  }, [route]);

  const fetchAttendance = async (employeeId, month, year) => {
    try {
      const response = await attendanceApi(employeeId, month, year);
      const attendanceArray =
        response?.data?.data?.userAttendanceList?.attendance || [];
      const profile = response?.data?.data || {};

      console.log("Fetched Profile Data:", profile);

      const formattedData = attendanceArray.map((item) => {
        const dateObj = new Date(item.date);
        return {
          rawDate: dateObj,
          date: dateObj.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }),
          checkin:
            item.checkIn && item.checkIn !== "00:00:00"
              ? item.checkIn.split(" ")[1]
              : "",
          checkout:
            item.checkOut && item.checkOut !== "00:00:00"
              ? item.checkOut.split(" ")[1]
              : "",
          mealBreak: "",
          workHours: item.duration ? (item.duration / 60).toFixed(2) : "",
          overtime: "-",
          double: "-",
          note:
            item.status === "On WeeklyOff"
              ? "Weekly Off"
              : item.status === "Absent"
              ? "Absent"
              : "-",
          approval: "pending",
          punchrecords: item.punchRecord,
          Status: item.status,
        };
      });

      formattedData.sort((a, b) => a.rawDate - b.rawDate);
      setAttendanceData(formattedData);
      setProfileData({ ...profile }); // Ensure profileData reference changes
    } catch (err) {
      console.error("Failed to fetch attendance. Please try again.", err);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchAttendance(employeeId, selectedMonth, selectedYear);
    }
  }, [employeeId, selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedMonth(parseInt(month));
    setSelectedYear(parseInt(year));
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 md:px-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 font-['Segoe_UI',sans-serif]">
      <div className="md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#b05af7]">
          Time & Attendance
        </h1>
        <input
          type="month"
          value={`${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`}
          onChange={handleMonthChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm text-gray-700"
        />
      </div>

      <div>
        <ProfileCard data={profileData} />
      </div>

      <div className="flex flex-col gap-6">
        {/* <HoursBreakdown data={attendanceData} /> */}
        <TimeTable data={attendanceData} />
      </div>
    </div>
  );
}
