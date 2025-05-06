import axios from "axios";

const getToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const GetAllEmployeesList = async (page, limit, Role, userId) => {
    try {
        console.log("EAaya")
        const token = getToken();
        const Url = (Role === 1 && 2) ?
            `${process.env.NEXT_PUBLIC_API_URL}User/employeeAttendenceDetailed?userID=${userId}&UserRole=Admin&PageNumber=${page}&PageSize=${limit}` :
            (Role === 3) ?
                `${process.env.NEXT_PUBLIC_API_URL}User/employeeAttendenceDetailed?userID=${userId}&UserRole=TeamLeader&PageNumber=${page}&PageSize=${limit}` : null;
        const response = await axios.get(
            Url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Employee Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching employee data:", error.message);
    }
}

export {GetAllEmployeesList} ;