import { Button } from "antd";
import React from "react";

const InviteFriends = () => {
  return (
    <div className="bg-[#F8F9FD] p-4  rounded-2xl">
      <p className="font-bold text-lg">Invite & Earn Rewards</p>
      <p className="font-normal text-[#565758] text-sm">
        Share with friends and enjoy exclusive perks!
      </p>
      <Button block type="primary" className="mt-3">
        Invite a Friend
      </Button>
    </div>
  );
};

export default InviteFriends;
