import React from "react";
import ProgressChart from "./ProgressChart";
import Tags from "./Tags";
import InviteFriends from "./InviteFriends";

const LeftPanel = () => {
  return (
    <div className="border flex flex-col gap-6 rounded-xl h-full p-6">
      <ProgressChart />
      <InviteFriends />
      <Tags />
    </div>
  );
};

export default LeftPanel;
