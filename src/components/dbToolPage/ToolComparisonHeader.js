import React from "react";

const ToolComparisonHeader = ({ selectedTools }) => {
  return (
    <div className="flex justify-center items-center h-full text-black md:pt-32">
      <div className="my-20 flex gap-7 justify-center text-center flex-col items-center w-4/6">
        <h1 className="md:text-5xl text-2xl text-center justify-center font-bold flex flex-wrap">
          {selectedTools?.length === 1
            ? `${selectedTools[0]} Properties`
            : selectedTools?.map((db, index) => (
                <span key={index} className="flex items-center">
                  {db}
                  {index < selectedTools?.length - 1 && (
                    <span className="text-primary px-2 mx-1">VS</span>
                  )}
                </span>
              ))}
        </h1>
      </div>
    </div>
  );
};

export default ToolComparisonHeader;
