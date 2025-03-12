import { motion } from "framer-motion";
import { useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import CommentBox from "./CommentSection";

const balloonVariants = {
  initial: { y: 300, opacity: 0 },
  animate: {
    y: -300,
    opacity: 1,
    transition: { duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
  },
};

const sparkVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: [0, 1, 0],
    scale: [0.5, 1.5, 0.5],
    transition: { duration: 1.5, repeat: Infinity },
  },
};

const BirthdayCard = () => {
  const [Like, setLike] = useState(0);
  const [commentValue, setCommentValue] = useState("");
  const [commentsDisplay, setCommentsDisplay] = useState([
    { userId: "Jane Smith", comment: "Well deserved!", imageUrl: "https://via.placeholder.com/50" },
    { userId: "Mike Johnson", comment: "Congrats!", imageUrl: "https://via.placeholder.com/50" }
  ]);
  const [likeButtonDisable, setLikeButtonDisable] = useState(false);
  const [comment, setComment] = useState(false);

  const postData = {
    profileImage: "https://via.placeholder.com/50",
    username: "John Doe",
    profileUrl: "#",
    title: "Happy Birthday! 🎂🎉",
    description: "Wishing you a fantastic day filled with joy and happiness!",
    imageUrl: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmlydGhkYXl8ZW58MHx8MHx8fDA%3D",
    date: "11-03-2025",
  };

  return (
    <div className="relative bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-xl overflow-hidden border-2 border-gray-200">
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className={`absolute top-${i * 10} left-${(i % 2) * 20} text-red-400 text-6xl`} variants={balloonVariants} initial="initial" animate="animate">🎈</motion.div>
      ))}

      <motion.div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-yellow-400 text-4xl" variants={sparkVariants} initial="initial" animate="animate">✨</motion.div>
      <motion.img
        src={postData.imageUrl}
        alt="Post"
        className="w-full rounded-lg shadow-lg border-4 border-gray-300"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
      />
      <h2 className="text-2xl font-extrabold text-gray-900 text-center mt-4">{postData.title}</h2>
      <p className="text-gray-600 text-center mt-2 font-medium">{postData.description}</p>

      <div className="flex items-center justify-between mt-4">
        <button className="flex items-center space-x-2 text-blue-500 disabled:opacity-50" 
          disabled={likeButtonDisable} onClick={() => setLike(Like + 1)}>
          <ThumbsUp size={24} />
          <span>Like {Like}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500" onClick={() => setComment(!comment)}>
          <MessageCircle size={24} />
          <span>Comment</span>
        </button>
      </div>

      {comment && (
        <div className="p-4 bg-white shadow-md mt-4 w-full">
          <div className="flex items-center border rounded-md overflow-hidden">
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              className="w-full p-2 outline-none text-black"
              placeholder="Write a comment..."
            />
            <button
              className="bg-blue-500 text-white px-3 py-2 text-sm hover:bg-blue-600 transition"
              onClick={() => {
                setCommentsDisplay([...commentsDisplay, { userId: "You", comment: commentValue, imageUrl: "https://via.placeholder.com/50" }]);
                setCommentValue("");
              }}
            >
              Submit
            </button>
          </div>
          <CommentBox comments={commentsDisplay} />
        </div>
      )}
    </div>
  );
};

export default BirthdayCard;