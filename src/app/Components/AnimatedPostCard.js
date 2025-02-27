import { motion } from "framer-motion";
import { useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";

const AnimatedPostCard = ({ 
  profileImage, 
  username, 
  profileUrl, 
  title, 
  description, 
  imageUrl 
}) => {
  const [hoverDirection, setHoverDirection] = useState({ x: 0, y: 0 });
  const [Like, setLike] = useState(0);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    setHoverDirection({ x, y });
  };

  return (
    <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-auto shadow-md">
      <motion.div
        className="relative w-full bg-white rounded-lg overflow-hidden cursor-pointer p-4 sm:p-6"
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
      >
        {/* Profile Section */}
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
          <span className="text-gray-800 font-semibold text-base sm:text-lg">{username}</span>
        </div>

        {/* Image Section */}
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full h-auto object-cover rounded-md"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
        />

        {/* Post Content */}
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black">{title}</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">{description}</p>
        </div>

        {/* Like & Comment Section */}
        <div className="flex items-center justify-between mt-4">
          <button 
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors"
            aria-label="Like post"
            onClick={()=>setLike(Like+1)}
          >
            <ThumbsUp size={24} />
            <span>Like {Like}</span>
          </button>
          <button 
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Comment on post"
          >
            <MessageCircle size={24} />
            <span>Comment</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedPostCard;
