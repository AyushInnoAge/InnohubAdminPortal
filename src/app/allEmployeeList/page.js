"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import EmployeeTable from "@/components/ui/table";
import Dropdown from "@/components/ui/dropdown";
import { MoveLeft, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const columns = [
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "employeeId", label: "Employee ID" },
  { key: "departmentName", label: "Department" },
  { key: "manager", label: "Manager" },
];

export default function EmployeesPage() {
  const [filterDept, setFilterDept] = useState("");
  const [searchId, setSearchId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const allVoilations = [
    "ComeLate",
    "Not Follow Shift",
    "Absent More Than 2 Days",
  ];
  const [voilationsType, setVoilationsType] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const employee = useQuery({
    queryKey: ["employee", page, limit],
    queryFn: async () => {
      try {
        const res = await axios(`http://localhost:5279/User/employeeAttendenceDetailed?userID=680b0f7b177152cbf498efed&UserRole=Admin&PageNumber=${page}&PageSize=${limit}`);
      return res.data
      } catch (error) {
        throw new Error("Error fetching employee data");
      }
    },
  });

  console.log(employee.data)
  const uniqueEmployees = Array.from(
    new Map(employee.data?.allManager?.map((emp) => [emp.id, emp])).values()
  );

  const uniqueDepartments = Array.from(
    new Map(employee.data?.allDepartment?.map((emp) => [emp.id, emp])).values()
  )

  // console.log("All Department", uniqueDepartments);
  // console.log("All Manager", uniqueEmployees);


  const filtered = employee.data?.userDetailed?.userDetailed?.filter((e) => {
    const matchId = e.name.toLowerCase().includes(searchId.toLowerCase());
    const matchSelected = selectedEmployee === "" || e.manager === selectedEmployee;
    const matchDepartment = filterDept === "" || e.departmentName === filterDept;
    const matchVoilations =
      voilationsType === "" || e.voilations === voilationsType;
    return matchDepartment && matchId && matchSelected && matchVoilations;
  });

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
  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-">Employee Dashboard</h1>

      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Dropdown
            label="Select Manager"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            options={uniqueEmployees.map((emp) => ({
              label: `${emp.name}`,
              value: emp.name,
            }))}
            ClassName="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-blue-400 focus:outline-none"
          />

          <Dropdown
            label="Select Department"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            options={uniqueDepartments.map((emp) => ({
              label: `${emp.departmentName}`,
              value: emp.departmentName,
            }))}
            ClassName="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-blue-400 focus:outline-none"
          />

          <Dropdown
            label="Violation"
            value={voilationsType}
            onChange={(e) => setVoilationsType(e.target.value)}
            options={allVoilations}
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
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
        </div>
      </div>

      {filtered?.length > 0 ? (
        <EmployeeTable columns={columns} data={filtered} />
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">
            No employees found for the selected criteria.
          </p>
        </div>
      )}

      <div className="flex justify-end items-center mt-6 sticky bottom-0 right-0">
        <Dropdown
          label="Limit"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          options={[10, 25, 50, 100]}
          ClassName="border-gray-950 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none"
        />
        <Button variant="outline" className="flex items-center gap-2"
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
        >
          <MoveLeft size={16} />
        </Button>
        <Button variant="outline" className="flex items-center gap-2"
          onClick={() => setPage(p => p + 1)}
          disabled={(page * limit) >= employee.data?.userDetailed?.totalData}>
          <MoveRight size={16} />
        </Button>
      </div>
    </div>
  );
}
