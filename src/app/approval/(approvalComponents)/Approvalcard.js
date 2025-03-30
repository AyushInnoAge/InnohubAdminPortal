"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";

const EventCard = ({ NominationType, NominationReason, NominatedName, Image }) => {
  const [expanded, setExpanded] = useState(false);

  const words = NominationReason.split(" ");
  const shouldTruncate = words.length > 20;
  const displayedText = expanded
    ? NominationReason
    : words.slice(0, 20).join(" ") + (shouldTruncate ? "..." : "");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden w-[380px] h-[500px] flex flex-col"
    >
      <motion.img
        src={Image}
        alt="profileImage"
        className="w-full h-[200px] object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <div className="p-4 flex-1 flex flex-col">
        <motion.h3
          className="text-2xl font-bold mb-2 text-black"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {NominationType}
        </motion.h3>
        <p className="text-gray-600 text-sm flex-grow overflow-hidden">{displayedText}</p>
        {shouldTruncate && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-blue-500 underline mt-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "View Less" : "View More"}
          </motion.button>
        )}
        <p className="text-md font-semibold mt-3">Organiser: {NominatedName}</p>
      </div>
      <div className="p-4 flex justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Approve
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Reject
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventCard;
