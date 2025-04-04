"use client";
import "./page.css";
import { useState } from "react";
import { Pencil,X} from "lucide-react";
 
const sampleEmployees = [
  {
    id: 1,
    name: "Alice Johnson",
    department: "HR",
    designation: "HR Manager",
    email: "alice@company.com",
    phoneNo: "1234567890",
    address: "123 Main St",
    dob: "1990-01-15",
    doj: "2020-06-01",
    profile: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Bob Smith",
    department: "Finance",
    designation: "Accountant",
    email: "bob@company.com",
    phoneNo: "9876543210",
    address: "456 Market St",
    dob: "1988-04-10",
    doj: "2018-03-15",
    profile: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Charlie Lee",
    department: "IT",
    designation: "Software Engineer",
    email: "ch@company.com",
    phoneNo: "5551234567",
    address: "789 Tech Blvd",
    dob: "1995-07-20",
    doj: "2022-01-10",
    profile: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    id: 4,
    name: "Diana Prince",
    department: "HR",
    designation: "Recruiter",
    email: "diana@company.com",
    phoneNo: "2223334444",
    address: "22 Hero Ave",
    dob: "1992-11-30",
    doj: "2019-08-25",
    profile: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];
 
const departments = ["All", "HR", "Finance", "IT"];
 
export default function EmployeeListPage() {
  const [filter, setFilter] = useState("All");
  const [employees, setEmployees] = useState(sampleEmployees);
  const [editingEmployee, setEditingEmployee] = useState(null);
 
  const filteredEmployees =
    filter === "All"
      ? sampleEmployees
      : sampleEmployees.filter((emp) => emp.department === filter);
      const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingEmployee({ ...editingEmployee, [name]: value });
      };
   
      const handleEditSubmit = () => {
        const updated = employees.map((emp) =>
          emp.id === editingEmployee.id ? editingEmployee : emp
        );
        setEmployees(updated);
        setEditingEmployee(null);
      };
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setEditingEmployee((prev) => ({
              ...prev,
              image: reader.result, // Temporarily display preview before upload
              imageFile: file, // Store actual file for API upload
            }));
          };
          reader.readAsDataURL(file);
        }
      };
 
  return (
    <div className="page-container">
      <button className="add-activity-btn" style={{ marginLeft: "auto" }}>
        <span className="plus-icon">+ </span>Add New Employee
      </button>
      <div className="filter-buttons">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setFilter(dept)}
            className={`filter-btn ${filter === dept ? "active" : ""}`}
          >
            {dept}
          </button>
        ))}
      </div>
 
      <div className="employee-list">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="employee-card">
            <div className="employee-info">
              <img src={emp.profile} alt={emp.name} className="profile-img" />
              <div className="employee-details">
                <div>
                  <h2 className="employee-name">{emp.name}</h2>
                  <p className="employee-role">{emp.designation}</p>
                </div>
                <div className="employee-contact email">📧 {emp.email}</div>
                <div className="employee-contact phone">📞 {emp.phoneNo}</div>
                <div className="employee-contact dept">🏢 {emp.department}</div>
              </div>
            </div>
 
            <button className="edit-btn" onClick={() => setEditingEmployee(emp)}>
              <Pencil size={16} /> Edit
            </button>
          </div>
        ))}
      </div>
     
{/* EDIT MODAL */}
{editingEmployee && (
  <div className="modal-backdrop">
    <div className="modal-box small-modal">
      <div className="modal-header">
        <h3>Edit Employee</h3>
        <button onClick={() => setEditingEmployee(null)} className="close-btn">
          <X size={20} />
        </button>
      </div>
 
      <div className="modal-body">
        {/* Profile Image */}
        <div className="form-row center-content">
          <img src={ "https://randomuser.me/api/portraits/women/44.jpg"} alt="Profile" className="profile-preview" />
        </div>
        <div className="form-row">
  <label>Change Image:</label>
  <input type="file" accept="image/*" onChange={handleImageChange} />
</div>
 
        {/* Name */}
        <div className="form-row">
          <label>Name:</label>
          <input type="text" name="name" value={editingEmployee.name} onChange={handleEditChange} />
        </div>
 
        {/* Designation */}
        <div className="form-row">
          <label>Designation:</label>
          <input type="text" name="designation" value={editingEmployee.designation} onChange={handleEditChange} />
        </div>
 
        {/* Email */}
        <div className="form-row">
          <label>Email:</label>
          <input type="email" name="email" value={editingEmployee.email} onChange={handleEditChange} />
        </div>
 
        {/* Phone No */}
        <div className="form-row">
          <label>Phone No:</label>
          <input type="text" name="phoneNo" value={editingEmployee.phoneNo} onChange={handleEditChange} />
        </div>
 
     
        <div className="form-row">
          <label>Department:</label>
          <select name="departmentId" value={editingEmployee.departmentId} onChange={handleEditChange}>
            <option value="">Select</option>
            <option value="67bd79deaf1e63e00a86f4fa">IT</option>
            <option value="someId2">HR</option>
            <option value="someId3">Finance</option>
          </select>
        </div>
 
        <div className="form-row">
          <label>Role:</label>
          <select name="roleId" value={editingEmployee.roleId} onChange={handleEditChange}>
            <option value="">Select</option>
            <option value="67bcaa3170f4fb3a89f41e3a">Team Leader</option>
            <option value="someRoleId2">Employee</option>
          </select>
        </div>
 
   
        <div className="form-row">
          <label>Team:</label>
          <select name="teamId" value={editingEmployee.teamId} onChange={handleEditChange}>
            <option value="">Select</option>
            <option value="67c5574b52fbf65c01ef86f6">Development</option>
            <option value="someTeamId2">Design</option>
          </select>
        </div>
 
        {/* Save Button */}
        <button className="submit-btn" onClick={handleEditSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
 
 
 
    </div>
   
  );
}