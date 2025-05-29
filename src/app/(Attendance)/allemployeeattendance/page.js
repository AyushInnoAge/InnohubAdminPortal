"use client";
import { useContext, useState, useEffect } from "react";
import { Search } from "lucide-react";
import EmployeeTable from "./components/table";
import Dropdown from "@/components/ui/dropdown";
import { MoveLeft, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { DurationVoilationMailTrigger, GetAllEmployeesList } from "@/_api_/allemployeelist";
import { saveRazorpayAttendance } from "@/_api_/userattendance";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


const columns = [
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "employeeId", label: "Employee ID" },
  { key: "departmentName", label: "Department" },
  { key: "manager", label: "Manager" },
];

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function EmployeesPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (
      user &&
      user.userRole != 1 &&
      user.userRole != 2 &&
      user.userRole != 3
    ) {
      router.push("/dashboard");
      return;
    }
  }, [user]);

  const [selectedManager, setSelectedManager] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [uploadedAttendanceData, setUploadedAttendanceData] = useState([]);

  const debouncedSearch = useDebouncedValue(selectedUser, 1500);

  const employee = useQuery({
    queryKey: [
      "employee",
      page,
      limit,
      user?.userRole,
      user?.id,
      selectedManager,
      selectedDepartment,
      debouncedSearch,
    ],
    queryFn: () =>
      GetAllEmployeesList(
        page,
        limit,
        user?.userRole,
        user?.id,
        selectedManager,
        selectedDepartment,
        selectedUser
      ),
    enabled: !!user?.userRole && !!user?.id,
  });
  const mutation = useMutation({
    mutationFn: (uploadedAttendanceData) =>
      saveRazorpayAttendance(uploadedAttendanceData),
    onSuccess: () => {
      toast.success("Attendance data uploaded successfully!");
      setIsFileUploaded(false);
      setUploadedAttendanceData([]);
    },
    onError: (error) => {
      toast.error("Error uploading attendance data.");
      console.error(error);
    },
  });

function convertExcelTimeToUTC(excelTime, utcDate) {
    if (typeof excelTime !== "number" || !(utcDate instanceof Date))
      return null;

    const timeInMilliseconds = excelTime * 24 * 60 * 60 * 1000;

    const resultUTC = new Date(utcDate.getTime() + timeInMilliseconds);

    resultUTC.setUTCDate(resultUTC.getUTCDate() - 1);

    return resultUTC.toISOString();
  }

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const finalData = [];

      try {
        for (let i = 1; i < rawData.length; i += 5) {
          const statusRow = rawData[i];
          const inRow = rawData[i + 1];
          const outRow = rawData[i + 2];
          const remarksRow = rawData[i + 4];

          const empId = statusRow[0];
          const name = statusRow[1];

          for (let col = 3; col < statusRow.length; col++) {
            const rawDate = rawData[0][col];

            let jsDate = null;
            if (typeof rawDate === "number") {
              const parsed = XLSX.SSF.parse_date_code(rawDate);
              if (parsed) {
                jsDate = new Date(
                  Date.UTC(parsed.y, parsed.m - 1, parsed.d, 18, 30)
                );
              }
            } else if (typeof rawDate === "string") {
              try {
                const [day, monthStr, yearSuffix] = rawDate.split("-");
                const monthMap = {
                  Jan: 0,
                  Feb: 1,
                  Mar: 2,
                  Apr: 3,
                  May: 4,
                  Jun: 5,
                  Jul: 6,
                  Aug: 7,
                  Sep: 8,
                  Oct: 9,
                  Nov: 10,
                  Dec: 11,
                };
                const month = monthMap[monthStr];
                const year = +("20" + yearSuffix);
                jsDate = new Date(Date.UTC(year, month, +day, 18, 30));
              } catch (err) {
                console.warn("Invalid date string:", rawDate);
              }
            }

            if (!jsDate || isNaN(jsDate.getTime())) continue;

            finalData.push({
              EmployeeId: empId,
              Name: name,
              Date: jsDate.toISOString(),
              Checkin: convertExcelTimeToUTC(inRow[col], jsDate) || "",
              Checkout: convertExcelTimeToUTC(outRow[col], jsDate) || "",
              Status: statusRow[col] || "",
              Remarks: remarksRow[col] || "",
            });
          }
        }
        console.log("Final Data:", finalData);

        setUploadedAttendanceData(finalData);
        setIsFileUploaded(true);
        toast.success("File uploaded and processed successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Error processing the file. Please check the format.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const uniqueEmployees = Array.from(
    new Map(employee.data?.allManager?.map((emp) => [emp.id, emp])).values()
  );

  const uniqueDepartments = Array.from(
    new Map(employee.data?.allDepartment?.map((emp) => [emp.id, emp])).values()
  );

  if (employee.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  if (employee.isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading data</p>
      </div>
    );
  }

  const DurationViolationTrigger = async () => {
    try {
      const response = await DurationVoilationMailTrigger();
      toast.success(response.data);
      console.log("Duration violation mail triggered:", response.data);
    } catch (error) {
      console.error("Error in DurationViolationTrigger:", error);
      toast.error("Error processing duration violation.");
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-white text-gray-800 p-6">
        <h1 className="text-2xl font-semibold mb-6 text-[#b05af7]">Employee Dashboard</h1>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {user?.userRole == 1 || user?.userRole == 2 ? (
              <Dropdown
                label="Select Manager"
                value={selectedManager}
                onChange={(e) => {
                  setSelectedManager(e.target.value);
                }}
                options={uniqueEmployees.map((emp) => ({
                  label: `${emp.name}`,
                  value: emp.id,
                }))}
                ClassName="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-blue-400 focus:outline-none"
              />
            ) : (
              <input
                type="text"
                value={user?.name}
                disabled={true}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none font-bold"
              />
            )}

            <Dropdown
              label="Select Department"
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
              }}
              options={uniqueDepartments.map((emp) => ({
                label: `${emp.departmentName}`,
                value: emp.id,
              }))}
              ClassName="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-blue-400 focus:outline-none"
            />

            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by Employee Name"
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
            {(user?.userRole == 1 || user?.userRole == 2) && <div className="w-full col-span-1 lg:col-span-2">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelUpload}
                  className="flex-1 pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none"
                />
                <button
                  onClick={() => {
                    console.log("Sending data to API:", uploadedAttendanceData);
                    mutation.mutate(uploadedAttendanceData);
                  }}
                  disabled={!isFileUploaded || mutation.isLoading}
                  className={`px-4 py-2 rounded-lg font-semibold text-white ${isFileUploaded
                    ? "bg-[#b05af7] hover:bg-violet-700"
                    : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  {mutation.isLoading ? "Uploading..." : "Submit"}
                </button>
                <button
                  onClick={DurationViolationTrigger}
                  // disabled={!isFileUploaded || mutation.isLoading}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-[#b05af7] hover:bg-violet-700"
                >
                  {mutation.isLoading ? "Uploading..." : "Publish Violation"}
                </button>
              </div>
            </div>}

          </div>
        </div>

        {employee.data?.userDetailed?.userDetailed?.length > 0 ? (
          <EmployeeTable
            columns={columns}
            data={employee.data?.userDetailed?.userDetailed}
          />
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">
              No employees found for the selected criteria.
            </p>
          </div>
        )}

        <div className="fixed bottom-0 right-2 flex justify-end items-center">
          <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">
            Showing&nbsp;
            <span className="font-semibold text-gray-900">
              {limit * page < employee.data?.userDetailed?.totalData
                ? limit * page
                : employee.data?.userDetailed?.totalData}
            </span>
            &nbsp;of&nbsp;
            <span className="font-semibold text-gray-900">
              {employee.data?.userDetailed?.totalData}
            </span>
            &nbsp;employees
          </div>
          <Dropdown
            label="Limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            options={[25, 50, 100]}
            ClassName="border-gray-950 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none"
          />
          <Button
            variant={page === 1 ? "disabled" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            <MoveLeft size={16} />
          </Button>
          <Button
            variant={
              page * limit >= employee.data?.userDetailed?.totalData
                ? "disabled"
                : "outline"
            }
            className="flex items-center gap-2"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= employee.data?.userDetailed?.totalData}
          >
            <MoveRight size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}
