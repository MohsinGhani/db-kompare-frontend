"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import ContentSection from "@/components/shared/ContentSection/page";
import { dbToolChildrens } from "@/shared/json/data.json";
import CommonButton from "@/components/shared/Button";
import { toast } from "react-toastify";
import FiltersComponent from "@/components/shared/CommonFiltersComponent";

export default function Page({ params }) {
  const router = useRouter();
  const { tool } = params;
  const [dbToolChilds, setDbToolChilds] = useState(dbToolChildrens);
  const [selectedChildTools, setSelectedChildTools] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const decodedTool = decodeURIComponent(tool.replace("tool-", ""));

  const handleChildClick = (option) => {
    if (selectedChildTools.length >= 5) {
      toast.error("You can select only up to 5 tool options.");
      return;
    }

    setSelectedChildTools((prevSelected) => {
      if (prevSelected.includes(option.name)) {
        return prevSelected.filter((db) => db !== option.name);
      } else {
        return [...prevSelected, option.name];
      }
    });
  };

  return (
    <ContentSection
      heading1={decodedTool}
      paragraph1={`${decodedTool} is the process of creating and analyzing data models for resources stored in a database. The Data Model is an abstract model that standardizes the data description, data semantic, and consistency constraints of data. Its main purpose is to represent the types of data within a system, the relationships between objects, and its attributes. The data model helps to understand what data is needed and how data should be organized. It is like a blueprint for an architect to better understand what is being created`}
      imageAlt="blue line"
    >
      {false ? (
        <div className="w-full flex justify-center items-center h-32">
          {" "}
          <Spin indicator={<LoadingOutlined style={{ fontSize: 90 }} spin />} />
        </div>
      ) : (
        <div className="md:flex md:flex-row items-start justify-between w-full">
          <div className=" hidden md:block md:min-w-[250px] mr-4 ">
            <FiltersComponent />
          </div>
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-6 p-2">
            <>
              {dbToolChilds.map((option, index) => (
                <CommonButton
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

                    overflow: "hidden", // Hides the overflowing content
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => handleChildClick(option)}
                >
                  {option.value}
                </CommonButton>
              ))}
            </>
          </div>
        </div>
      )}
    </ContentSection>
  );
}
