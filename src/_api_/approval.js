import axios from "axios";

const getToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};


const SubmitedApproval = async (userId) => {
    try {
        const token = getToken();
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}api/verify_Nominations`,
            { userId },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {

    }
};

const fetchAllApproval = async () => {
    try {
        const token = getToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}users/fetch_nominated_employees`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {

    }
}

const RejectApproval = async (NominationId) => {
    try {
        const token = getToken();
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}api/postreject`,
            { NominationId },
            {
                headers: {

                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        console.error(error);
    }
}


export { SubmitedApproval, fetchAllApproval, RejectApproval };