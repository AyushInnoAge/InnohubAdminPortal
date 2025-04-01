"use client";
import { useContext, useState, useEffect } from "react";
import Nomination from "./NominationComponent/Nomination";
import { fetchAllEmployeesByTeamLeaderId } from "@/_api_/nomination";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
const categories = ["Shoutout","Star of the month"];

export default function NominateEmployee() {
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Shoutout");
  const {user} = useContext(AuthContext);
  const router = useRouter();

  useEffect(()=>{
    if(user && user.userRole!=3){
      router.push("/dashboard")
      return ;
    }
  },[user]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAllEmployeesByTeamLeaderId();
      if (response.status === 200) {
        setSelectedEmployee(response.data);
      } else {
        console.error("Error fetching employees:", response.statusText);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 w-full bg-transparent">
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-all shadow-md ${
              selectedCategory === category
                ? "bg-purple-600 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
        {selectedCategory=="Shoutout"? <Nomination AllEmployees={selectedEmployee} Nomination_Type="Shoutout" NominationHeading="Recognize an Employee" /> : <Nomination AllEmployees={selectedEmployee} Nomination_Type="Star of the month" NominationHeading="Recognize This Month’s Star Performer" />}
      
    </div>
  );
}
