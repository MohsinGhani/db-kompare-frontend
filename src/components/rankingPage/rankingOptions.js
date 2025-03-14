import { useState } from "react";
import { Card, Radio } from "antd";
import CommonTypography from "../shared/Typography";

const RankingOptions = ({
  rankingOptions,
  onChange,
  isSmallDevice = false,
}) => {
  const [selectedOption, setSelectedOption] = useState(rankingOptions[0].value);

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    onChange && onChange(value);
  };

  return (
    <Card
      className={`w-full bg-white rounded-lg shadow-md ${
        isSmallDevice
          ? "border-none shadow-none p-0 h-full"
          : "p-5 min-h-[725px]"
      }`}
    >
      <CommonTypography className="font-medium text-base ">
        Select a ranking
      </CommonTypography>
      <div className="flex flex-col gap-3 mt-4 xl:mt-4">
        <Radio.Group
          onChange={handleOptionChange}
          value={selectedOption}
          className="flex flex-col gap-[18px]"
        >
          {rankingOptions.map((option, index) => (
            <Radio
              key={index}
              value={option.value}
              className="text-black opacity-85 text-sm"
            >
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </Card>
  );
};

export default RankingOptions;
