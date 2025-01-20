"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import SearchBar from "@/components/shared/SearchInput";
import CommonButton from "@/components/shared/Button";
import { Button, Drawer, Spin, Tooltip } from "antd";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import FiltersComponent from "@/components/shared/CommonFiltersComponent";
import {
  FilterOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CommonTypography from "@/components/shared/Typography";
import CustomSelect from "@/components/shared/CustomSelect";
import { fetchDbTools, fetchDbToolsCategories } from "@/utils/dbToolsUtil";
import { toolMatchesFilters } from "@/utils/helper";

const DbToolsComparisons = () => {
  const router = useRouter();
  const { list, options } = useParams();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dbToolCategories, setDbToolCategories] = useState([]);
  const [toolsData, setToolsData] = useState([]);
  const [selectedChildTools, setSelectedChildTools] = useState([]);
  const [selectedToolCategoriesOptions, setSelectedToolCategoriesOptions] =
    useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    AccessControl: "Yes",
    VersionControl: "Yes",
    SupportForWorkflow: "No",
    WebAccess: "Yes",
    DeploymentOption: "3",
    FreeCommunityEdition: "4",
    AuthenticationProtocolSupported: "4",
    IntegrationWithUpstream: "Limited",
    UserCreatedTags: "Yes",
    CustomizationPossible: "Limited functionality",
    ModernWaysOfDeployment: "2",
  });

  const decodedTool = list ? decodeURIComponent(list) : "";
  const decodedOptions = decodeURIComponent(options?.replace("options-", ""));
  const decodedDbArray = decodedTool ? decodedTool.split(",") : [];
  const decodedOptionsArray = decodedOptions ? decodedOptions.split("-") : [];

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchCategoriesOptions = async () => {
      try {
        const data = await fetchDbToolsCategories();
        const categories = data.data || [];
        console.log("categories", categories);
        setDbToolCategories(categories);
      } catch (error) {
        console.error("Error fetching db tools categories:", error);
      }
    };

    fetchCategoriesOptions();
  }, []);

  useEffect(() => {
    const fetchDbToolsData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchDbTools();
        setToolsData(result?.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchDbToolsData();
  }, []);

  useEffect(() => {
    if (decodedDbArray.length > 0) {
      const filteredDbArray = decodedDbArray.filter((item) => item !== "list");
      setSelectedChildTools(filteredDbArray);
    }

    if (decodedOptionsArray.length > 0) {
      const queryString = decodedOptionsArray[0];

      const urlParams = new URLSearchParams(queryString);
      let newFilters = { ...selectedFilters };
      Object.keys(newFilters).forEach((key) => {
        const paramVal = urlParams.get(key);
        if (paramVal !== null) {
          newFilters[key] = paramVal;
        }
      });

      setSelectedFilters(newFilters);
    }
  }, []);

  const filteredOptions = toolsData.filter((option) => {
    const matchesSearch = option?.tool_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCoreFeatures = option?.core_features?.some((feature) =>
      feature.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesCategory =
      selectedToolCategoriesOptions.length === 0 ||
      selectedToolCategoriesOptions.includes(option.category_id);

    const matchesFilters = toolMatchesFilters(option, selectedFilters);

    return (
      (matchesSearch || matchesCoreFeatures) &&
      matchesCategory &&
      matchesFilters
    );
  });

  const handleCompareClick = () => {
    if (
      selectedChildTools.includes("list") ||
      selectedChildTools.length === 0
    ) {
      toast.error("Please select at least one tool to compare");
      return;
    }

    const filtersQuery = Object.entries(selectedFilters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const encodedToolNames = selectedChildTools
      .map((tool) => encodeURIComponent(tool.trim()))
      .join(",");

    const url = `/db-toolcomparison/${encodedToolNames}?${filtersQuery}`;
    router.push(url);
  };

  const handleFiltersOptionsChange = (category, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: value,
    }));
  };

  const handleChildClick = (option) => {
    const cleanedSelectedTools = selectedChildTools.filter(
      (db) => db !== "list"
    );

    if (
      cleanedSelectedTools.length >= 10 &&
      !cleanedSelectedTools.includes(option.tool_name)
    ) {
      toast.error("You can select only up to 10 tools.");
    } else {
      setSelectedChildTools((prevSelected) => {
        if (prevSelected.includes(option.tool_name)) {
          return prevSelected.filter((db) => db !== option.tool_name);
        } else {
          return [...prevSelected, option.tool_name];
        }
      });
    }
  };

  return (
    <div className="w-full container flex md:mt-8 flex-col gap-10 ">
      <div className="mb-4  rounded-lg flex items-center justify-center gap-2"></div>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-[70%] w-full md:mr-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isTabSelected={"Db Tools"}
          />
        </div>

        <CustomSelect
          value={selectedToolCategoriesOptions}
          onChange={(selectedValues) =>
            setSelectedToolCategoriesOptions(selectedValues)
          }
          options={dbToolCategories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tool) => ({
              id: tool.id,
              label: tool.name,
              value: tool.id,
            }))}
          placeholder="Select Tool Category"
          maxSelection={2}
          className="md:max-w-[30%] w-full h-10 mt-3 md:mt-0"
        />
      </div>

      <div className="flex md:flex-row flex-col md:justify-end justify-center md:items-end items-center">
        <CommonButton
          disabled={
            selectedChildTools.length === 0 ||
            selectedChildTools.includes("list")
          }
          style={{
            width: "280px",
            fontSize: "16px",
            border: "1px solid #D9D9D9",
            height: "60px",
            background:
              selectedChildTools.includes("list") ||
              selectedChildTools.length === 0
                ? "grey"
                : "#3E53D7",
            color: "white",
            borderRadius: "16px",
          }}
          onClick={handleCompareClick}
        >
          Compare
        </CommonButton>
      </div>
      <div className="md:flex md:flex-row items-start justify-between w-full ">
        <div className="md:hidden flex justify-end  mb-1  w-full">
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
        <div className="hidden md:block md:min-w-[250px] mr-4">
          <FiltersComponent
            selectedFilters={selectedFilters}
            onChange={handleFiltersOptionsChange}
          />
        </div>
        <div className="w-full  flex flex-col gap-10 ">
          {isLoading ? (
            <div className="w-full flex justify-center items-center h-32">
              {" "}
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 90 }} spin />}
              />
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-6 ">
              <>
                {filteredOptions
                  ?.sort((a, b) => a?.tool_name?.localeCompare(b?.tool_name))
                  ?.map((option, index) => (
                    <Tooltip
                      key={option.id}
                      title={option.tool_name}
                      placement="top"
                    >
                      <Button
                        key={option.id}
                        style={{
                          width: "100%",
                          fontWeight: "600",
                          fontSize: "16px",
                          border:
                            selectedChildTools.includes(option.tool_name) ||
                            hoverIndex === index
                              ? "2px solid #3E53D7"
                              : "2px solid #D9D9D9",
                          height: "60px",
                          background: "transparent",
                          color: "black",
                          color:
                            selectedChildTools.includes(option.tool_name) ||
                            hoverIndex === index
                              ? "#3E53D7"
                              : "black",
                          borderRadius: "16px",

                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onClick={() => handleChildClick(option)}
                      >
                        <span
                          className="truncate capitalize"
                          style={{
                            display: "block",
                            maxWidth: "100%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {option.tool_name}
                        </span>
                      </Button>
                    </Tooltip>
                  ))}
              </>
            </div>
          )}
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
          onChange={handleFiltersOptionsChange}
        />
      </Drawer>
    </div>
  );
};

export default DbToolsComparisons;
