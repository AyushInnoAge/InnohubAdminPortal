'use client';
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["All", "Team Lunch And Outings", "Social", "Work", "Sports Event"];
const employees = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Charlie Adams"];
const managers = ["Manager 1", "Manager 2", "Manager 3", "Manager 4"];

export default function Nomination(
  AllEmployees,
  Manager,
  Role
) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [reason, setReason] = useState("");
  const [role, setRole] = useState(Role);
  const [employees, setEmployees] = useState([]);
  const [userId, setUserId] = useState([]);
  const [index, setIndex] = useState(null);
  const [Allemployee, setAllEmployees] = useState([]);




  //categories yhi define ho ga 
  //submission yhi se apply ho ga

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 w-full bg-transparent">
     
      {/* Form */}
      <Card className="w-full max-w-5xl p-8 bg-white rounded-2xl shadow-2xl border mt-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-3"
        >
          <Trophy className="text-yellow-500" /> Nominate an Employee <Trophy className="text-yellow-500" />
        </motion.h2>

        <CardContent className="space-y-6 mt-6">
          
          {/* Nomination Category */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <label className="font-medium text-gray-700">Nomination Category:</label>
            <Input placeholder="Type a role..." className="w-full mt-1" disabled/>
          </motion.div>

          {/* Employee Selection */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <label className="block font-medium text-gray-700">Search Employee:</label>
            <Combobox
              options={employees}
              selected={selectedEmployee}
              onChange={setSelectedEmployee}
              placeholder="Select an employee..."
              className="w-full"
              userIndex={setIndex}
            />
          </motion.div>

          {/* Manager Selection */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <label className="block font-medium text-gray-700">Search Managers:</label>
            <Input placeholder="Manager..." className="w-full mt-1" disabled/>
          </motion.div>

          {/* Reason for Nomination */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <label className="block font-medium text-gray-700">Reason for Nomination:</label>
            <Textarea 
              placeholder="Write your reason here..." 
              className="w-full mt-1" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
            <Button 
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              disabled={!selectedEmployee || !selectedManager || !reason}
            >
              Submit Nomination
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}