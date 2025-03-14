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

      <div className="flex flex-col md:flex-row md:gap-0 gap-3 items-stretch ">
        <CustomSelect
          value={selectedDatabasesOptions}
          onChange={(selectedValues) =>
            setSelectedDatabasesOptions(selectedValues)
          }
          options={dbData
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((db) => ({
              id: db.id,
              label: db.name,
              value: db.name,
            }))}
          placeholder="Select Database"
          maxSelection={9}
          className="2xl:w-[620px] w-full lg:w-full custom-select"
        />

        <CommonButton
          disabled={
            selectedDatabases?.length > 9 ||
            selectedDatabasesOptions?.length === 0
          }
          style={{
            borderRadius: "0px 4px 4px 0px",
            background:
              selectedDatabases?.length > 9 ||
              selectedDatabasesOptions?.length === 0
                ? "grey"
                : "#3E53D7",
            border: "none",
            color: "white",
          }}
          onClick={handleCompareClick}
          className="min-h-[48px]"
          noCustomHeight={true}
        >
          Compare
        </CommonButton>
      </div>
    </div>
  );
};

export default DatabaseSelect;
