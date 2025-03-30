"use client";
import { useContext, useState, useEffect } from "react";
import Nomination from "./NominationComponent/Nomination";
import { fetchAllEmployeesByTeamLeaderId } from "@/_api_/nomination";
import { AuthContext } from "@/context/AuthContext";

const categories = [
 "Star of the month",
 "Shoutout"
];

export default function NominateEmployee() {
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [reason, setReason] = useState("");
  const [userRole, setUserRole] = useState(null);
  const { user } = useContext(AuthContext);
  const roleMap = {
    1: "Admin",
    2: "HR",
    3: "TeamLeader",
    4: "Employee",
  };
  //if team leader ha to featch all employees
  //team leader hai to manage me uska hi id ho ga
  //Apply useEffect no one employee Access this and also currently this
  //team manager hai to nomination categorie me shoutout and star of month ho ga

  //fetch role of user
  useEffect(() => {
    if (user) {
      setUserRole(roleMap[user.userRole]);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAllEmployeesByTeamLeaderId();
    console.log(response.data);
      if (response.status === 200) {
        setSelectedEmployee(response.data);
      } else {
        console.error("Error fetching employees:", response.statusText);
      }
    }
    fetchData();

    
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 w-full bg-transparent">
      {/* Navigation Bar */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <div className="flex overflow-x-auto space-x-4 bg-white p-2 rounded-lg shadow-md scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div> */}

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

      <Nomination
      
      AllEmployee={selectedEmployee}
      Manager={selectedManager}
      Role={userRole}
      />
    </div>
  );
}
