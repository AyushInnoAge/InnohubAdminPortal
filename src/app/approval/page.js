"use client";
import { useState, useEffect, createContext, useContext } from "react";
import EventCard from "./(approvalComponents)/Approvalcard";
import { fetchAllApproval, SubmitedApproval, PublishApproval } from "@/_api_/approval";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ApprovalBox from "./(approvalComponents)/ApprovalBox";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";

const categories = ["All", "Star of month"];

export const ApprovalData = createContext();
export default function ApprovalPage() {
  const [approvalModeActivated, setApprovalModeActivated] = useState(false);
  const [approvlemodeData, setApprovalModeData] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [nominatedEmployee, setNominatedEmployee] = useState([]);
  const [submiteData, setSubnmiteData] = useState(null);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const time = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (user && user.userRole != 1 && user.userRole != 2) {
      router.push("/dashboard");
      return;
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAllApproval(user?.userRole);
        setNominatedEmployee(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (submiteData) {
      const SubmiteApproval = async () => {
        try {
          toast.success("Submit successfull");
          setNominatedEmployee((prev) =>
            prev.map((item) => {
              if(item.employeeName?.id === submiteData.UserId){
                user.userRole == 1 ? item.isApprovedAdmin = true : item.isApprovedHR = true;
              }
              return item;
            })
          );
          setSubnmiteData(null);
          setApprovalModeActivated(false);
        } catch (error) {
          console.error(error);
        }
      };
      SubmiteApproval();
    }
  }, [submiteData]);

  const PublishApprovalButton = async () => {
    setLoading(true)
    try {
      var response = await PublishApproval();
      if (response.status === 200) {
        setNominatedEmployee([]);
      }
      toast.success(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
   
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100">
       {user && <>
        {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all shadow-md  ${selectedCategory === category
              ? "bg-purple-600 text-white"
              : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {user?.userRole == 1 && time.getDate() > 25 &&
        <div className="flex flex-wrap justify-end gap-4 mb-8">
          <Button
            variant={nominatedEmployee.length == 0 || loading ? "disabled" : "success"}
            className={`px-4 py-2 mt-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all shadow-md text-white text-end }`}
            onClick={PublishApprovalButton}

          >
            Publish Approval
          </Button>
        </div>}
      {/* Event Cards Grid */}
      <div
        className={nominatedEmployee.length != 0 ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8" : "flex justify-center items-center"}
      >
        {nominatedEmployee.length > 0 ? (
          nominatedEmployee.map((event, index) => (
            <div
              key={event.id}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex justify-center"
            >
              <ApprovalData.Provider
                value={{
                  setNominatedEmployee,
                  nominatedEmployee,
                  setApprovalModeActivated,
                  setApprovalModeData,
                }}
              >
                {(selectedCategory === "All" ||
                  selectedCategory === "Star of month") && (
                    <EventCard
                      NominationType={event.nomination_Type}
                      NominationReason={event?.managerReason ? event?.managerReason : event?.hrReason}
                      NominatedName={event.employeeName.name}
                      Image={event.employeeName?.image}
                      userId={event.employeeName?.id}
                      NominatedBy={event.nominated_ByUser?.name}
                      NominationId={index}
                      Role={user.userRole}
                      Approved={user.userRole == 1 ? event?.isApprovedAdmin : event?.isApprovedHR}
                      PostId={event.id}
                    />
                  )}
              </ApprovalData.Provider>
            </div>
          )))
          : time.getDate() > 25 && nominatedEmployee.length == 0 ? (
            <p className="text-center text-black text-xl sm:text-2xl md:text-3xl px-4">
              The approval portal will close for {monthNames[time.getMonth()]}, and all nominations have been published
            </p>
          ) : (
            <p className="text-center text-black text-xl sm:text-2xl md:text-3xl px-4">
              No further nominations are available.
            </p>
          )}
      </div>

      {/* Modal Box for Approval */}
      {approvalModeActivated && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black bg-opacity-50 overflow-y-auto pt-10 px-4 sm:px-0">
          <div className="w-full max-w-4xl bg-white rounded-lg p-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <ApprovalData.Provider
              value={{
                setApprovalModeActivated,
                setSubnmiteData,
                approvalModeActivated,
              }}
            >
              <ApprovalBox
                ManagerRating={
                  nominatedEmployee[approvlemodeData].managerRating
                }
                HrRating={nominatedEmployee[approvlemodeData].hrRating}
                ManagerReson={nominatedEmployee[approvlemodeData].managerReason}
                HrReason={nominatedEmployee[approvlemodeData].hrReason}
                NominatedName={
                  nominatedEmployee[approvlemodeData].employeeName?.name
                }
                NominatedBy={
                  nominatedEmployee[approvlemodeData].nominated_ByUser?.name
                }
                NominatedEmployeeId={
                  nominatedEmployee[approvlemodeData].employeeName?.id
                }

                ApprovedByHR={
                  nominatedEmployee[approvlemodeData].isApprovedHR
                }
              />
            </ApprovalData.Provider>
          </div>
        </div>
      )}</> }
     
    </div>
  );
}
