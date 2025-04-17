'use client';
import { useState, useEffect, createContext, useContext } from "react";
import EventCard from "./(approvalComponents)/Approvalcard";
import { fetchAllApproval } from "@/_api_/approval";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ApprovalBox from "./(approvalComponents)/ApprovalBox";

const categories = ["All", "Star of month"];

export const ApprovalData = createContext()
export default function ApprovalPage() {
  const [approvalModeActivated, setApprovalModeActivated] = useState(false);
  const [approvlemodeData, setApprovalModeData] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [nominatedEmployee, setNominatedEmployee] = useState([]);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const time = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    if (user && user.userRole != 1 && user.userRole != 2) {
      router.push("/dashboard");
      return;
    }
  }, [user])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        const response = await fetchAllApproval()
        setNominatedEmployee(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("All Nominated Employee", nominatedEmployee[0]);
    console.log("All Nomination Employee", approvlemodeData)
  }, [nominatedEmployee, approvlemodeData])
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
      <div className={(nominatedEmployee.length == 0 || time.getDate() <= 16) ? "w-auto justify-center item-center" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10 place-items-center"}>
        {(nominatedEmployee.length > 0 && !loading && time.getDate() >= 16) ? (
          nominatedEmployee.map((event, index) => (
            <div key={event.id} className="w-full max-w-[28rem] lg:max-w-[32rem] grid place-items-center">
              <ApprovalData.Provider value={{ setNominatedEmployee, nominatedEmployee, setApprovalModeActivated, setApprovalModeData }}>
                {(selectedCategory == "All" || selectedCategory == "Star of month") ? (
                  <EventCard
                    NominationType={event.nomination_Type}
                    NominationReason={event.managerReason}
                    NominatedName={event.employeeName.name}
                    Image={event.employeeName?.image}
                    userId={event.employeeName?.id}
                    NominatedBy={event.nominated_ByUser?.name}
                    NominationId={index}
                    Role={user.userRole}
                  />
                ) : null}
              </ApprovalData.Provider>
            </div>
          ))
        ) : (time.getDate() < 16) ? (
          <p className="text-center text-black text-3xl justify-center items-center">{`The approval portal will open on 16th ${monthNames[time.getMonth()]}`}</p>
        ) : <p className="text-center text-black text-3xl justify-center items-center">No further approvals are available</p>}
      </div>

      {approvalModeActivated ? (
    <div className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50 shadow-md overflow-auto pt-12 scrollbar-hide">
    <div className="max-h-[90vh] overflow-y-auto w-full max-w-4xl p-4 scrollbar-hide">
      <ApprovalData.Provider value={{setApprovalModeActivated}}>
      <ApprovalBox
        ManagerRating={nominatedEmployee[approvlemodeData].managerRating}
        HrRating={nominatedEmployee[approvlemodeData].hrRating}
        ManagerReson={nominatedEmployee[approvlemodeData].managerReason}
        HrReason={nominatedEmployee[approvlemodeData].hrReason}
        NominatedName={nominatedEmployee[approvlemodeData].employeeName?.name}
        NominatedBy={nominatedEmployee[approvlemodeData].nominated_ByUser?.name}
      />
      </ApprovalData.Provider>
    </div>
  </div>) : null}

    </div>
  );
}
