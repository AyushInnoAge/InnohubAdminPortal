
import axios from "axios";


const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const updateUserProfile = async (empID, email, phone, address, image) => {
    try {
       
      const token = getToken();
     
      const url = `User/UpdateUserProfile/${empID}`;
      
      const patchData = [
        { op: "replace", path: "/Email", value: email },
        { op: "replace", path: "/PhoneNo", value: phone },
        { op: "replace", path: "/Address", value: address },
        { op: "replace", path: "/Image", value: image }
      ];

      
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}User/UpdateUserProfile/${empID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json-patch+json",
          Authorization: `Bearer ${token}`, // Ensure you have a function to retrieve the token
        },
        body: JSON.stringify(patchData),
      });
      console.log(response)
      return response
    } catch (error) {
      throw new Error(error.message);
    }
  };
  

export{
    updateUserProfile
}