"use client";
import { useContext, useState, useEffect } from "react";
import Nomination from "./NominationComponent/Nomination";
import { fetchAllEmployeesByTeamLeaderId } from "@/_api_/nomination";


export default function NominateEmployee() {
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [shoutoutRemaing, setShoutoutRemaing]= useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAllEmployeesByTeamLeaderId();
      if (response.status === 200) {
        setSelectedEmployee(response.data.employeeData);
        setShoutoutRemaing(response.data.shoutoutRemaing);
      } else {
        console.error("Error fetching employees:", response.statusText);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 w-full bg-transparent">
        <Nomination AllEmployees={selectedEmployee} 
        NominationHeading="Recognize an Employee"
        ShoutoutRemaing={shoutoutRemaing}
        /> 
    </div>
  );
}
