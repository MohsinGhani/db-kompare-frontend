import { useState } from "react";
import { Card } from "antd";
import CommonTypography from "../shared/Typography";

const RankingOptions = ({ rankingOptions, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(rankingOptions[0].value);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    onChange && onChange(value);
  };

  return (
    <Card className="w-full bg-white rounded-lg shadow-md p-5 max-w-[250px]">
      <CommonTypography className="font-medium text-base">
        Select a ranking
      </CommonTypography>
      <div className="flex flex-col gap-2 mt-3">
        {rankingOptions.map((option, index) => (
          <CommonTypography
            key={index}
            className="flex items-center gap-1 sm:gap-3 cursor-pointer text-gray-800 text-[9px] sm:text-sm"
          >
            <input
              type="radio"
              name="rankingOption"
              value={option.value}
              checked={selectedOption === option.value}
              onChange={() => handleOptionChange(option.value)}
              className="cursor-pointer w-2 sm:w-4"
            />
            {option.label}
          </CommonTypography>
        ))}
      </div>
    </Card>
  );
};

export default RankingOptions;
