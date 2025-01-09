"use client";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import CommonButton from "@/components/shared/Button";
import ToolSelect from "@/components/dbToolPage/ToolSelect";
import ToolComparisonHeader from "@/components/dbToolPage/ToolComparisonHeader";
import { categoriesItems } from "@/utils/const";
import FiltersComponent from "@/components/shared/CommonFiltersComponent";
import ToolComparisonTable from "@/components/dbToolPage/ToolComparisonTable";

import { Button, Drawer } from "antd";
import CommonTypography from "@/components/shared/Typography";
import { useSearchParams } from "next/navigation";
import { FilterOutlined } from "@ant-design/icons";

const dbToolComparison = ({ params }) => {
  const router = useRouter();
  const { tool, options } = params;
  const searchParams = useSearchParams();
  const [dbToolChilds, setDbToolChilds] = useState();
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedToolsOptions, setSelectedToolsOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    freeEdition: "All",
    erDiagram: "All",
    runsOn: "Linux",
    forwardEngineering: "All",
    synchronization: "All",
  });

  const decodedTool = decodeURIComponent(tool.replace("tool-", ""));
  const decodedOptions = decodeURIComponent(options.replace("options-", ""));

  const currentTool = categoriesItems.find((cat) => cat.value === decodedTool);
  const currentCategory = categoriesItems.find(
    (cat) => cat.value === decodedTool
  );

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const filters = {
      freeEdition: searchParams.get("freeEdition") || "All",
      erDiagram: searchParams.get("erDiagram") || "All",
      runsOn: searchParams.get("runsOn") || "Linux",
      forwardEngineering: searchParams.get("forwardEngineering") || "All",
      synchronization: searchParams.get("synchronization") || "All",
    };
    setSelectedFilters(filters);
  }, [searchParams]);

  useEffect(() => {
    if (decodedOptions) {
      const dbTools = decodedOptions
        .split("-")
        .map((option) => decodeURIComponent(option));
      setSelectedTools(dbTools);
      setSelectedToolsOptions(dbTools);
    }
  }, [decodedOptions]);

  const newDbQuery = encodeURIComponent(selectedToolsOptions.join("-"));

  // Fetch tools list on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const result = await fetchDatabases();
        setDbToolChilds(currentTool.tools);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  // Navigate to the database comparison page on compare click
  const handleCompareClick = () => {
    const filterQuery = new URLSearchParams(selectedFilters).toString();
    router.push(
      `/db-toolcomparison/${decodedTool}/${newDbQuery}?${filterQuery}`
    );
  };

  // Redirect to comparison or list page based on selected databases
  const handleAddSystemClick = () => {
    if (selectedToolsOptions.length === 0) {
      router.push(`/db-tool/${decodedTool}`);
    } else {
      const filterQuery = new URLSearchParams(selectedFilters).toString();
      const optionsSegment = encodeURIComponent(selectedToolsOptions.join("-"));
      const url = `/db-tool/${decodedTool}?options=${optionsSegment}&${filterQuery}`;
      router.push(url);
    }
  };

  return (
    <>
      <div className="lg:px-28 bg-custom-gradient bg-cover bg-center h-full">
        <ToolComparisonHeader selectedTools={selectedTools} />
      </div>
      <div className="w-full h-auto container font-medium  py-10 flex flex-col gap-8 md:gap-5 items-center">
        <ToolSelect
          dbToolChilds={dbToolChilds}
          dbTool={currentCategory.label}
          selectedTools={selectedTools}
          selectedToolsOptions={selectedToolsOptions}
          setSelectedToolsOptions={setSelectedToolsOptions}
          handleCompareClick={handleCompareClick}
        />
        <div className="w-full text-end flex justify-end">
          <CommonButton
            disabled={selectedTools.length > 4}
            style={{
              borderRadius: "12px",
              padding: "0 40px",
              height: "50px",
              background: selectedTools.length > 4 ? "grey" : "#3E53D7",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={handleAddSystemClick}
          >
            Add another system
          </CommonButton>
        </div>
        <div className="lg:flex lg:flex-row items-start justify-between w-full">
          <div className="hidden lg:block lg:min-w-[250px] mr-4 mt-4">
            <FiltersComponent
              selectedFilters={selectedFilters}
              disabled={true}
            />
          </div>

          <div className="lg:hidden w-full text-end flex justify-end mt-5">
            <Button
              icon={<FilterOutlined />}
              type="text"
              size="large"
              onClick={showDrawer}
            >
              <CommonTypography className="text-[18px] font-semibold">
                Filters
              </CommonTypography>
            </Button>
          </div>
          <div className="overflow-auto w-full">
            <ToolComparisonTable
              selectedFilters={selectedFilters}
              toolName={decodedTool}
              setSelectedTools={setSelectedTools}
              selectedTools={selectedTools}
              setSelectedToolsOptions={setSelectedToolsOptions}
            />
          </div>
        </div>

        <Drawer
          title={
            <CommonTypography className="text-[20px] font-bold">
              Filters
            </CommonTypography>
          }
          onClose={onClose}
          open={open}
        >
          <FiltersComponent
            isSmallDevice={true}
            selectedFilters={selectedFilters}
            disabled={true}
          />
        </Drawer>
      </div>
    </>
  );
};

export default dbToolComparison;
