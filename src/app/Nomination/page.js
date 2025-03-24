"use client";
import React, { useState, useEffect, useContext } from "react";
// import { jwtDecode } from "jwt-decode";
import styles from "./NominationForm.module.css";
import { GiTrophyCup } from "react-icons/gi";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import { fetchManagers, submitNomination, fetchEmployees } from "@/_api_/nominationapi";  //Import data form api

const NominationForm = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [managers, setManagers] = useState([]);
    const [filteredManagers, setFilteredManagers] = useState([]);
    const [managerSearchTerm, setManagerSearchTerm] = useState("");
    const [employeeId, setEmployeeId] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [roleSearchTerm, setRoleSearchTerm] = useState("");

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
    const [showManagerDropdown, setShowManagerDropdown] = useState(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const { user } = useContext(AuthContext);
    const [userRole, setUserRole] = useState("");
    //Multiple Managers
    const [selectedManagers, setSelectedManagers] = useState([]);

    const [roles] = useState([
        // "Employee Of The Month",
        "Star Of The Month",
        "Best Team (yearly)",
        "Best Team Leader (yearly)",
        "Best Team (Half yearly)",
        "Best Team Leader (Half yearly)",
        "ShoutOut"
    ]);
    useEffect(() => {
        if (user) { // Ensure user is available before setting state
            const roleMap = {
                1: "Admin",
                2: "HR",
                3: "TeamLeader",
                4: "Employee"
            };
            setUserRole(roleMap[user.userRole] || "Unknown");
            setEmployeeId(user.id);
        }
    }, [user]); // Dependency on `user` ensures it updates correctly

    useEffect(() => {
        console.log("Updated User Data in NominationForm:", { userRole, employeeId });
    }, [userRole, employeeId]);

    //message display time
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(""); // Hide the message after 2 seconds
            }, 2000);

            return () => clearTimeout(timer); // Cleanup function
        }
    }, [message]);

    // Fetch employees and managers from API
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await fetchEmployees(userRole, selectedRole, employeeId); // Call the API method
                setEmployees(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (userRole && selectedRole) { // Ensure dependencies are set before fetching
            loadEmployees();
        }
    }, [userRole, selectedRole, employeeId]); // Correct dependency array

    // Filter employees based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEmployees([]);
            setShowEmployeeDropdown(false);
        } else {
            let filtered = [];

            if (userRole === "HR") {
                if (selectedRole === "Best Team (yearly)" || selectedRole === "Best Team (Half yearly)") {
                    // Filter by teamName for Best Team roles
                    filtered = employees.filter(emp =>
                        emp.teamName?.toLowerCase().startsWith(searchTerm.toLowerCase())
                    );
                } else if (selectedRole === "Star Of The Month") {
                    // Filter by userName for Star Of The Month
                    filtered = employees.filter(emp =>
                        emp.user?.name?.toLowerCase().startsWith(searchTerm.toLowerCase())
                    );
                } else {
                    // Default behavior: filter by employee name
                    filtered = employees.filter(emp =>
                        emp.name?.toLowerCase().startsWith(searchTerm.toLowerCase())
                    );
                }
            } else {
                filtered = employees.filter(emp =>
                    emp.name?.toLowerCase().startsWith(searchTerm.toLowerCase())
                );
            }



            setFilteredEmployees(filtered);
            setShowEmployeeDropdown(filtered.length > 0);
        }
    }, [searchTerm, employees, selectedRole]);

    // Filter managers based on search term
    useEffect(() => {
        const loadManagers = async () => {
            try {
                const data = await fetchManagers(); // Call the API method
                setManagers(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadManagers();
    }, []);

    // Filter managers based on search term
    useEffect(() => {
        if (!managerSearchTerm.trim()) {
            setFilteredManagers([]);
            setShowManagerDropdown(false);
        } else {
            const filtered = managers.filter(manager =>
                manager.name?.toLowerCase().startsWith(managerSearchTerm.toLowerCase())
            );
            setFilteredManagers(filtered);
            setShowManagerDropdown(filtered.length > 0);
        }
    }, [managerSearchTerm, managers]);
    // Filter  search term based on role login
    useEffect(() => {
        if (!userRole) return; // Ensure userRole is set before filtering

        let filtered = [];

        switch (userRole.toLowerCase()) {
            case "hr":
                filtered = roles.filter(role => role.toLowerCase() !== "ShoutOut"); // HR sees all categories except "ShoutOut"
                break;
            case "teamleader":
                filtered = roles.filter(role => !role.toLowerCase().includes("team")); // TeamLeader can't see team-related categories
                break;
            case "employee":
                filtered = ["ShoutOut"]; // Employee can only see "ShoutOut"
                break;
            default:
                filtered = []; // Default to empty if the role is unknown
        }

        // Apply search filtering
        if (roleSearchTerm.trim()) {
            filtered = filtered.filter(role =>
                role.toLowerCase().includes(roleSearchTerm.toLowerCase())
            );
        }

        setFilteredRoles(filtered);
    }, [userRole, roleSearchTerm]);


    // Handle selections
    const handleSelectEmployee = (employee) => {

        if (userRole === "HR") {
            if (selectedRole === "Best Team (yearly)" || selectedRole === "Best Team (Half yearly)") {
                setSearchTerm(employee.teamName);
            }
            else if (selectedRole === "Star Of The Month") {
                setSearchTerm(employee.user.name);
            }
            else {
                setSearchTerm(employee.name);
            }
        }
        else {
            setSearchTerm(employee.name);
        }


        setSelectedEmployee(employee);
        setShowEmployeeDropdown(false);


        // Get manager based on role condition

        let employeeManager = null;
        if (userRole === "HR" && selectedRole === "Star Of The Month") {
            const teamLeaderId = employee?.user?.teamLeaderId;  // Safe access
            console.log("Team Leader ID:", teamLeaderId);

            if (teamLeaderId) {
                employeeManager = managers.find(mgr => mgr.id === teamLeaderId);
            }
            else {
                employeeManager = managers.find(mgr => mgr.id === employee.teamLeaderId);
            }
        }
        else if (userRole == "HR" && (selectedRole === "Best Team (yearly)" || selectedRole === "Best Team (Half yearly)")) {
            employeeManager = managers.find(mgr => mgr.id === employee.teamLeader.id);
        }
        else {
            employeeManager = managers.find(mgr => mgr.id === employee.teamLeaderId);
        }



        if (employeeManager) {
            setSelectedManagers([employeeManager]);
            setManagerSearchTerm(employeeManager.name);  // Auto-select manager
            setManagerSearchTerm("")
        } else {
            setSelectedManagers([]); // Clear if no manager is found
            setManagerSearchTerm("")
        }
    };

    const handleSelectManager = (manager) => {
        if (!selectedManagers.some(m => m.id === manager.id)) {
            setSelectedManagers([...selectedManagers, manager]);
        }
        setManagerSearchTerm("");
        setShowManagerDropdown(false);
    };

    const handleRemoveManager = (id) => {
        setSelectedManagers(selectedManagers.filter(m => m.id !== id));
    };

    const handleSelectRole = (role) => {
        setSelectedRole(role);
        setRoleSearchTerm(role);
        setShowRoleDropdown(false);
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!selectedEmployee || selectedManagers.length === 0 || !reason.trim()) {
            setError("Please select an employee, at least one manager, and provide a reason.");
            return;
        }

        setLoading(true);
        try {
            const resultMessage = await submitNomination(
                selectedEmployee,
                selectedManagers,
                selectedRole,
                reason,
                userRole
            );
            setMessage(resultMessage);
            setSelectedEmployee(null);
            setSearchTerm("");
            setSelectedManagers([]);
            setManagerSearchTerm("");
            setReason("");
            setSelectedRole(null);
            setRoleSearchTerm("");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>

            <div className={`${styles.squareLine} ${styles.squareTopRight}`}></div>
            <div className={`${styles.squareLine} ${styles.squareBottomLeft}`}></div>

            <h2 className={styles.heading}>
                <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                    className={styles.trophyIcon1}
                >
                    <GiTrophyCup size={50} color="#FFD700" />
                </motion.span>
                Nominate an Employee
                <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                    className={styles.trophyIcon2}
                >
                    <GiTrophyCup size={50} color="#FFD700" />
                </motion.span>
            </h2>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Role Search */}
                <label className={styles.label}>Nomination Category:</label>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Type a role..."
                        value={roleSearchTerm}
                        onChange={(e) => setRoleSearchTerm(e.target.value)}
                        onFocus={() => {
                            setShowRoleDropdown(true);

                        }}
                        onBlur={() => setTimeout(() => setShowRoleDropdown(false), 200)}
                    />
                    {roleSearchTerm && <span className={styles.clearIcon} onClick={() => setRoleSearchTerm("")}>❌</span>}
                    {showRoleDropdown && (
                        <ul className={styles.dropdown}>
                            {filteredRoles.map((role, index) => (
                                <li key={index}
                                    className={userRole === userRole ? styles.dropdownItem : ''}
                                    onClick={() => handleSelectRole(role)}>
                                    {role}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Employee Search */}
                <label className={styles.label}>
                    {selectedRole === "Best Team (yearly)" || selectedRole === "Best Team (Half yearly)"
                        ? "Search Team:"
                        : selectedRole === "Best Team Leader (yearly)" || selectedRole === "Best Team Leader (Half yearly)"
                            ? "Search Team Leader:"
                            : "Search Employee:"}
                </label>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Type a name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => {
                            setShowEmployeeDropdown(true);  // Show dropdown when input is focused
                            setFilteredEmployees(employees); // Ensure dropdown is populated
                        }} onBlur={() => setTimeout(() => setShowEmployeeDropdown(false), 200)} // Close dropdown on blur
                    />
                    {searchTerm && <span className={styles.clearIcon} onClick={() => setSearchTerm("")}>❌</span>}
                    {showEmployeeDropdown && (
                        <ul className={styles.dropdown}>
                            {filteredEmployees.map(employee => (
                                <li key={employee.id}
                                    className={employees === employees ? styles.dropdownItem : ''}
                                    onMouseDown={() => handleSelectEmployee(employee)}
                                >
                                    {userRole === "HR" ? (
                                        selectedRole === "Best Team (yearly)" || selectedRole === "Best Team (Half yearly)"
                                            ? employee.teamName
                                            : selectedRole === "Star Of The Month"
                                                ? employee.user.name
                                                : employee.name
                                    ) : employee.name}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>

                {/* Manager Search */}
                <label className={styles.label}>Search Managers:</label>
                <div className={styles.searchContainer}>
                    <div className={styles.selectedManagersContainer}>
                        {selectedManagers.map((manager) => (
                            <span key={manager.id} className={styles.selectedManagerTag}>
                                {manager.name}
                                <span className={styles.removeIcon} onClick={() => handleRemoveManager(manager.id)}>❌</span>
                            </span>
                        ))}
                        <input
                            type="text"
                            className={styles.inputmanager}
                            placeholder="Type a manager's name..."
                            value={managerSearchTerm}
                            onChange={(e) => setManagerSearchTerm(e.target.value)}
                            onFocus={() => {
                                setShowManagerDropdown(true);
                                setFilteredManagers(managers);
                            }}

                            onBlur={() => setTimeout(() => setShowManagerDropdown(false), 200)}
                        />
                    </div>
                    {showManagerDropdown && (
                        <ul className={styles.dropdown}>
                            {filteredManagers.map(manager => (
                                <li key={manager.id}
                                    className={managers === managers ? styles.dropdownItem : ''}
                                    onMouseDown={() => handleSelectManager(manager)}>
                                    {manager.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                {/* Reason for Nomination */}
                <label className={styles.label}>Reason for Nomination:</label>
                <textarea
                    className={styles.textarea}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={500}
                    placeholder="Write your reason here..."
                ></textarea>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={
                        loading ||
                        !selectedRole ||
                        !selectedEmployee ||
                        reason.trim().length === 0 ||
                        searchTerm.trim().length === 0 ||
                        selectedManagers.length === 0 ||
                        roleSearchTerm.trim().length === 0
                    }
                >
                    {loading ? "Submitting..." : "Submit Nomination"}
                </button>
            </form>
        </div>
    );
};

export default NominationForm;