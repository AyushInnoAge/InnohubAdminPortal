import React, { useState } from "react";
 
const PollBar = () => {
  const [rangeValue, setRangeValue] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
 
  const handleVote = (option) => {
    console.log(option);
    setSelectedOption(option);
    setRangeValue(1);
    setIsDisable(true);
    setTotalVotes((prevVotes) => prevVotes + 1);
  };
 
  return (
    <div className="w-full p-4 bg-white shadow-md rounded-2xl flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-blue-500">Vote Your Opinion</h3>
      <div className="w-full flex gap-3">
        {["Yes", "No"].map((option, index) => (
          <button
            key={index}
            disabled={isDisable}
            className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
              selectedOption === option
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-black border-gray-300"
            } hover:bg-blue-100`}
            onClick={() => handleVote(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <input
        type="range"
        value={rangeValue}
        onClick={() => setRangeValue(1)}
        min={0}
        max={1}
        step={1}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        style={{ background: rangeValue === 1 ? "blue" : "gray" }}
      />
      <div className="text-gray-600 font-semibold">Total Votes: {totalVotes}</div>
    </div>
  );
};
 
export default PollBar;
