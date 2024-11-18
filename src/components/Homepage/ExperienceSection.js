import React from "react";

const ExperienceSection = () => {
  const experienceData = [
    { years: "8+", label: "Years of experience" },
    { years: "8+", label: "Years of experience" },
    { years: "8+", label: "Years of experience" },
  ];

  return (
    <div className="bg-[#3E53D7] rounded-lg shadow-md px-24 py-11 w-full">
      <div className="flex justify-between items-center mt-8">
        {experienceData.map((item, index) => (
          <div
            key={index}
            className={`p-4 flex-1 text-center ${
              index === 0 ? "" : "border-l border-[#E4E4E7]"
            } ${index === experienceData.length - 1 ? "" : "border-r"}`}
          >
            <h3 className="text-white text-6xl font-bold mb-2">{item.years}</h3>
            <p className="text-white text-2xl">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
