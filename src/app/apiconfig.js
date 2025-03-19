const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_ENDPOINTS = {
    FETCH_NOMINATED_EMPLOYEES: `${API_BASE_URL}fetchNominatedEmployees`,
    FETCH_ALL_TEAMS: `${API_BASE_URL}fetchAllTeams`,
    FETCH_ALL_TEAM_LEADERS: `${API_BASE_URL}user/fetch_all_TeamLeaders`,
    FETCH_MY_EMPLOYEES: `${API_BASE_URL}fetchMyEmployees`,
    SHOUTOUT_API: `${API_BASE_URL}shoutout`,
};

export default API_ENDPOINTS;
