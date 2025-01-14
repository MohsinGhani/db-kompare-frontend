import React from "react";
import CommonButton from "@/components/shared/Button";
import CommonTypography from "@/components/shared/Typography";
import CustomSelect from "@/components/shared/CustomSelect";

const ToolSelect = ({
  dbToolChilds,
  selectedTools,
  selectedToolsOptions,
  setSelectedToolsOptions,
  handleCompareClick,
}) => {
  return (
    <div className="flex 2xl:flex-row gap-4 flex-col justify-between w-full">
      <CommonTypography type="text" classes="md:text-4xl text-2xl font-medium">
        Database Tools
      </CommonTypography>

      <div className="flex flex-col md:flex-row md:gap-0 gap-3">
        <CustomSelect
          value={selectedToolsOptions}
          onChange={(selectedValues) => setSelectedToolsOptions(selectedValues)}
          options={dbToolChilds?.map((db) => ({
            id: db.id,
            label: db.name,
            value: db.value,
          }))}
          placeholder="Select tools"
          maxSelection={4}
          className="2xl:w-[620px] w-full lg:w-full md:h-[47px] h-auto custom-select"
        />

        <CommonButton
          disabled={
            selectedTools?.length > 4 || selectedToolsOptions?.length === 0
          }
          style={{
            borderRadius: "0px 4px 4px 0px",
            height: "47px",
            background:
              selectedTools?.length > 4 || selectedToolsOptions?.length === 0
                ? "grey"
                : "#3E53D7",
            border: "none",
            color: "white",
          }}
          onClick={handleCompareClick}
        >
          Compare
        </CommonButton>
      </div>
    </div>
  );
};

export default ToolSelect;
