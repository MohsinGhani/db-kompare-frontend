import { Button } from "antd";
import React, { useState, useEffect } from "react";

const Output = ({ query }) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (query) {
      // When the query changes, assume the user is typing
      setIsTyping(true);
      // Set a timer to consider typing stopped after 1 second of inactivity
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);

      // Clear the timer if query changes again
      return () => clearTimeout(timer);
    } else {
      // No query means definitely not typing
      setIsTyping(false);
    }
  }, [query]);

  return (
    <div className="bg-[#FAFAFA] h-[30%] p-3 relative">
      <div className="flex gap-2 items-baseline absolute bottom-4 right-4">
        <Button type="dashed">Run Code</Button>
        <div className="relative">
          {isTyping ? (
            <img
              src={"/assets/icons/dog-play-g.gif"}
              alt="dog-play"
              className="mb-[-2px] h-32  object-cover absolute bottom-5"
              draggable={false}
            />
          ) : (
            <img
              src={"/assets/icons/dog-play.svg"}
              alt="dog-play"
              className="mb-[-2px] h-24 object-cover absolute bottom-8"
              draggable={false}
            />
          )}
          <Button type="primary">Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Output;
