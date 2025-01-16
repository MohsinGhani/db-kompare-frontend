"use client";

import { Card, Radio, Checkbox, Tooltip } from "antd";
import React, { useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import CommonTypography from "../Typography";
import { filterOptions } from "@/utils/const";

const FiltersComponent = ({
  isSmallDevice = false,
  selectedFilters,
  onChange,
  disabled,
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleFilterChange = (category, value) => {
    if (onChange && typeof onChange === "function") {
      onChange(category, value);
    }
  };

  const filterTooltips = {
    AccessControl: "Roles and privileges to different users of the tool",
    VersionControl:
      "Artifact created in the tool can be version controlled (at next level calculation)",
    SupportForWorkflow:
      "Support peer review / approval / project next level calculation",
    WebAccess: "Access the tool in browser / mobile / thick client install",
    DeploymentOption: "How to deploy the tool",
    FreeCommunityEdition: "Which option is legally feasible",
    AuthenticationProtocolSupported:
      "Authentication protocol which can be used to access this tool's features",
    IntegrationWithUpstream:
      "API integration to use tool's features using Rest API, gRPC, or GraphQL",
    UserCreatedTags:
      "Users of the tool can use tags to collaborate with other users in a crowd source manner",
    CustomizationPossible: "Add new features to the tool using Python or Java",
    ModernWaysOfDeployment: "Modern methods like Kubernetes or Docker support",
  };

  const checkboxFilters = [
    "FreeCommunityEdition",
    "AuthenticationProtocolSupported",
    "IntegrationWithUpstream",
  ];

  const allCategories = Object.keys(filterOptions);
  let categoriesToDisplay;

  if (!expanded) {
    const index = allCategories.indexOf("DeploymentOption");
    categoriesToDisplay = allCategories.slice(0, index + 1);
  } else {
    categoriesToDisplay = allCategories;
  }

  return (
    <Card
      className={`w-full bg-white rounded-xl border shadow-md min-h-[350px] ${
        isSmallDevice
          ? "border-none shadow-none p-0 h-full"
          : "p-5 min-h-[725px]"
      }`}
    >
      <div className="flex flex-col gap-4">
        {categoriesToDisplay.map((category, index) => (
          <div key={index}>
            <div className="flex items-center gap-2">
              <CommonTypography className="font-medium text-base capitalize">
                {category.replace(/([A-Z])/g, " $1")}:{" "}
              </CommonTypography>
              <Tooltip title={filterTooltips[category]}>
                <InfoCircleOutlined className="text-gray-500 cursor-pointer" />
              </Tooltip>
            </div>

            {checkboxFilters.includes(category) ? (
              <Checkbox.Group
                value={selectedFilters[category]}
                onChange={(checkedValues) =>
                  handleFilterChange(category, checkedValues)
                }
                className="flex flex-col gap-2 mt-1"
                disabled={disabled}
              >
                {filterOptions[category].map((option, optionIndex) => (
                  <Checkbox
                    key={optionIndex}
                    value={option.value}
                    className="text-black opacity-85 text-sm mt-1"
                  >
                    {option.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            ) : (
              <Radio.Group
                value={selectedFilters[category]}
                onChange={(e) => handleFilterChange(category, e.target.value)}
                className="flex flex-col gap-2 mt-1"
                disabled={disabled}
              >
                {filterOptions[category].map((option, optionIndex) => (
                  <Radio
                    key={optionIndex}
                    value={option.value}
                    className="text-black opacity-85 text-sm mt-1"
                  >
                    {option.label}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 mb-4 lg:mb-0">
        <CommonTypography
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[#3e53e7] hover:underline cursor-pointer"
        >
          {expanded ? "Show less filters" : "Show more filters"}
        </CommonTypography>
      </div>
    </Card>
  );
};

export default FiltersComponent;
