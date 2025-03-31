'use client';
import { useState, useEffect, createContext, useContext } from "react";
import EventCard from "./(approvalComponents)/Approvalcard";
import { fetchAllApproval } from "@/_api_/approval";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const categories = ["All", "Star of month"];

export const ApprovalData = createContext()
export default function ApprovalPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [nominatedEmployee, setNominatedEmployee] = useState([]);
  const {user} = useContext(AuthContext);
  const router=useRouter();
//   const roleMap = {
//     1: "Admin",
//     2: "HR",
//     3: "TeamLeader",
//     4: "Employee"
// };

  // useEffect(()=>{
  //   if(roleMap[user.userRole]!="HR" &&  roleMap[user.userRole]!="Admin"  ){
  //     router.push("/dashboard")
  //     return ;
  //   }
  // },[user])

  //Fetch all Nominated Employees
  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetchAllApproval()
        setNominatedEmployee(response.data);
        console.log("Fetched Data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated nominatedEmployee:", nominatedEmployee);
    nominatedEmployee.forEach(element => {
      console.log(element.user.id)
    });
  }, [nominatedEmployee]);

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-all shadow-md ${selectedCategory === category ? "bg-purple-600 text-white" : "bg-gray-300 text-black hover:bg-gray-400"
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
              <ApprovalData.Provider value={{ setNominatedEmployee, nominatedEmployee }}>
                {(selectedCategory == "All" || selectedCategory == "Star of month") ? (<EventCard
                  NominationType={event.nomination_Type}
                  NominationReason={event.reason}
                  NominatedName={event.user.name}
                  Image={event.user.image}
                  userId={event.user.id}
                  NominatedBy={event.nominator_detail.name}
                  NominationId={event.id}
                />) : null}

              </ApprovalData.Provider>
            </div>
          ))
        ) : (
          <p className="text-center text-black text-2lg justify-center items-center">not more nomination available</p>
        )}
      </div>
    </div>
  );
}
