import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { ThumbsUp, MessageCircle, Award, Star } from "lucide-react";
import CommentBox from "@/app/dashboard/(dashboardComponents)/CommentSection";
import { AuthContext } from "@/context/AuthContext";
import { CommentAdd, LikeSubmite } from "@/_api_/dashboard";

const AppreciationCard = ({
  PostId,
  PostLike,
  PostComment,
  PostType,
  PostDescription,
  Postcreated_At,
  NominatedUser,
  NominatedBy
}) => {
  const { user } = useContext(AuthContext);
  const badge = PostType;
  const [Like, setLike] = useState(PostLike);
  const [commentsDisplay, setCommentsDisplay] = useState(PostComment);
  const [commentValue, setCommentValue] = useState("");
  const [comment, setComment] = useState(false);
  const [likeButtonDisable, setLikeButtonDisable] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [PostImageUrl, setPostImageUrl] = useState("");

  const timing = new Date(Postcreated_At);
  const time = `${timing.getDate()}-${timing.getMonth() + 1
    }-${timing.getFullYear()}`;

  const words = PostDescription.split(" ");
  const shouldTruncate = words.length > 20;
  const displayedText = expanded
    ? PostDescription
    : words.slice(0, 20).join(" ") + (shouldTruncate ? "..." : "");

  //set image
  useEffect(() => {
    if (PostType == "Star of the month") {
      setPostImageUrl(
        "https://res.cloudinary.com/de4oinuvo/image/upload/v1742135213/InnoAge/wakumrf9xf3rwqd67lpq.jpg"
      );
    } else if (PostType == "Best team") {
      setPostImageUrl(
        "https://res.cloudinary.com/de4oinuvo/image/upload/v1742135544/InnoAge/fmclsh5h3ozirgue2pe1.jpg"
      );
    } else if (PostType == "Best leader") {
      setPostImageUrl(
        "https://res.cloudinary.com/de4oinuvo/image/upload/v1742136549/InnoAge/r6yjgbno5enhhngduq3a.webp"
      );
    } else {
      setPostImageUrl(
        "https://res.cloudinary.com/de4oinuvo/image/upload/v1742137065/InnoAge/elariszsyxugq2ns8ymn.webp"
      );
    }
  }, [PostType]);


  useEffect(() => {
    if (Like.length !== 0) {
      setLikeButtonDisable(Like.some((like) => like.userId == user.id));
    }
  }, []);

  // Submit Like Button
  const setLikeSubmit = async () => {
    try {
      setLikeButtonDisable(true);
      const likedData = { postId: PostId, userId: user.id };


      await LikeSubmite(likedData);

      setLike((prev = []) => [...prev, user.id]);
    } catch (error) {
      console.error(error);
    }
  };


  const setCommentSubmit = async () => {
    if (!commentValue.trim()) return;
    try {

      const commentData = {
        postId: PostId,
        commentMessage: commentValue,
        userName: user.name,
      };

      await CommentAdd(commentData);
      setCommentsDisplay((prev = []) => [commentData, ...prev]);
      setCommentValue("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg p-6 w-full max-w-[42rem] mx-auto shadow-lg border border-gray-300"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 160, damping: 10 }}
    >
      <div className="flex items-center space-x-4 mb-4">
        {badge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="ml-auto flex items-center bg-yellow-400 text-gray-900 px-3 py-1 rounded-full shadow-md"
          >
            <Award size={18} className="mr-1" /> {badge}
          </motion.div>
        )}
      </div>

      {PostImageUrl && (
        <motion.img
          src={PostImageUrl}
          alt="img"
          className="w-full h-auto object-cover rounded-md shadow-md"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
        />
      )}

      <div className="p-4">
        <h2 className="text-xl font-medium text-black">{displayedText} {shouldTruncate && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-blue-400  "
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "View Less" : "View More"}
          </motion.button>
        )}</h2>
        <p className="text-black text-base font-extrabold mt-2">{`${PostType} goes to ${NominatedUser} present by ${NominatedBy}`}</p>
        
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          className={`flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors ${likeButtonDisable && "cursor-not-allowed opacity-50"
            }`}
          disabled={likeButtonDisable}
          onClick={setLikeSubmit}
        >
          <ThumbsUp size={30} />
          <span>Like {Like.length}</span>
        </button>
        <button
          className="flex items-center space-x-2 text-gray-500"
          onClick={() => setComment(!comment)}
        >
          <MessageCircle size={30} />
          <span>Comment</span>
        </button>
      </div>

      {comment && (
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
    </motion.div>
  );
};

export default AppreciationCard;
