"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const notificationCount = 5;

  // Toggle dropdown menus
  const toggleDropdown = (menu) => {
    setDropdownOpen(isDropdownOpen === menu ? null : menu);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileOpen(!isProfileOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".nav-item") && !event.target.closest(".profile-container")) {
        setDropdownOpen(null);
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo-container">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="brand-name">Inno Age</span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link href="/dashboard" className="nav-link">
            Dashboard
          </Link>

          {/* Awards Dropdown */}
          
          <div className="nav-item">
            <div className="dropdown1">
            <button className="nav-link dropdown-btn" onClick={() => toggleDropdown("awards")}>
              Awards
            </button>
            <FaChevronDown size={12}  onClick={() => toggleDropdown("awards")}/> 
            </div>

      
            {isDropdownOpen === "awards" && (
              <div className="dropdown-content lower-dropdown">
                <Link href="/awards/employee-month" className="dropdown-item">
                  Employee of the Month
                </Link>
                <Link href="/awards/top-performers" className="dropdown-item">
                  Top Performers
                </Link>
              </div>
            )}
          </div>

          {/* Fun & Social Activities Dropdown */}
          <div className="nav-item">
          <div className="dropdown1">
          <button className="nav-link dropdown-btn" onClick={() => toggleDropdown("fun")} >Fun & Social Activities</button>
          <FaChevronDown size={12}   onClick={() => toggleDropdown("fun")}/>
          </div>
           
            {isDropdownOpen === "fun" && (
              <div className="dropdown-content lower-dropdown">
                <Link href="/activities/team-building" className="dropdown-item">
                  Team Building
                </Link>
                <Link href="/activities/events" className="dropdown-item">
                  Company Events
                </Link>
                <Link href="/activities/events" className="dropdown-item">
                  Recent Outings
                </Link>
                <Link href="/activities/events" className="dropdown-item">
                  Upcomming Events
                </Link>
                <Link href="/activities/events" className="dropdown-item">
                  Gallery
                </Link>
                <Link href="/activities/events" className="dropdown-item">
                  Policies
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Profile & Cart */}
        <div className="right-container">
          <div className="profile-container">
            <button className="profile-btn" onClick={toggleProfileDropdown}>
              <Image src="/profile1.webp" alt="User"  className="profile-pic" width={32} height={32} />
              <span className="profile-text">Vedant</span>
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <Link href="/profile/edit" className="dropdown-item">Edit Profile</Link>
                <Link href="/logout" className="dropdown-item">Logout</Link>
              </div>
            )}
          </div>
          <div className="cart">
            <Link href="/cart" className="nav-link1">
              <FaShoppingCart />
            </Link>
          </div>
          <div className="notification">
            <Link href="/notifications" className="nav-link2">
              <IoNotificationsSharp className="notification-icon" />
              {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
