const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const updateUserProfile = async (empID, email, phone, address, image) => {
  try {
    const token = getToken();

    // Build the JSON patch document (excluding image since it's uploaded separately)
    const patchData = [
      { op: "replace", path: "/Email", value: email },
      { op: "replace", path: "/PhoneNo", value: phone },
      { op: "replace", path: "/Address", value: address }
    ];

    // Create FormData and append the JSON patch as text.
    const formData = new FormData();
    formData.append("patchDoc", JSON.stringify(patchData));

    // If an image file is provided, append it to the FormData.
    if (image) {
      formData.append("imageFile", image);
    }

    // Construct the URL.
    const url = `${process.env.NEXT_PUBLIC_API_URL}User/UpdateUserProfile/${empID}`;

    // Make the PATCH request. Note: Do not set the Content-Type header here.
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });
    const res = await response.json();
    return res;
  } catch (error) {
    throw new Error(error.message);
  }
};
const lockUserProfile = async (empID,image) => {
  try {
    const token = getToken();

    // Build the JSON patch document (excluding image since it's uploaded separately)
    const patchData = [
      { op: "replace", path: "/isActive", value: false },
    ];

    // Create FormData and append the JSON patch as text.
    const formData = new FormData();
    formData.append("patchDoc", JSON.stringify(patchData));

    // If an image file is provided, append it to the FormData.
    if (image) {
      formData.append("imageFile", image);
    }
    console.log("formData",formData);

    // Construct the URL.
    const url = `${process.env.NEXT_PUBLIC_API_URL}User/UpdateUserProfile/${empID}`;

    // Make the PATCH request. Note: Do not set the Content-Type header here.
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });
    const res = await response.json();
    return res;
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  updateUserProfile,lockUserProfile
};
