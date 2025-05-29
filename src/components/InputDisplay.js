import { motion } from "framer-motion";
import { User, Trophy } from "lucide-react";
import { Card } from "./ui/card";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 12 },
  },
};

export default function ShoutoutLeaderboard({ shoutouts = [] }) {
  return (
   <motion.div
  className="w-full space-y-4"
  initial="hidden"
  animate="visible"
  variants={container}
>
  <div className="flex items-center justify-between border-b px-2 pb-1">
    <h2 className="font-bold text-blue-600 flex items-center gap-2 group relative" style={{ fontSize: '18px' }}>
      Leaderboard
      <div className="w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-gray-400 rounded-full cursor-pointer group-hover:bg-gray-500 transition">
  i
</div>


      {/* Tooltip Box */}
      <div className="absolute z-10 left-0 top-6 w-max whitespace-nowrap bg-white border border-gray-300 rounded-md p-2 shadow-lg text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
        <div>Shoutout = 1 point</div>
        <div>Star of the Month = 5 points</div>
      </div>
    </h2>
  </div>

  {/* Leaderboard */}
  <div className="space-y-3">
    {shoutouts?.length > 0 ? (
      shoutouts.map((emp, i) => {
        const imageUrl = emp.image && emp.image.length > 0
          ? emp.image
          : `https://api.dicebear.com/7.x/initials/svg?seed=${emp.fullName}`;

        return (
          <motion.div key={emp.userId || i} variants={cardVariant}>
            <Card className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
              {/* Profile image */}
              <img
                src={imageUrl}
                alt={emp.fullName}
                className="w-10 h-10 rounded-full object-cover border"
              />

              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{emp.fullName}</p>

                <div className="flex items-center text-sm text-gray-600 gap-1 mt-1">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>
                    {emp.totalScore} Point{emp.totalScore !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Rank */}
              <span className="text-sm text-blue-600 font-bold">#{i + 1}</span>
            </Card>
          </motion.div>
        );
      })
    ) : (
      <p className="text-base text-gray-500 text-center">No data available</p>
    )}
  </div>
</motion.div>
  );
}
