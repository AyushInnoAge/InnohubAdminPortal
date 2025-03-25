import API_ENDPOINTS from "../app/config/apiconfig";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

export const fetchEmployees = async (userRole, selectedRole, employeeId) => {
    let api = "";
  
    if (userRole === "HR") {
      if (selectedRole === "Star of the month") {
        api = API_ENDPOINTS.FETCH_NOMINATED_EMPLOYEES;
      } else if (selectedRole === "Best Team (yearly)" || selectedRole === "Best Team (Half yearly)") {
        api = API_ENDPOINTS.FETCH_ALL_TEAMS;
      } else if (selectedRole === "Best Team Leader (yearly)" || selectedRole === "Best Team Leader (Half yearly)") {
        api = API_ENDPOINTS.FETCH_ALL_TEAM_LEADERS;
      } else {
        api = API_ENDPOINTS.FETCH_NOMINATED_EMPLOYEES;
      }
    } else if (userRole === "TeamLeader" || userRole === "Employee") {
      api = API_ENDPOINTS.FETCH_MY_EMPLOYEES;
    } else {
      api = API_ENDPOINTS.FETCH_ALL_TEAMS;
    }
   
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might be logged out.");
        throw new Error("No token found");
      }
  
      const response = await fetch(api, {
        method: "GET",
        headers: getAuthHeaders(),
      });
  
      if (!response.ok) throw new Error("Failed to fetch employees");
  
      let data = await response.json();
  
      if (userRole === "Employee" && selectedRole === "Shoutout") {
        data = data.filter(emp => emp.id !== employeeId);
      }

      if (!Array.isArray(data)) {
        throw new Error("No valid data available");
      }
  
      return data; // Return the fetched and filtered data
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };

// Add fetchManagers
export const fetchManagers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might be logged out.");
      throw new Error("No token found");
    }
    const response = await fetch(API_ENDPOINTS.FETCH_ALL_TEAM_LEADERS, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch managers");

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No valid managers available");
    }

    return data;
  } catch (error) {
    console.error("Error fetching managers:", error);
    throw error;
  }
};

export const submitNomination = async (selectedEmployee, selectedManagers, selectedRole, reason, userRole) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might be logged out.");
        throw new Error("No token found");
      }
  
      let UserId;
      if (userRole === "HR") {
        if (selectedRole === "Star of the month" || selectedRole === "Best Team Leader (yearly)" || selectedRole === "Best Team Leader (Half yearly)") {
          UserId = selectedEmployee.userId; // Use `userId` for "Star Of The Month" and "Best Team Leader"
        } else if (selectedRole === "Best Team (yearly)" || selectedRole === "Best Team (Half yearly)") {
          UserId = selectedEmployee.id; // Use `teamId` for "Best Team"
        } else {
          UserId = selectedEmployee.id; // Default to `id`
        }
      } else {
        UserId = selectedEmployee.id; // Default for non-HR users
      }
  
      const obj = {
        ManagerIds: selectedManagers.map(m => m.id),
        Nomination_Type: selectedRole,
        Reason: reason,
      };
  
      if (selectedRole === "Best Team (yearly)" || selectedRole === "Best Team (Half yearly)") {
        obj.TeamId = selectedEmployee.id;
      } else {
        if (userRole === "HR" && selectedRole === "Star of the month") {
          obj.UserId = selectedEmployee.userId;
        } else {
          obj.UserId = selectedEmployee.id;
        }
      }
  
      const response = await fetch(API_ENDPOINTS.SHOUTOUT_API, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(obj),
      });
  
      const result = await response.json();
  
      if (!response.ok) throw new Error("Failed to submit nomination");
  
      return result.message; // Return the success message
    } catch (error) {
      console.error("Error submitting nomination:", error);
      throw error;
    }
};