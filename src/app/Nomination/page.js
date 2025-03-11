"use client";
import React, { useState, useEffect } from "react";
import styles from "./NominationForm.module.css";
import { GiTrophyCup } from "react-icons/gi";
import { motion } from "framer-motion";
import Image from "next/image";


const NominationForm = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [managers, setManagers] = useState([]);
    const [filteredManagers, setFilteredManagers] = useState([]);
    const [managerSearchTerm, setManagerSearchTerm] = useState("");

    //  const [roles, setRoles] = useState([]);
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

    //Multiple Managers
    const [selectedManagers, setSelectedManagers] = useState([]);
    const [roles] = useState([
        "Employee of the Month",
        "Star of the Month",
        "Best Team Leader",
        "Employee of the Year",
        "Employee of the Quarter",
        "Rising Star",
        "Problem Solver",
        "Best Mentor",
        "ShoutOut"
    ]);
    // Fetch employees and managers from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    console.error("No token found, user might be logged out.");
                    return;
                }
                const response = await fetch("http://localhost:5279/user/fetch_users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch employees");

                const data = await response.json();
                console.log(data);

                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error("No valid data available");
                }

                setEmployees(data);
                setManagers(data);
                //  setRoles([...new Set(data.map(emp => emp.role))]); // Assuming `role` exists in the API
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    // Filter employees based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEmployees([]);
            setShowEmployeeDropdown(false);
        } else {
            const filtered = employees.filter(emp =>
                emp.name.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
            setFilteredEmployees(filtered);
            setShowEmployeeDropdown(filtered.length > 0);
        }
    }, [searchTerm, employees]);

    // Filter managers based on search term
    useEffect(() => {
        if (!managerSearchTerm.trim()) {
            setFilteredManagers([]);
            setShowManagerDropdown(false);
        } else {
            const filtered = managers.filter(mgr =>
                mgr.name.toLowerCase().startsWith(managerSearchTerm.toLowerCase())
            );
            setFilteredManagers(filtered);
            setShowManagerDropdown(filtered.length > 0);
        }
    }, [managerSearchTerm, managers]);


    // Filter roles based on search term
    useEffect(() => {
        if (!roleSearchTerm.trim()) {
            setFilteredRoles([]);
            setShowRoleDropdown(false);
        } else {
            const filtered = roles.filter(role =>
                role.toLowerCase().startsWith(roleSearchTerm.toLowerCase()) // Ensures it starts with the input
            );
            setFilteredRoles(filtered);
            setShowRoleDropdown(filtered.length > 0);
        }
    }, [roleSearchTerm, roles]);


    // Handle selections
    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        setSearchTerm(employee.name);
        setShowEmployeeDropdown(false);

        // Assuming each employee has a `managerId` field
        const employeeManager = managers.find(mgr => mgr.id === employee.managerId);

        if (employeeManager) {
            setSelectedManagers([employeeManager]);  // Auto-select manager
        } else {
            setSelectedManagers([]);  // Clear if no manager is found
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
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No token found, user might be logged out.");
                return;
            }
            const response = await fetch("http://localhost:5279/api/shoutout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    UserId: selectedEmployee.id,
                    ManagerIds: selectedManagers.map(m => m.id),
                    Nomination_Type: selectedRole,
                    Reason: reason
                }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error("Failed to submit nomination");
            // console.log(response);

            setMessage(result.message);
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
                <label className={styles.label}>Search Role:</label>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Type a role..."
                        value={roleSearchTerm}
                        onChange={(e) => setRoleSearchTerm(e.target.value)}
                        onFocus={() => {
                            setShowRoleDropdown(true);
                            setFilteredRoles(roles);
                        }}
                        onBlur={() => setTimeout(() => setShowRoleDropdown(false), 200)}
                    />
                    {roleSearchTerm && <span className={styles.clearIcon} onClick={() => setRoleSearchTerm("")}>❌</span>}
                    {showRoleDropdown && (
                        <ul className={styles.dropdown}>
                            {filteredRoles.map((role, index) => (
                                <li key={index} onClick={() => handleSelectRole(role)}>
                                    {role}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Employee Search */}
                <label className={styles.label}>Search Employee:</label>
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
                                <li key={employee.id} onMouseDown={() => handleSelectEmployee(employee)}>
                                    {employee.name}
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
                                <li key={manager.id} onMouseDown={() => handleSelectManager(manager)}>
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

