import { useState, useEffect } from "react";
import { Card, Radio } from "antd";
import CommonTypography from "../shared/Typography";
import { fetchDbToolsCategories } from "@/utils/dbToolsUtil";

const DBToolsRankingOptions = ({ onChange, isSmallDevice = false }) => {
  const [dbToolCategories, setDbToolCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const fetchCategoriesOptions = async () => {
    try {
      const data = await fetchDbToolsCategories();
      const categories = data.data || [];

      const allOption = { id: "all", name: "All" };
      const categoriesWithAll = [allOption, ...categories];

      setDbToolCategories(categoriesWithAll);

      setSelectedOption(allOption.id);
      onChange && onChange(allOption.id);
    } catch (error) {
      console.error("Error fetching db tools categories:", error);
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    onChange && onChange(value);
  };

  useEffect(() => {
    fetchCategoriesOptions();
  }, []);

  return (
    <Card
      className={`w-full bg-white rounded-lg shadow-md ${
        isSmallDevice ? "border-none shadow-none p-0 h-full" : "p-5 "
      }`}
    >
      <CommonTypography className="font-medium text-base">
        Select category
      </CommonTypography>
      <div className="flex flex-col gap-3 mt-4 xl:mt-4">
        <Radio.Group
          onChange={handleOptionChange}
          value={selectedOption}
          className="flex flex-col gap-5"
        >
          {dbToolCategories.map((option, index) => (
            <Radio
              key={index}
              value={option.id}
              className="text-black opacity-85 text-sm"
            >
              {option.name}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </Card>
  );
};

export default DBToolsRankingOptions;
