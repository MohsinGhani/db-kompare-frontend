"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import SearchBar from "@/components/shared/SearchInput";
import CommonButton from "@/components/shared/Button";
import { fetchDatabases } from "@/utils/databaseUtils";
import { Button, Tooltip } from "antd";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import FiltersComponent from "@/components/shared/CommonFiltersComponent";
import { dbTools } from "@/utils/const";
import { useSearchParams } from "next/navigation";

const DbToolsComparisons = () => {
  const router = useRouter();
  const { list, options } = useParams();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dbData, setDbData] = useState([]);
  const [selectedChildTools, setSelectedChildTools] = useState([]);
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
  const searchParams = useSearchParams();

  // Fetch and load database data with loading state handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchDatabases();
        setDbData(result.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Decode 'list' query parameter to set selectedDatabases state
  const decodedTool = decodeURIComponent(list?.replace("list-", ""));
  const decodedDbArray = decodedTool ? decodedTool.split("-") : [];

  useEffect(() => {
    if (decodedDbArray.length > 0) {
      setSelectedChildTools(decodedDbArray);
    }

    const newFilters = { ...selectedFilters };
    [
      "AccessControl",
      "VersionControl",
      "SupportForWorkflow",
      "WebAccess",
      "DeploymentOption",
      "FreeEdition",
      "AuthenticationSupport",
      "IntegrationWithUpstream",
      "UserCreatedTags",
      "CustomizationPossible",
      "ModernWaysOfDeployment",
    ].forEach((key) => {
      const paramVal = searchParams.get(key);
      if (paramVal) {
        newFilters[key] = paramVal;
      }
    });
    setSelectedFilters(newFilters);
  }, []);

  // Filter database options based on search term
  const filteredOptions = dbData.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trigger navigation for database comparison with validation
  const handleCompareClick = () => {
    if (selectedChildTools.length === 0) {
      toast.error("Please select at least one tool option to compare");
    } else {
      const filtersQuery = Object.entries(selectedFilters)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const url = `/db-toolcomparison/${encodeURIComponent(
        selectedChildTools.join("-")
      )}?${filtersQuery}`;
      router.push(url);
    }
  };

  const handleFiltersOptionsChange = (category, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: value,
    }));
  };

  const handleChildClick = (option) => {
    setSelectedChildTools((prevSelected) => {
      if (prevSelected.includes(option.name)) {
        return prevSelected.filter((db) => db !== option.name);
      } else {
        return [...prevSelected, option.name];
      }
    });
  };

  return (
    <div className="w-full container flex md:mt-8 flex-col gap-10">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
              {dbTools
                ?.sort((a, b) => a?.name?.localeCompare(b.name))
                ?.map((option, index) => (
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
  );
};

export default DbToolsComparisons;
