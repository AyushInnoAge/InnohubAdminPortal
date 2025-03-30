import axios from "axios";

const getToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  };
//fetch all employee for teamleader

const fetchAllEmployeesByTeamLeaderId = async ()=>{
    try{
        const token = getToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user/fetch_my_employees`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        return response;
    }catch (error)
    {   
        throw new error.message();
    }

}

//submite shoutout 


export {fetchAllEmployeesByTeamLeaderId};
//selectedEmployee is full user data of employee
//selectedManagers is array of user data of managers
//selectRole : "Star of the month", "Best Team Leader (yearly)", "Best Team (yearly)", "Best Team Leader (Half yearly)", "Best Team (Half yearly)"
//reason : string
//userRole : "HR", "TeamLeader", "Employee" line 95