import { motion } from "framer-motion";
import { useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";

const balloonVariants = {
  initial: { y: 300, opacity: 0 },
  animate: {
    y: -300,
    opacity: 1,
    transition: { duration: 3, ease: "easeOut", repeat: Infinity, repeatType: "mirror" },
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
  const [commentsDisplay, setCommentsDisplay] = useState([]);
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

  const handleLike = () => setLike(Like + 1);
  const handleCommentSubmit = () => {
    if (!commentValue.trim()) return;
    setCommentsDisplay([...commentsDisplay, commentValue]);
    setCommentValue("");
  };

  return (
    <div className="relative bg-white rounded-lg p-4 w-full max-w-lg mx-auto shadow-md overflow-hidden">
      <motion.div className="absolute top-0 left-10" variants={balloonVariants} initial="initial" animate="animate">🎈</motion.div>
      <motion.div className="absolute top-0 right-10" variants={balloonVariants} initial="initial" animate="animate">🎈</motion.div>
      <motion.div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-yellow-400" variants={sparkVariants} initial="initial" animate="animate">✨</motion.div>
      
      <div className="flex items-center space-x-4 mb-4">
        <img src={postData.profileImage} alt="Profile" className="w-12 h-12 rounded-full" />
        <div>
          <span className="font-semibold">{postData.username}</span>
          <span className="text-gray-500 text-sm block">{postData.date}</span>
        </div>
      </div>

      {postData.imageUrl && <img src={postData.imageUrl} alt="Post" className="w-full rounded-md" />}
      <h2 className="text-xl font-bold mt-2">{postData.title}</h2>
      <p className="text-gray-600">{postData.description}</p>

      <div className="flex items-center justify-between mt-4">
        <button className="flex items-center space-x-2 text-blue-500" onClick={handleLike}>
          <ThumbsUp size={24} />
          <span>Like {Like}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500" onClick={() => setComment(!comment)}>
          <MessageCircle size={24} />
          <span>Comment</span>
        </button>
      </div>

      {comment && (
        <div className="p-4 bg-white shadow-md mt-2">
          <input
            type="text"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Write a comment..."
          />
          <button className="bg-blue-500 text-white px-3 py-2 mt-2" onClick={handleCommentSubmit}>Submit</button>
          <div className="mt-2">
            {commentsDisplay.map((c, index) => (
              <p key={index} className="text-gray-700">{c}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayCard;
