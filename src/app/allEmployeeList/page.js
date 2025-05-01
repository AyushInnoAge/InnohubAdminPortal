'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import EmployeeTable from '@/components/ui/table';
import Dropdown from '@/components/ui/dropdown';
import { MoveLeft, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const employees = [
    {
        id: 1,
        name: 'Rohan Sharma',
        employeeId: '101',
        department: 'Design',
        shift: '9:00 AM - 5:00 PM',
        Manger: 'Shubham',
        Present: '20/20',
        image: 'https://via.placeholder.com/80',
        voilations: "ComeLate",
    },
    {
        id: 2,
        name: 'Rahul Verma',
        employeeId: '102',
        department: 'IT',
        shift: '11:00 AM - 7:00 PM',
        Manger: 'Shubham',
        Present: '19/20',
        image: 'https://via.placeholder.com/80',
        voilations: "Not Follow Shift",
    },
    {
        id: 3,
        name: 'John Doe',
        employeeId: '103',
        department: 'IT',
        shift: '11:00 AM - 7:00 PM',
        Manger: 'Shubham',
        Present: '12/19',
        image: 'https://via.placeholder.com/80',
        voilations: "Absent More Than 2 Days",
    },
];

const columns = [
    { key: 'id', label: 'S.No' },
    { key: 'image', label: 'Image' },
    { key: 'name', label: 'Name' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'department', label: 'Department' },
    { key: 'shift', label: 'Shift' },
    { key: 'Manger', label: 'Manager' },
    { key: 'Present', label: 'May Present' },
];

export default function EmployeesPage() {
    const [filterDept, setFilterDept] = useState('');
    const [searchId, setSearchId] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const AllDepartment = ["Design", "IT"];
    const allVoilations = ["ComeLate", "Not Follow Shift", "Absent More Than 2 Days"]
    const [voilationsType, setVoilationsType] = useState('');


    const uniqueEmployees = Array.from(new Map(employees.map(emp => [emp.id, emp])).values());

    const filtered = employees.filter(e => {
        const matchId = e.employeeId.toLowerCase().includes(searchId.toLowerCase());
        const matchSelected = selectedEmployee === '' || e.employeeId === selectedEmployee;
        const matchDepartment = filterDept === '' || e.department === filterDept;
        const matchVoilations = voilationsType === '' || e.voilations === voilationsType;
        return matchDepartment && matchId && matchSelected && matchVoilations;
    });

    return (
        <div className="min-h-screen bg-white text-gray-800 p-6">
            <h1 className="text-2xl font-semibold mb-6 text-">Employee Dashboard</h1>

            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    

                    <Dropdown
                        label="Select Manager"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        options={uniqueEmployees.map(emp => ({
                            label: `${emp.name}`,
                            value: emp.employeeId
                        })
                        )}
                        ClassName="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-blue-400 focus:outline-none"
                    />


                  

                    <Dropdown
                        label="Department"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        options={AllDepartment}
                        ClassName="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-blue-400 focus:outline-none"
                    />


                    

                    <Dropdown
                        label="Violation"
                        value={voilationsType}
                        onChange={(e) => setVoilationsType(e.target.value)}
                        options={allVoilations}
                        ClassName="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-blue-400 focus:outline-none"
                    />

                   
                    <div className="flex w-full gap-4 items-end">
                     
                        <div className="w-[30%]">
                            <Dropdown
                                label="Limit"
                                value="25"
                                onChange={() => { }}
                                options={[10, 20, 25]}
                                ClassName="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 outline-none"
                            />
                        </div>

                        
                        <div className="w-[30%]">
                            <Button className="w-full bg-[#b05af7] text-white px-4 py-2 rounded-lg flex items-center justify-center">
                                <MoveLeft className="mr-2" size={18} />
                            </Button>
                        </div>

                        
                        <div className="w-[30%]">
                            <Button className="w-full bg-[#b05af7] text-white px-4 py-2 rounded-lg flex items-center justify-center">
                                <MoveRight className="mr-2" size={18} />
                            </Button>
                        </div>
                    </div>



                   
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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

            {filtered.length > 0 ? (
                <EmployeeTable columns={columns} data={filtered} />
            ) : (
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-lg">No employees found for the selected criteria.</p>
                </div>
            )}
        </div>
    );
}
