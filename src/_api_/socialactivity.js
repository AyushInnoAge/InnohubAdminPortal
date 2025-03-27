const addSocialActivity = async (activityName, description, date, timing, organisers, category, image, yourToken) => {
    try {
        const formData = new FormData();

        // Append fields
        formData.append("ActivityName", activityName);
        formData.append("Description", description);
        formData.append("Date", new Date(date).toISOString().split("T")[0]); // Format date
        formData.append("Timing", timing);
        formData.append("Category", category);

        // Append image only if it's valid
        if (image && image instanceof File) {
            formData.append("Image", image);
        } else {
            console.warn("No valid image file provided.");
        }

        // Append organisers as an array
        organisers.forEach((organiser, index) => {
            formData.append(`Organisers[${index}]`, organiser);
        });
        console.log(formData)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/SocialActivity`, {
            method: "POST",
            body: formData,
            headers: {
              // Optional: Add token if required
            }
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorResponse}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding social activity:", error.message);
        throw error;
    }
};
const getSocialActivities = async (pageNumber = 1, category = "All", pageSize = 10) => {
    try {
        // Format category for API request
        const categoryQuery = category === "All" ? "" : `&category=${category}`;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/SocialActivity/activities/page/${pageNumber}?pageSize=${pageSize}${categoryQuery}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Optional: Add Authorization token if needed
                },
            }
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorResponse}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching social activities:", error.message);
        throw error;
    }
};

export { addSocialActivity,  getSocialActivities };




