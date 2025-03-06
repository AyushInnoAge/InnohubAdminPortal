import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import axios from "axios";
import NotificationSection from "@/app/Components/NotificationSection";

const AnimatedPostCard = ({
  profileImage,
  username,
  profileUrl,
  title,
  description,
  imageUrl,
  PostId,
  like = 0,
  date
}) => {
  const [hoverDirection, setHoverDirection] = useState({ x: 0, y: 0 });
  const [Like, setLike] = useState(like);
  const timing = new Date(date);
  const time = `${timing.getDate()}-${timing.getMonth() + 1}-${timing.getFullYear()}`
  const [notification, setNotification] = useState(false);
  const [notifications, setNotifications] = useState(
    [
      { id: 1, text: "New login from a different device", type: "alert" },
      { id: 2, text: "IndiaToday is LIVE: '#LIVE | Big News' ", type: "live" },
      { id: 3, text: "New comment on your post", type: "comment" },
      { id: 4, text: "Your profile was viewed 10 times", type: "view" },
      { id: 5, text: "New follower: John Doe", type: "follow" },
    ]
  );

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    setHoverDirection({ x, y });
  };

  const setLikeSubmit = async () => {
    try {
      var likedetailed = {
        postId: PostId,
        userId: "67c1743a237d2fe4aeb99ffd"
      }
      setLike(Like + 1)
      var res = await axios.post("http://localhost:5279/apiDashboard/InsertLike", likedetailed)

      console.log(res.data)

    }
    catch (error) {
      console.error(error);
    }

  }

  const setCommentSubmit = () => {
    setNotification(!notification);
  }


  return (
    <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-auto shadow-md">
      <motion.div
        className="relative w-full bg-white rounded-lg overflow-hidden cursor-pointer p-4 sm:p-6"
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
      >

        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => window.open(profileUrl, "_blank")}
            className="focus:outline-none"
            aria-label={`Visit ${username}'s profile`}
          >
            <img
              src={profileImage}
              alt={`${username}'s Profile`}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover hover:scale-110 transition-transform"
            />
          </button>
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-base sm:text-lg">{username}</span>
            <span className="text-gray-500 text-sm sm:text-xs">{time}</span>
          </div>
        </div>

        {imageUrl == "" ? null : <motion.img
          src={imageUrl}
          alt={PostId}
          className="w-full h-auto object-cover rounded-md"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
        />}


        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black">{title}</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">{description}</p>
        </div>


        <div className="flex items-center justify-between mt-4">
          <button
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors"
            aria-label="Like post"
            onClick={setLikeSubmit}
          >
            <ThumbsUp size={24} />
            <span>Like {Like}</span>
          </button>
          <button
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Comment on post"
            onClick={setCommentSubmit}
          >
            <MessageCircle size={24} />
            <span>Comment</span>
          </button>
        </div>

        {notification ?

          <div className=" lg:flex  p-4 bg-white shadow-md">
            <NotificationSection notifications={notifications} />
          </div>

          : ""

        }
      </motion.div>
    </div>
  );
};

export default AnimatedPostCard;
