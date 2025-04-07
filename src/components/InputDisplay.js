import { motion } from "framer-motion";
import { Star, Heart, User } from "lucide-react";
import { Card } from "./ui/card";

// Motion variants
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
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

const iconVariant = {
  hidden: { x: -20, opacity: 0, rotate: -10 },
  visible: {
    x: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const textVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.3 },
  },
};

const iconMap = {
  star: <Star className="w-5 h-5 text-yellow-500" />,
  heart: <Heart className="w-5 h-5 text-pink-500" />,
  user: <User className="w-5 h-5 text-blue-500" />,
};

export default function ShoutoutSection({
  shoutouts = [
    { id: 1, type: "star", text: "Ayush is crushing it with clean code!" },
    { id: 2, type: "heart", text: "Kudos to Neha for helping with the deadline!" },
    { id: 3, type: "user", text: "Big thanks to Ankit for mentoring juniors!" },
  ],
}) {
  return (
    <motion.div
      className="w-full space-y-4"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-2 pb-1">
        <h2 className="text-lg font-bold text-purple-700">Shoutout Showcase</h2>

        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Star className="w-5 h-5 text-yellow-500" />
        </motion.div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {shoutouts.length > 0 ? (
          shoutouts.map((s, i) => (
            <motion.div key={s.id} variants={cardVariant}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="flex items-start gap-3 p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
                  <motion.div
                    className="p-2 rounded-full bg-gray-100"
                    variants={iconVariant}
                  >
                    {iconMap[s.type]}
                  </motion.div>
                  <motion.div className="text-sm text-gray-700 font-medium" variants={textVariant}>
                    {s.text}
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">No shoutouts yet</p>
        )}
      </div>
    </motion.div>
  );
}
