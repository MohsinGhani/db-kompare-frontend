import React from "react";

const CommonLoader = () => {
  return (
    <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 ">
      <img
        src={"/assets/icons/Animation-loader.gif"}
        alt="logo"
        width={100}
        height={100}
      />
    </div>
  );
};

export default CommonLoader;
