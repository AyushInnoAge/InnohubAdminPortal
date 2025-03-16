import { PostContext } from "@/app/Components/ContextApi";
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useContext, useEffect } from "react";

const PollCard = (Post) => {
  const { id, type, title, description, totalYes, totalNo, user, created_At } = Post.Post;
    // Format date
    const timing = new Date(created_At);
    const time = `${timing.getDate()}-${
      timing.getMonth() + 1
    }-${timing.getFullYear()}`;
  const [options, setOptions] = useState([
    { label: "Yes", votes: 0, voted: false },
    { label: "No", votes: 0, voted: false },
  ]);
  const [totalyes, setTotalYes] = useState(totalYes?.length || 0);
  const [totalno, setTotalNo] = useState(totalNo?.length || 0);
  const [totalYesSet, setTotalYesSet] = useState(totalYes);
  const [totalNoSet, setTotalNoSet] = useState(totalNo);
  const [totalVotes, setTotalVotes] = useState(
    (totalYes?.length || 0) + (totalNo?.length || 0)
  );

  const { userData } = useContext(PostContext);

  //if user Already select any poll
  useEffect(() => {
    if (totalYes?.length > 0 || totalNo?.length > 0) {
      const yes = totalYes.some((item) => item.userId === userData?.userId);
      const no = totalNo.some((item) => item.userId === userData?.userId);
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.label === "Yes"
            ? { ...option, voted: yes }
            : { ...option, voted: no }
        )
      );
    }
  }, [userData, totalYes, totalNo]);

  const updatePollData = (index) => {
    if (totalYes.length > 0 || totalNo.length > 0) {
      const yes = totalYesSet.some((item) => item.userId === userData?.userId);
      const no = totalNoSet.some((item) => item.userId === userData?.userId);

      if (index == 1 && yes) {
        setTotalYes((prev) => prev - 1);
        setTotalYesSet((prev) =>
          prev.filter((item) => item.userId !== userData.userId)
        );
      }
      if (index == 0 && no) {
        setTotalNo((prev) => prev - 1);
        setTotalNoSet((prev) =>
          prev.filter((item) => item.userId !== userData.userId)
        );
      }
    }
  };

  // console.log("userData: ", userData);
  const profileImage = "https://via.placeholder.com/50";
  const username = "John Doe";
  // const title = "Select your meal March 11";

  const handleVote = async (index) => {
    if (options[index].voted) return;

    setOptions((prevOptions) =>
      prevOptions.map((option, i) => {
        if (i === index) {
          return { ...option, votes: 1, voted: true };
        }
        return { ...option, votes: 0, voted: false };
      })
    );

    //Update Yes And No Value
    if (options[index].label === "No") {
      setTotalNo((prev) => prev + 1);
      var userIdData = { userId: userData.userId };
      setTotalNoSet((prev) => [...prev, userIdData]);
      updatePollData(index);
    } else {
      var userIdData = { userId: userData.userId };
      setTotalYes((prev) => prev + 1);
      setTotalYesSet((prev) => [...prev, userIdData]);
      updatePollData(index);
    }

    //yha se value send ho gi
    const data = {
      userId: userData.userId,
      postId: id,
      voteType: index === 0 ? "Yes" : "No",
    };

    try {
      const response = await axios.patch(
        "http://localhost:5279/apiDashboard/Updatepoll",
        data
      );
    } catch (error) {
      console.error("Vote update failed: ", error);
    }
  };

  return (
    <div className="bg-white text-black rounded-lg p-4 w-full max-w-lg mx-auto shadow-lg border border-gray-300">
      <motion.div
        className="relative w-full bg-white rounded-lg overflow-hidden p-4 sm:p-6"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
      >
        {/* Profile Section */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={
              user?.Image ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${user?.Name}`
            }
            alt={`Profile`}
            className="w-10 h-10 rounded-full object-cover border border-gray-400"
          />
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-base sm:text-lg">
              {user?.Name || "Ayush"}
            </span>
            <span className="text-gray-500 text-sm sm:text-xs">{time}</span>
          </div>
        </div>

        {/* Poll Title */}
        <h2 className="text-lg font-bold text-black mb-2">{title}</h2>

        {/* Total Votes */}
        <p className="text-gray-600 text-sm mb-2">Total Yes: {totalyes}</p>
        <p className="text-gray-600 text-sm mb-2">Total No: {totalno}</p>

        {/* Poll Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleVote(index)}
            >
              <div className="w-5 h-5 border border-gray-500 rounded-full flex items-center justify-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    option.voted ? "bg-blue-500" : "bg-transparent"
                  }`}
                ></div>
              </div>
              <div className="w-full">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{option.label}</span>
                  <span>{option.voted ? "100%" : "0%"}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${option.voted ? "100%" : "0%"}` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PollCard;
