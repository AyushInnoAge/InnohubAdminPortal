import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { ThumbsUp, MessageCircle, Award, Star } from "lucide-react";
import axios from "axios";
import { PostContext } from "@/app/Components/ContextApi";
import CommentBox from "@/app/dashboard/(dashboardComponents)/CommentSection";

const AppreciationCard = ({
    profileImage = "https://via.placeholder.com/150",
    username = "John Doe",
    profileUrl = "#",
    title = "Employee of the Month",
    message = "Congratulations on your outstanding performance and dedication!",
    imageUrl = "https://img.freepik.com/free-vector/employee-month-award-theme_23-2148458399.jpg?t=st=1741774588~exp=1741778188~hmac=3c44734e5aa403a898031893ddfea6b86566fa58acf20d3ae8fd3a5f6203a818&w=740",
    PostId = "12345",
    like = ["user1", "user2"],
    date = new Date().toISOString(),
    badge = "Top Performer",
    commentDatas = [
        { userId: "Jane Smith", comment: "Well deserved!", imageUrl: "https://via.placeholder.com/50" },
        { userId: "Mike Johnson", comment: "Congrats!", imageUrl: "https://via.placeholder.com/50" }
    ]
}) => {

    const [Like, setLike] = useState(like);
    const [commentsDisplay, setCommentsDisplay] = useState(commentDatas);
    const [commentValue, setCommentValue] = useState("");
    const [comment, setComment] = useState(false);
    const [likeButtonDisable, setLikeButtonDisable] = useState(true);

    const timing = new Date(date);
    const time = `${timing.getDate()}-${timing.getMonth() + 1}-${timing.getFullYear()}`;


    // Submit Like Button
    const setLikeSubmit = async () => {
        try {
            setLikeButtonDisable(true);
            const likedData = { postId: PostId, userId: userData.userId };

            await axios.post("http://localhost:5279/apiDashboard/InsertLike", likedData);
            setLike((prev) => [...prev, userData.userId]);
        } catch (error) {
            console.error(error);
        }
    };

    // Submit Comment Button
    const setCommentSubmit = async () => {
        if (!commentValue.trim()) return;
        try {


            var ImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userData.Name}`

            const commentData = {
                postId: PostId,
                comment: commentValue,
                userId: userData.Name,
                imageUrl: ImageUrl
            };
            await axios.post("http://localhost:5279/apiDashboard/commentAdd", commentData);
            setCommentsDisplay((prev) => [commentData, ...prev]);
            setCommentValue(""); // Clear input after submission

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg border border-gray-300"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 160, damping: 10 }}
        >
            <div className="flex items-center space-x-4 mb-4">

                {badge && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="ml-auto flex items-center bg-yellow-400 text-gray-900 px-3 py-1 rounded-full shadow-md">
                        <Award size={18} className="mr-1" /> {badge}
                    </motion.div>
                )}
            </div>

            {imageUrl && (
                <motion.img src={imageUrl} alt={PostId} className="w-full h-auto object-cover rounded-md shadow-md" initial={{ scale: 1 }} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 150, damping: 10 }} />
            )}

            <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-700 mt-2 text-base">{message}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
                <button className="flex items-center space-x-2 text-blue-500"
                    disabled={likeButtonDisable}
                    onClick={setLikeSubmit}>
                    <ThumbsUp size={24} />
                    <span>Like {Like.length}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500" onClick={() => setComment(!comment)}>
                    <MessageCircle size={24} />
                    <span>Comment</span>
                </button>
            </div>

            {comment && (
                <div className="p-4 bg-gray-100 shadow-md mt-4 rounded-md">
                    <div className="flex items-center border rounded-md overflow-hidden">
                        <input type="text" value={commentValue} onChange={(e) => setCommentValue(e.target.value)} className="w-full p-2 outline-none text-black bg-white" placeholder="Write a comment..." />
                        <button className="bg-gray-600 text-white px-3 py-2 text-sm hover:bg-gray-800 transition" onClick={setCommentSubmit}>Send</button>
                    </div>
                    <CommentBox comments={commentsDisplay} />
                </div>
            )}
        </motion.div>
    );
};

export default AppreciationCard;