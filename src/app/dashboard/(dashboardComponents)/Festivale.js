import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import CommentBox from "./CommentSection";
import { PostContext } from "@/app/Components/ContextApi";
import axios from "axios";

const balloonVariants = {
  initial: { y: 300, opacity: 0 },
  animate: {
    y: -300,
    opacity: 1,
    transition: {
      duration: 3,
      ease: "easeOut",
      repeat: Infinity,
      repeatType: "mirror",
    },
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

const FestivalCard = ({
  PostId,
  PostUser,
  PostImageUrl,
  PostLike,
  PostComment,
  PostType,
  PostTitle,
  PostDescription,
  Postcreated_At,
}) => {
  const [Like, setLike] = useState(PostLike?.[0]?.likes || []);
  const [commentValue, setCommentValue] = useState("");
  const [commentsDisplay, setCommentsDisplay] = useState(PostComment);
  const [comments, setComments] = useState(false);
  const [likeButtonDisable, setLikeButtonDisable] = useState(false);
  const { userData } = useContext(PostContext);
  useEffect(() => {
    if (Like.length !== 0) {
      setLikeButtonDisable(Like.includes(userData.userId));
    }
  }, [Like, userData.userId]);

  // Submit Like Button
  const setLikeSubmit = async () => {
    try {
      setLikeButtonDisable(true);
      const likedData = { postId: PostId, userId: userData.userId };
      console.log(likedData);
      await axios.post(
        "http://localhost:5279/apiDashboard/InsertLike",
        likedData
      );
      setLike((prev) => [...prev, userData.userId]);
    } catch (error) {
      console.error(error);
    }
  };

  // Submit Comment Button
  const setCommentSubmit = async () => {
    if (!commentValue.trim()) return;
    try {
      var ImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userData.Name}`;

      const commentData = {
        postId: PostId,
        comment: commentValue,
        userId: userData.Name || "Ayush",
        imageUrl: ImageUrl,
      };
      await axios.post(
        "http://localhost:5279/apiDashboard/commentAdd",
        commentData
      );
      setCommentsDisplay((prev = []) => [commentData, ...prev]);
      setCommentValue(""); // Clear input after submission
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative bg-white rounded-lg p-4 w-full max-w-lg mx-auto shadow-md overflow-hidden">
      <motion.div
        className="absolute top-0 left-10"
        variants={balloonVariants}
        initial="initial"
        animate="animate"
      >
        {/* {festivalIcon} */}
      </motion.div>
      <motion.div
        className="absolute top-0 right-10"
        variants={balloonVariants}
        initial="initial"
        animate="animate"
      >
        {/* {festivalIcon} */}
      </motion.div>
      <motion.div
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-yellow-400"
        variants={sparkVariants}
        initial="initial"
        animate="animate"
      >
        ✨
      </motion.div>

      {PostImageUrl && (
        <img src={PostImageUrl} alt="Post" className="w-full rounded-md" />
      )}
      <h2 className="text-xl font-bold mt-2 text-black">{PostTitle}</h2>
      <p className="text-black">{PostDescription}</p>

      <div className="flex items-center justify-between mt-4">
        <button
          className={`flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors ${
            likeButtonDisable && "cursor-not-allowed opacity-50"
          }`}
          disabled={likeButtonDisable}
          onClick={setLikeSubmit}
        >
          <ThumbsUp size={24} />
          <span>Like {Like.length}</span>
        </button>
        <button
          className="flex items-center space-x-2 text-gray-500"
          onClick={() => setComments(!comments)}
        >
          <MessageCircle size={24} />
          <span>Comment</span>
        </button>
      </div>

      {comments && (
        <div className="p-4 bg-white shadow-md">
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
              onClick={setCommentSubmit}
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

export default FestivalCard;
