"use client";
import { useState, useEffect, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { submiteNomination } from "@/_api_/nomination";

export default function Nomination({ AllEmployees, Nomination_Type, NominationHeading }) {
  const { user } = useContext(AuthContext);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage]= useState("");

  console.log(AllEmployees)
  const submitedShoutout = async () => {
    try {
      var data = {
        UserId: selectedId,
        ManagerIds: [user.id],
        Nomination_Type: Nomination_Type,
        Reason: reason,
      };
     const response= await submiteNomination(data);
     setSelectedEmployee(null);
     setSelectedId("");
     setReason("");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("response of nomination", AllEmployees);

  useEffect(() => {
    console.log("Id kya hai", selectedId);
  }, [selectedId]);

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
          <Trophy className="text-yellow-500" /> {NominationHeading}{" "}
          <Trophy className="text-yellow-500" />
        </motion.h2>
        <CardContent className="space-y-6 mt-6">
          {/* Nomination Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="font-medium text-gray-700">
              Nomination Category:
            </label>
            <Input
              placeholder="Type a role..."
              className="w-full mt-1 text-black"
              value={Nomination_Type}
              disabled
            />
          </motion.div>

          {/* Employee Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block font-medium text-gray-700">
              Search Employee:
            </label>
            <div className="border p-2 rounded bg-white relative text-black">
              <select
                onChange={(e) => {
                  const selectedOption = AllEmployees.find(
                    (emp) => emp.id === e.target.value
                  );
                  setSelectedEmployee(selectedOption || { id: "", name: "" });
                  setSelectedId(selectedOption?.id || "");
                }}
                value={selectedId}
                className="w-full bg-transparent focus:outline-none"
              >
                <option value="">Select an option</option>
                {AllEmployees.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Manager Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block font-medium text-gray-700">
              Search Managers:
            </label>
            <Input
              placeholder="Manager..."
              className="w-full mt-1 text-black"
              value={user?.name ? user.name : ""}
              disabled
            />
          </motion.div>

          {/* Reason for Nomination */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label className="block font-medium text-gray-700">
              Reason for Nomination:
            </label>
            <Textarea
              placeholder="Write your reason here..."
              className="w-full mt-1 text-black"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition 
            disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={submitedShoutout}
              disabled={!selectedId || !reason}
            >
              click me
            </button>

          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
