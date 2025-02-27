import { useState } from "react";
import { Image, X, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";


const PostInput = ({ profileUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [value, setValue] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPostText("");
    setImage(null);
    setShowEmojiPicker(false);
  };

  const openPollModal = () => setIsPollModalOpen(true);
  const closePollModal = () => {
    setIsPollModalOpen(false);
    setValue("");
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("Post saved:", postText);
    closeModal();
  };

  const handelSavePost=()=>{
    console.log("Poll Saved: ", value);
    closePollModal();
  }

  const handleEmojiClick = (emojiObject) => {
    setPostText((prev) => prev + emojiObject.emoji);


    //DataSend to the backend I Not used this function as a resuable component because i face some issue in the in frontend and state managment












  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-lg mx-auto">
      {/* Profile Image & Input */}
      <div className="flex items-center space-x-4">
        <button onClick={() => window.open(profileUrl, "_blank")}>
          <img
            src={profileUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </button>
        <input
          type="text"
          placeholder="Start a post"
          className="w-full border rounded-full px-4 py-2 focus:outline-none cursor-pointer"
          onClick={openModal}
          readOnly
        />
      </div>

      {/* Media Upload Button */}
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={openModal}
          className="flex items-center space-x-2 text-blue-500"
        >
          <Image size={20} />
          <span>Media</span>
        </button>
        <button
          onClick={openPollModal}
          className="flex items-center space-x-2 text-blue-500"
        >
          <Image size={20} />
          <span>Poll</span>
        </button>
      </div>



      {/* Modal with Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-all"
              >
                <X size={24} />
              </button>

              {/* Modal Header */}
              <h2 className="text-lg font-semibold text-center text-black">
                Create Post
              </h2>

              {/* Input Field */}
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full mt-4 p-2 border rounded-lg resize-none text-black"
              />

              {/* Emoji Picker Button */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center space-x-2 text-yellow-500 mt-2"
              >
                <Smile size={20} />
                <span>Emoji</span>
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute mt-2 z-50">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              {/* Image Preview */}
              {image && (
                <div className="mt-4">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full rounded-lg max-h-40 object-cover"
                  />
                </div>
              )}

              {/* Media Upload */}
              <label className="flex items-center space-x-2 cursor-pointer text-blue-500 mt-4">
                <Image size={20} />
                <span>Upload Image</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              {/* Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleSave}
                  disabled={!postText && !image}
                  className={`px-4 py-2 rounded-lg w-full ${!postText && !image
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-blue-500 text-white"
                    }`}
                >
                  Post
                </button>
                <button
                  onClick={closeModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>



      {/* for PollInput */}

      <AnimatePresence>
        {isPollModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={closePollModal}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-all"
              >
                <X size={24} />
              </button>

              {/* Modal Header */}
              <h2 className="text-lg font-semibold text-center text-black">
                Create Polls and Surveys:
              </h2>

              {/* PollBarInput */}
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
                placeholder="Query"
              />

              {/* Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handelSavePost}
                  disabled={!value}
                  className={`px-4 py-2 rounded-lg w-full ${(!value)
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-blue-500 text-white"
                    }`}
                >
                  Post
                </button>
                <button
                  onClick={closePollModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>





    </div>
  );
};

export default PostInput;
