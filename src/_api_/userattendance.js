// @/_api_/userattendance.js
import axios from "axios";

const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const attendanceApi = async (empId, month, year, pageNumber = 1, pageSize = 10) => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}apiUserAttandence/GetAttendanceByUserId`,
      {
        params: {
          EmployeeId: empId,
          Month: month,
          Year: year,
          PageNumber: pageNumber,
          PageSize: pageSize
        },
        headers: {
          "Content-Type": "application/json",
        
        }
      }
    );
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export { attendanceApi };
