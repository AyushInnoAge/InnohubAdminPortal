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

    const [roles, setRoles] = useState([]);
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

    // Fetch employees and managers from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users");
                if (!response.ok) throw new Error("Failed to fetch employees");

                const data = await response.json();
                if (data.length === 0) throw new Error("No data available");

                setEmployees(data.sort((a, b) => a.name.localeCompare(b.name)));
                setManagers(data.sort((a, b) => a.name.localeCompare(b.name))); // Using same data for demo
                setRoles([...new Set(data.map(emp => emp.company.bs))]); // Example roles from API
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
            const filtered = employees.filter((emp) =>
                emp.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEmployees(filtered);
            setShowEmployeeDropdown(true);
        }
    }, [searchTerm, employees]);

    // Filter managers based on search term
    useEffect(() => {
        if (!managerSearchTerm.trim()) {
            setFilteredManagers([]);
            setShowManagerDropdown(false);
        } else {
            const filtered = managers.filter((mgr) =>
                mgr.name.toLowerCase().includes(managerSearchTerm.toLowerCase())
            );
            setFilteredManagers(filtered);
            setShowManagerDropdown(true);
        }
    }, [managerSearchTerm, managers]);

    useEffect(() => {
        if (!roleSearchTerm.trim()) {
            setFilteredRoles([]);
            setShowRoleDropdown(false);
        } else {
            const filtered = roles.filter((role) =>
                role.toLowerCase().includes(roleSearchTerm.toLowerCase())
            );
            setFilteredRoles(filtered);
            setShowRoleDropdown(true);
        }
    }, [roleSearchTerm, roles]);

    const handleSelectRole = (role) => {
        setSelectedRole(role);
        setRoleSearchTerm(role);
        setShowRoleDropdown(false);
    };

    // Handle selecting an employee
    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        setSearchTerm(employee.name);
        setShowEmployeeDropdown(false); // Hide dropdown immediately
    };

    // Handle selecting a manager
    // const handleSelectManager = (manager) => {
    //     setSelectedManager(manager);
    //     setManagerSearchTerm(manager.name);
    //     setShowManagerDropdown(false); // Hide dropdown immediately
    // };
  
    //handle selecting multiple managers

const handleSelectManager = (manager) => {
    if (!selectedManagers.some((m) => m.id === manager.id)) {
        setSelectedManagers([...selectedManagers, manager]);
    }
    setManagerSearchTerm(""); // Clear input for next search
};

const handleRemoveManager = (id) => {
    setSelectedManagers(selectedManagers.filter((m) => m.id !== id));
};



    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!selectedEmployee || !selectedManager || !reason.trim()) {
            setError("Please select an employee, a manager, and provide a reason.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5279/nominate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserId: selectedEmployee.id,
                    ManagerId: selectedManager.id,
                    Reason: reason
                }),
            });

            if (!response.ok) throw new Error("Failed to submit nomination");

            setMessage("Nomination submitted successfully!");
            setSelectedEmployee(null);
            setSearchTerm("");
            setSelectedManager(null);
            setManagerSearchTerm("");
            setReason("");
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
                        onFocus={() => setShowRoleDropdown(true)}
                        onBlur={() => setTimeout(() => setShowRoleDropdown(false), 200)}
                    />
                    {roleSearchTerm && <span className={styles.clearIcon} onClick={() => setRoleSearchTerm("")}>❌</span>}
                    {showRoleDropdown && filteredRoles.length > 0 && (
                        <ul className={styles.dropdown}>
                            {filteredRoles.map((role, index) => (
                                <li key={index} className={styles.dropdownItem} onClick={() => handleSelectRole(role)}>
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
                        onFocus={() => setShowEmployeeDropdown(true)}
                        onBlur={() => setTimeout(() => setShowEmployeeDropdown(false), 200)} // Close dropdown on blur
                    />
                    {searchTerm && <span className={styles.clearIcon} onClick={() => setSearchTerm("")}>❌</span>}
                    {showEmployeeDropdown && filteredEmployees.length > 0 && (
                        <ul className={styles.dropdown}>
                            {filteredEmployees.map((employee) => (
                                <li key={employee.id} className={styles.dropdownItem} onClick={() => handleSelectEmployee(employee)}>
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
                            onFocus={() => setShowManagerDropdown(true)}
                            onBlur={() => setTimeout(() => setShowManagerDropdown(false), 200)}
                        />
                    </div>
                    {showManagerDropdown && filteredManagers.length > 0 && (
                        <ul className={styles.dropdown}>
                            {filteredManagers.map((manager) => (
                                <li key={manager.id} className={styles.dropdownItem} onClick={() => handleSelectManager(manager)}>
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