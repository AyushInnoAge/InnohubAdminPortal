"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaEdit, FaMedal, FaTrophy, FaAward } from "react-icons/fa";
import "./profilepage.css";

import { RiCoinsFill } from "react-icons/ri";
import { RiImageEditFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const badgeData = [
      { name: "Top Performer", color: "gold" },
      { name: "5+ Years", color: "silver" },
      { name: "Team Player", color: "blue" },
      { name: "Customer Favorite", color: "green" },
      { name: "Innovator", color: "red" },
      { name: "Outstanding Contributor", color: "purple" },
    ];

    setBadges(badgeData);
  }, []);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    EmpID: "",
    Role: "",
    Team: "",
    designation: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "/profile.jpg",
  });
  // Fetch user data from API
  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch("http://localhost:5279/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "shahivedant1@gmail.com",//actual credentials
            password: "Vedsh@1267", //actual credentials
          }),
        });

        const data = await response.json();

        if (data.success) {
          const token = data.token;
          localStorage.setItem("token", token); // Store token in localStorage

          const decoded = jwtDecode(token);
          console.log("Decoded Token:", decoded);

          setProfileData({
            fullName: decoded.Name || "",
            EmpID: decoded.EmployeeId || "",
            Role: decoded.Role || "",
            Team: decoded.Team || "",
            designation: decoded.Designation || "",
            email: decoded.EmailId || "",
            phone: decoded.PhoneNo || "",
            address: decoded.Address || "",
            profilePicture: "/profile.jpg",
          });
        }
      } catch (error) {
        console.error("Error fetching login:", error);
      }
    };

    login();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, profilePicture: imageUrl });
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <div className="xps-icon">
            <RiCoinsFill className="icon1" />
            <a href="/available-xps" className="xps-text">
              Available XPs
            </a>
          </div>

          {/* Left Panel */}
          <div className="profile-left">
            <div className="profile-image-container">
              <Image
                src={profileData.profilePicture}
                alt="Profile"
                width={140}
                height={140}
                className="profile-picture"
              />
              {editMode && (
                <label className="edit-image-label">
                  <RiImageEditFill className="edit-icon" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <h2>{profileData.fullName}</h2>
            <p className="Role">{profileData.Role}</p>
            <p className="job-title">{profileData.designation}</p>
            <p className="job-title">IT Department</p>
            <p className="location">{profileData.address}</p>

            {/* Badges Section */}
            <div className="badges-section">
              <h3>Badges Earned</h3>
              <div className="badge-container">
                {badges.map((badge, index) => (
                  <span key={index} className={`badge ${badge.color}`}>
                    {badge.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="profile-right">
            <div className="profile-info">
              <h3>Personal Information</h3>
              <div className="info-row">
                <label>Full Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.fullName}</p>
                )}
              </div>
              <div className="info-row">
                <label>Employee ID</label>
                <p>{profileData.EmpID}</p>
              </div>
              <div className="info-row">
                <label>Team</label>
                <p>{profileData.Team}</p>
              </div>

              <div className="info-row">
                <label>Email</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.email}</p>
                )}
              </div>
              <div className="info-row">
                <label>Phone</label>
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>

              <div className="info-row">
                <label>Address</label>
                {editMode ? (
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.address}</p>
                )}
              </div>
              <button
                className="edit-button"
                onClick={() => setEditMode(!editMode)}
              >
                <FaEdit /> {editMode ? "Save" : "Edit"}
              </button>
            </div>

            {/* Achievements Section */}
            <div className="achievements-section">
              <h3>Achievements</h3>
              <ul className="achievement-list">
                <li>🏆 Employee of the Month - January 2024</li>
                <li>✅ Completed 100+ projects successfully</li>
                <li>🔥 Top performer in Q3 2023</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
