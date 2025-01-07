"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import ContentSection from "@/components/shared/ContentSection/page";
import CommonButton from "@/components/shared/Button";
import { toast } from "react-toastify";
import FiltersComponent from "@/components/shared/CommonFiltersComponent";
import { Button, Drawer, Tooltip } from "antd";
import CommonTypography from "@/components/shared/Typography";
import { FilterOutlined } from "@ant-design/icons";
import { categoriesItems } from "@/utils/const";
import { useSearchParams } from "next/navigation";

export default function Page({ params }) {
  const router = useRouter();
  const { tool, options } = params;
  const [selectedChildTools, setSelectedChildTools] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    freeEdition: "All",
    erDiagram: "All",
    runsOn: "Linux",
    forwardEngineering: "All",
    synchronization: "All",
  });
  const searchParams = useSearchParams();
  const decodedTool = decodeURIComponent(tool?.replace("tool-", ""));

  const currentCategory = categoriesItems.find(
    (cat) => cat.value === decodedTool
  );

  useEffect(() => {
    if (searchParams.has("options")) {
      setSelectedChildTools(searchParams.get("options").split("-"));
    }
  }, []);

  const handleChildClick = (option) => {
    setSelectedChildTools((prevSelected) => {
      if (prevSelected.includes(option.name)) {
        return prevSelected.filter((db) => db !== option.name);
      } else {
        return [...prevSelected, option.name];
      }
    });
  };
  // Trigger navigation for database comparison with validation
  const handleCompareClick = () => {
    if (
      selectedChildTools.includes("list") ||
      selectedChildTools.length === 0
    ) {
      toast.error("Please select at least one tool option to compare");
    } else {
      const encodedTool = currentCategory?.value;
      const encodedOptions = encodeURIComponent(selectedChildTools.join("-"));
      const filtersQuery = Object.entries(selectedFilters)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      console.log("Filters Query:", filtersQuery);

      const url = `/db-toolcomparison/${encodeURIComponent(
        decodedTool
      )}/${encodeURIComponent(selectedChildTools.join("-"))}?${filtersQuery}`;
      router.push(url);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleFiltersOptionsChange = (category, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: value,
    }));
  };

  return (
    <ContentSection
      heading1={currentCategory?.label}
      paragraph1={`${currentCategory?.label} is the process of creating and analyzing data models for resources stored in a database. The Data Model is an abstract model that standardizes the data description, data semantic, and consistency constraints of data. Its main purpose is to represent the types of data within a system, the relationships between objects, and its attributes. The data model helps to understand what data is needed and how data should be organized. It is like a blueprint for an architect to better understand what is being created`}
      imageAlt="blue line"
    >
      {false ? (
        <div className="w-full flex justify-center items-center h-32">
          {" "}
          <Spin indicator={<LoadingOutlined style={{ fontSize: 90 }} spin />} />
        </div>
      ) : (
        <div className="w-full">
          <div className="md:hidden flex justify-end mb-5 container w-full">
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

          <div className="md:flex md:flex-row items-start justify-between w-full ">
            <div className="hidden md:block md:min-w-[250px] mr-4">
              <FiltersComponent
                selectedFilters={selectedFilters}
                onChange={handleFiltersOptionsChange}
              />
            </div>
            <div className="w-full  flex flex-col gap-10 container">
              <div className="grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-6 ">
                <>
                  {currentCategory?.tools
                    .sort((a, b) => a?.name?.localeCompare(b.name))
                    .map((option, index) => (
                      <Tooltip
                        key={option.name}
                        title={option.name}
                        placement="top"
                      >
                        <Button
                          key={option.id}
                          style={{
                            width: "100%",
                            fontWeight: "600",
                            fontSize: "16px",
                            border:
                              selectedChildTools.includes(option.name) ||
                              hoverIndex === index
                                ? "2px solid #3E53D7"
                                : "2px solid #D9D9D9",
                            height: "60px",
                            background: "transparent",
                            color: "black",
                            color:
                              selectedChildTools.includes(option.name) ||
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
                            className="truncate"
                            style={{
                              display: "block",
                              maxWidth: "100%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {option.value}
                          </span>
                        </Button>
                      </Tooltip>
                    ))}
                </>
              </div>
              <div className="flex md:flex-row flex-col md:justify-end justify-center md:items-end items-center">
                <CommonButton
                  disabled={
                    selectedChildTools.length === 0 ||
                    selectedChildTools.includes("tool")
                  }
                  style={{
                    width: "280px",
                    fontSize: "16px",
                    border: "1px solid #D9D9D9",
                    height: "60px",
                    background:
                      selectedChildTools.includes("tool") ||
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
            </div>
          </div>
        </div>
      )}

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
    </ContentSection>
  );
}
