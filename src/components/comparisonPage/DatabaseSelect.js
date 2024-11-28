import React from "react";
import CommonButton from "@/components/shared/Button";
import CommonTypography from "@/components/shared/Typography";
import CustomSelect from "@/components/shared/CustomSelect";

const DatabaseSelect = ({
  dbData,
  selectedDatabases,
  selectedDatabasesOptions,
  setSelectedDatabasesOptions,
  handleCompareClick,
}) => {
  return (
    <div className="flex 2xl:flex-row gap-4 flex-col justify-between w-full">
      <CommonTypography type="text" classes="md:text-4xl text-2xl font-medium">
        Editorial information provided by DB-Kompare
      </CommonTypography>

      <div className="flex flex-col md:flex-row md:gap-0 gap-3">
        <CustomSelect
          value={selectedDatabasesOptions}
          onChange={(selectedValues) =>
            setSelectedDatabasesOptions(selectedValues)
          }
          options={dbData.map((db) => ({
            id: db.id,
            label: db.name,
            value: db.name,
          }))}
          placeholder="Select Database"
          maxSelection={4}
          className="2xl:w-[550px] w-full lg:w-full md:h-[47px] h-auto"
        />

        <CommonButton
          disabled={
            selectedDatabases?.length > 4 ||
            selectedDatabasesOptions?.length === 0
          }
          style={{
            borderRadius: "0px 4px 4px 0px",
            height: "45px",
            background:
              selectedDatabases?.length > 4 ||
              selectedDatabasesOptions?.length === 0
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

export default DatabaseSelect;
