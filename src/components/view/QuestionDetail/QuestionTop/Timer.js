import { PauseOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";

const Timer = ({ time, setTime }) => {
  const [running, setRunning] = useState(false);

  // Run the timer if `running` is true
  useEffect(() => {
    let intervalId;
    if (running) {
      intervalId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [running]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Toggle play/pause
  const handlePlayPause = () => {
    setRunning((prevRunning) => !prevRunning);
  };

  // Stop and reset timer
  const handleStop = () => {
    setRunning(false);
    setTime(0);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Play/Pause Toggle Button */}
      <button
        onClick={handlePlayPause}
        className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center"
      >
        {running ? (
          /* If running, show the Pause icon */
          <PauseOutlined />
        ) : (
          /* If not running, show the Play icon */
          <img src="/assets/icons/play.svg" alt="Play" />
        )}
      </button>

      {/* Timer Display */}
      <span className="text-xl">{formatTime(time)}</span>

      {/* Stop Button */}
      <button
        onClick={handleStop}
        className="w-10 h-10 rounded-md bg-red-500 text-white flex items-center justify-center"
      >
        <img src="/assets/icons/stop-circle.svg" alt="Stop" className="h-7" />
      </button>
    </div>
  );
};

export default Timer;
