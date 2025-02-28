import React, { useState } from "react";

const PollBar = () => {
  const [rangeValue, setRangeValue] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = (option) => {
    setSelectedOption(option);
    setRangeValue(1);
  };

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-2xl flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-blue-500">Vote Your Opinion</h3>
      <div className="w-full flex flex-col space-y-3">
        {["Yes", "No"].map((option, index) => (
          <label
            key={index}
            className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 border  ${selectedOption === option ? "bg-blue-500 text-black border-blue-500" : "bg-gray-100 border-gray-300 text-black"
              } hover:bg-blue-100`}
          >
            <input
              type="radio"
              name="poll"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleVote(option)}
              className="hidden"
            />
            <div className="w-5 h-5 border-2 border-gray-500 rounded-full flex items-center justify-center">
              {selectedOption === option && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
            </div>
            {option}
          </label>
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
        style={{
          background: rangeValue === 1 ? "blue" : "gray",
        }}
      />
    </div>
  );
};

export default PollBar;