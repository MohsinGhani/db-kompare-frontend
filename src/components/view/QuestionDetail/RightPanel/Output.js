import { Button } from "antd";
import React from "react";

const Output = () => {
  return (
    <div className="bg-[#FAFAFA] h-[20%] p-3 relative">
      <div className="flex gap-2 items-baseline absolute bottom-4 right-4">
        <Button type="dashed">Run Code</Button>
        <div>
          <img
            src="/assets/icons/dog-play.svg"
            alt="dog-play"
            className="mb-[-2px]"
            draggable={false}
          />
          <Button type="primary">Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Output;
