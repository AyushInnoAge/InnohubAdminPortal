"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { RiImageEditFill } from "react-icons/ri";
import { RiCoinsFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import "./profilepage.css";
import Navbar from "../navbar/page";

export default function ProfilePage() {
  const [badges, setBadges] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    Name: "",
    EmpID: "",
    Role: "",
    Team: "",
    Designation: "",
    Email: "",
    Phone: "",
    Address: "",
    profilePicture: "/profile.jpg",
  });

  useEffect(() => {
    const badgeData = [
      { name: "Top Performer", color: "badge-yellow" },
      { name: "5+ Years", color: "badge-gray" },
      { name: "Team Player", color: "badge-blue" },
      { name: "Customer Favorite", color: "badge-green" },
      { name: "Innovator", color: "badge-red" },
      { name: "Outstanding Contributor", color: "badge-purple" },
    ];
    setBadges(badgeData);
  }, []);
  
  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch("http://localhost:5279/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "shahivedant1@gmail.com",
            password: "ved@123",
          }),
        });
        console.log(response.response)

        const data = await response.json();

        if (data.success) {
          console.log(data);
          const token = data.response.token;
          localStorage.setItem("token", token);
          const decoded = jwtDecode(token);

          setProfileData({
            FullName: decoded.Name || "",
            EmpID: decoded.EmployeeId || "",
            Role: decoded.Role || "",
            Team: decoded.Team || "",
            Designation: decoded.Designation || "",
            Email: decoded.EmailId || "",
            Phone: decoded.PhoneNo || "",
            Address: decoded.Address || "",
            profilePicture: "/profile.jpg",
          });
        }
      } catch (error) {
        console.error("Error fetching login:", error);
      }
    };

    login();
  }, []);

  const handleEdit = async () => {
    if (editMode) {
      try {
        const patchData = [
          { op: "replace", path: "/Name", value: profileData.FullName },
          { op: "replace", path: "/Email", value: profileData.Email },
          { op: "replace", path: "/PhoneNo", value: profileData.Phone },
          { op: "replace", path: "/Image", value: profileData.profilePicture },
          { op: "replace", path: "/Address", value: profileData.Address },
        ];

        const response = await fetch(`http://localhost:5279/UpdateUserProfile/${profileData.EmpID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(patchData),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        const result = await response.json();
        console.log("Profile updated successfully", result);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, profilePicture: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="profile-card">
        <div className="xps-icon">
                       <RiCoinsFill className="icon1" />
                       <a href="/available-xps" className="xps-text">
                         Available XPs
                       </a>
                     </div>
          <div className="profile-left">
         
            <div className="profile-img-wrapper">
              <Image
                src={profileData.profilePicture}
                alt="Profile"
                width={160}
                height={160}
                className="profile-img"
              />
              {editMode && (
                <label className="image-edit-label">
                  <RiImageEditFill className="image-edit-icon" />
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              )}
            </div>
            <h2 className="profile-name">{profileData.FullName}</h2>
            <p className="profile-role">{profileData.Role}</p>
            <p className="profile-designation">{profileData.Designation}</p>
            <p className="profile-designation">IT Department</p>
            <p className="profile-address">{profileData.Address}</p>
            <div className="badges">
              <h3 className="badge-title">Badges Earned</h3>
              <div className="badge-list">
                {badges.map((badge, index) => (
                  <span key={index} className={`badge ${badge.color}`}>
                    {badge.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="profile-right">
            <h3 className="section-title">Personal Information</h3>
            <div className="info-grid">
              {Object.entries(profileData).map(([key, value]) => (
                key !== "profilePicture" && key !== "Role" && key !== "designation" ? (
                  <div key={key} className="info-item">
                    <label>{key.replace(/([A-Z])/g, " $1").trim()}</label>
                    {editMode ? (
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{value}</p>
                    )}
                  </div>
                ) : null
              ))}
            </div>
            <button className="edit-btn" onClick={handleEdit}>
              <FaEdit /> {editMode ? "Save" : "Edit"}
            </button>
            <div className="achievements">
              <h3 className="section-title">Achievements</h3>
              <ul className="achievements-list">
                <li className="achievement-item">🏆 Employee of the Month - January 2024</li>
                <li className="achievement-item">✅ Completed 100+ projects successfully</li>
                <li className="achievement-item">🔥 Top performer in Q3 2023</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
