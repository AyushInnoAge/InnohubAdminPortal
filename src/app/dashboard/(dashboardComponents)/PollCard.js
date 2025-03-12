import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

const PollCard = (




) => {

  //ForYes []
  //ForNo []
  //UserDetailed
  //total Votes

  //cheak userId avilable in this array or not 
  //if user Exist in array
  //in Yes option[index].votes=1 and voted = true;



  const [options, setOptions] = useState([
    { label: "Yes", votes: 0, voted: false },
    { label: "No", votes: 0, voted: false },
  ]);


  const [totalVotes, setTotalVotes] = useState(0);   //inserted totalvote hear

  const profileImage = "https://via.placeholder.com/50";
  const username = "John Doe";
  const title = "Select your meal March 11";

  const handleVote = async (index) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, i) => {
        if (i === index) {
          return { ...option, votes: 1, voted: true };
        }
        return { ...option, votes: 0, voted: false };
      })
    );
    setTotalVotes(1); //totalvote+1 for not multiple yes or no

    //yha se value send ho gi
    var choise = index == 0 ? "Yes" : "No";
    var data = {
      userId: "67c1607873717960836f0826",
      postId: "67d127930778018e1002132a",
      voteType: choise
    }
    axios.patch("http://localhost:5279/apiDashboard/Updatepoll", data);
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
            src={profileImage}
            alt={`${username}'s Profile`}
            className="w-10 h-10 rounded-full object-cover border border-gray-400"
          />
          <span className="text-gray-700 font-semibold text-sm">{username}</span>
        </div>

        {/* Poll Title */}
        <h2 className="text-lg font-bold text-black mb-2">{title}</h2>

        {/* Total Votes */}
        <p className="text-gray-600 text-sm mb-2">Total Votes: {totalVotes}</p>

        {/* Poll Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 cursor-pointer" onClick={() => handleVote(index)}>
              <div className="w-5 h-5 border border-gray-500 rounded-full flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${option.voted ? "bg-blue-500" : "bg-transparent"}`}></div>
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