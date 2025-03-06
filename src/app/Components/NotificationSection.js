import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Card } from "../Components/ui/card";

export default function NotificationSection({ notifications=[] }) {
  return (
    <div className="w-full">
      {/* Notification Header */}
      <div className="flex items-center justify-between border-b p-2">
        <h2 className="text-lg font-semibold text-blue-700">Notifications</h2>

        {/* Animated Bell Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <Bell className="w-6 h-6 text-gray-500" />
        </motion.div>
      </div>

      {/* Notification List (Scrollable) */}
      <div className="max-h-64 overflow-y-auto space-y-2 p-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className="p-2 border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
            >
              <p className="text-sm text-gray-700">{notification.text}</p>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">No notifications</p>
        )}
      </div>
    </div>
  );
}