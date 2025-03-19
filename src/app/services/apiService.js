// apiService.js

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchData = async (endpoint, method = "GET", body = null, token = null) => {
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
            },
            ...(body && { body: JSON.stringify(body) }),
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "API request failed");

        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.message);
        throw error;
    }
};

export const fetchEmployees = async (userRole, selectedRole, token) => {
    let endpoint = "/users/fetch_nominated_employees";

    if (userRole === "HR") {
        if (selectedRole === "Star Of The Month") {
            endpoint = "/users/fetch_nominated_employees";
        } else if (selectedRole.includes("Best Team")) {
            endpoint = "/teams/fetch_all_teams";
        } else if (selectedRole.includes("Best Team Leader")) {
            endpoint = "/user/fetch_all_TeamLeaders";
        }
    } else if (userRole === "TeamLeader" || userRole === "Employee") {
        endpoint = "/user/fetch_my_employees";
    }

    return await fetchData(endpoint, "GET", null, token);
};

export const fetchManagers = async (token) => {
    return await fetchData("/user/fetch_all_TeamLeaders", "GET", null, token);
};

export const submitNomination = async (selectedEmployee, selectedManagers, selectedRole, reason, token, userRole) => {
    let obj = {
        ManagerIds: selectedManagers.map(m => m.id),
        Nomination_Type: selectedRole,
        Reason: reason,
    };

    if (selectedRole.includes("Best Team")) {
        obj.TeamId = selectedEmployee.id;
    } else {
        obj.UserId = selectedEmployee.id;
    }

    return await fetchData("/api/shoutout", "POST", obj, token);
};
