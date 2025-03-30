'use client';
import { useState, useEffect } from "react";
import EventCard from "./(approvalComponents)/Approvalcard";
import axios from "axios";

const categories = ["All", "Star of month"];

export default function ApprovalPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [nominatedEmployee, setNominatedEmployee] = useState([]);

  // const filteredEvents =
  //   selectedCategory === "All"
  //     ? events
  //     : events.filter((event) => event.category === selectedCategory);

  const getToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) return; // Prevent API call if token is missing

        const response = await axios.get("http://localhost:5279/users/fetch_nominated_employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNominatedEmployee(response.data); // Set response directly
        console.log("Fetched Data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated nominatedEmployee:", nominatedEmployee);
  }, [nominatedEmployee]);

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-all shadow-md ${
              selectedCategory === category ? "bg-purple-600 text-white" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10 place-items-center">
        {nominatedEmployee.length > 0 ? (
          nominatedEmployee.map((event) => (
            <div key={event.id} className="w-full max-w-[28rem] lg:max-w-[32rem] flex justify-center">
              <EventCard 
                NominationType={event.nomination_Type}
                NominationReason={event.reason}
                NominatedName={event.user.name}
                Image={event.user.image}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-2lg justify-center">not more nomination available</p>
        )}
      </div>
    </div>
  );
}
