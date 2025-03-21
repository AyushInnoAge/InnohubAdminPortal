// nominationApi.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUserProfile = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Email: email, Password: password }),
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching login:", error);
        throw error;
    }
};

export const fetchEmployees = async (api, token) => {
    try {
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch employees");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

export const fetchManagers = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/fetch-team-leaders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch managers");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching managers:", error);
        throw error;
    }
};

export const submitNomination = async (nominationData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/shoutout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(nominationData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to submit nomination");

        return data;
    } catch (error) {
        console.error("Error submitting nomination:", error);
        throw error;
    }
};
