"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./navbar.css";
import { FaShoppingCart, FaBars, FaTimes, FaTrophy, FaChevronDown, FaThLarge } from "react-icons/fa";
import { IoNotificationsSharp, IoBicycleOutline } from "react-icons/io5";
import { GrDocumentPerformance } from "react-icons/gr";
import { MdOutlineEvent } from "react-icons/md";
import { RiGalleryFill } from "react-icons/ri";

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const notificationCount = 5;

  // Toggle dropdown menus
  const toggleDropdown = (menu) => {
    setDropdownOpen(isDropdownOpen === menu ? null : menu);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileOpen(!isProfileOpen);
  };

  // Toggle sidebar menu
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
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

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".sidebar") && !event.target.closest(".menu-btn")) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Hamburger Button */}
          <button className="menu-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Logo */}
          <div className="logo-container">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <span className="brand-name">Inno Age</span>
          </div>

          {/* Navigation Links */}
          <div className={`nav-links ${isSidebarOpen ? "hide" : ""}`}>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>

            {/* Awards Dropdown */}
            <div className="nav-item">
              <button className="nav-link dropdown-btn" onClick={() => toggleDropdown("awards")}>
                Awards <FaChevronDown size={12} />
              </button>
              {isDropdownOpen === "awards" && (
                <div className="dropdown-content lower-dropdown">
                  <Link href="/Nomination" className="dropdown-item">Nomination</Link>
                  <Link href="/awards/employee-month" className="dropdown-item">Employee of the Month</Link>
                  <Link href="/awards/top-performers" className="dropdown-item">Top Performers</Link>
                </div>
              )}
            </div>

            {/* Fun & Social Activities Dropdown */}
            <div className="nav-item">
              <button className="nav-link dropdown-btn" onClick={() => toggleDropdown("fun")}>
                Fun & Social Activities <FaChevronDown size={12} />
              </button>
              {isDropdownOpen === "fun" && (
                <div className="dropdown-content lower-dropdown">
                  <Link href="/activities/team-building" className="dropdown-item">Team Building</Link>
                  <Link href="/activities/events" className="dropdown-item">Company Events</Link>
                  <Link href="/activities/recent-outings" className="dropdown-item">Recent Outings</Link>
                  <Link href="/activities/upcoming-events" className="dropdown-item">Upcoming Events</Link>
                  <Link href="/activities/gallery" className="dropdown-item">Gallery</Link>
                  <Link href="/activities/policies" className="dropdown-item">Policies</Link>
                </div>
              )}
            </div>
          </div>

          {/* Profile & Cart */}
          <div className="right-container">
            {/* Profile Dropdown */}
            <div className="profile-container">
              <button className="profile-btn" onClick={toggleProfileDropdown}>
                <Image src="/profile1.webp" alt="User" className="profile-pic" width={32} height={32} />
                <span className="profile-text">Vedant</span>
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <Link href="/profile/edit" className="dropdown-item">Profile</Link>
                  <Link href="/logout" className="dropdown-item">Logout</Link>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="cart">
              <Link href="/cart" className="nav-link1">
                <FaShoppingCart />
              </Link>
            </div>

            {/* Notifications */}
            <div className="notification">
              <Link href="/notifications" className="nav-link2">
                <IoNotificationsSharp className="notification-icon" />
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      {isSidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <Image src="/logo.svg" alt="Logo" width={120} height={40} />
          </div>

          <div className="sidebar-menu">
            <Link href="/dashboard" className="sidebar-link" onClick={toggleSidebar}>
              <FaThLarge /> Dashboard
            </Link>

            {/* Awards Section */}
            <div className="sidebar-section">Awards</div>
            <Link href="/awards/employee-month" className="sidebar-link" onClick={toggleSidebar}>
              <FaTrophy /> Employee of the Month
            </Link>
            <Link href="/awards/top-performers" className="sidebar-link" onClick={toggleSidebar}>
              <GrDocumentPerformance /> Top Performers
            </Link>

            {/* Fun & Social Activities Section */}
            <div className="sidebar-section">Fun & Social Activities</div>
            <Link href="/activities/team-building" className="sidebar-link" onClick={toggleSidebar}>
              <MdOutlineEvent /> Team Building
            </Link>
            <Link href="/activities/recent-outings" className="sidebar-link" onClick={toggleSidebar}>
              <IoBicycleOutline /> Recent Outings
            </Link>
            <Link href="/activities/gallery" className="sidebar-link" onClick={toggleSidebar}>
              <RiGalleryFill /> Gallery
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
