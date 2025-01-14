"use client";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import CommonButton from "@/components/shared/Button";
import ToolSelect from "@/components/dbToolPage/ToolSelect";
import ToolComparisonHeader from "@/components/dbToolPage/ToolComparisonHeader";
import { dbTools } from "@/utils/const";
import FiltersComponent from "@/components/shared/CommonFiltersComponent";
import ToolComparisonTable from "@/components/dbToolPage/ToolComparisonTable";

import { Button, Drawer } from "antd";
import CommonTypography from "@/components/shared/Typography";
import { useParams, useSearchParams } from "next/navigation";
import { FilterOutlined } from "@ant-design/icons";

const DbToolComparison = () => {
  const router = useRouter();
  const { options } = useParams();
  const searchParams = useSearchParams();
  const [dbToolChilds, setDbToolChilds] = useState();
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedToolsOptions, setSelectedToolsOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    AccessControl: "Yes",
    VersionControl: "Yes",
    SupportForWorkflow: "Yes",
    WebAccess: "Yes",
    DeploymentOption: "OnPrem",
    FreeEdition: "OpenSource",
    AuthenticationSupport: "User",
    IntegrationWithUpstream: "LimitedFunctionality",
    UserCreatedTags: "Yes",
    CustomizationPossible: "Yes",
    ModernWaysOfDeployment: "Kubernetes",
  });

  const decodedOptions = decodeURIComponent(options?.replace("list-", ""));

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const filters = {
      AccessControl: searchParams.get("AccessControl") || "Yes",
      VersionControl: searchParams.get("VersionControl") || "Yes",
      SupportForWorkflow: searchParams.get("SupportForWorkflow") || "Yes",
      WebAccess: searchParams.get("WebAccess") || "Yes",
      DeploymentOption: searchParams.get("DeploymentOption") || "OnPrem",
      ModernWaysOfDeployment:
        searchParams.get("ModernWaysOfDeployment") || "Kubernetes",
      CustomizationPossible: searchParams.get("CustomizationPossible") || "Yes",
      UserCreatedTags: searchParams.get("UserCreatedTags") || "Yes",
      FreeCommunityEdition: searchParams.get("FreeCommunityEdition") || "",
      AuthenticationProtocolSupported:
        searchParams.get("AuthenticationProtocolSupported") || "",
      IntegrationWithUpstream:
        searchParams.get("IntegrationWithUpstream") || "",
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
        setDbToolChilds(dbTools);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  // Navigate to the database comparison page on compare click
  const handleCompareClick = () => {
    const filterQuery = new URLSearchParams(selectedFilters).toString();
    router.push(`/db-toolcomparison/${newDbQuery}?${filterQuery}`);
  };

  // Redirect to comparison or list page based on selected databases
  const handleAddSystemClick = () => {
    if (selectedToolsOptions.length === 0) {
      router.push(`/db-comparisons/list`);
    } else {
      const filterQuery = new URLSearchParams(selectedFilters).toString();
      const optionsSegment = encodeURIComponent(selectedToolsOptions.join("-"));
      const newDbQuery = encodeURIComponent(selectedToolsOptions.join("-"));
      router.push(
        `/db-comparisons/${newDbQuery}/${filterQuery}?tab=DBToolsComparison`
      );
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
export default DbToolComparison;
