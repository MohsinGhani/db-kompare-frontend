import { Collapse } from "antd";
import React from "react";
import MyCertificates from "./MyCertificates";

const Achievements = ({user}) => {
  const items = [
    {
      key: "1",
      label: "My Certificates",
      children: <MyCertificates user={user} />,
    },
  ];
  return (
    <div className="lg:max-w-[75%] pb-20">
      <Collapse className="custom-collapse border-none " items={items} />
    </div>
  );
};

export default Achievements;
