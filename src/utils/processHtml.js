import React from "react";
import parse from "html-react-parser";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const ProcessDataHtml = ({ htmlString, record, showOnLine = false }) => {
  // Process and display HTML content with specific styling and tooltips

  const processHtml = (html) => {
    if (typeof html !== "string") {
      console.error("Invalid HTML string:", html);
      return null;
    }
    const modifiedHtml = html.replace(/,/g, ",<br />");

    const styledHtml = modifiedHtml.replace(
      /<a(.*?)>/g,
      '<a$1 style="color: blue; text-decoration: none;" >'
    );

    return parse(styledHtml, {
      replace: (domNode) => {
        if (domNode.name === "span" && domNode.attribs?.["title"]) {
          const tooltipContent = domNode.attribs["title"];
          const cleanTooltipContent = tooltipContent.replace(
            /<br\s*\/?>/g,
            " "
          );

          return (
            <Tooltip title={cleanTooltipContent}>
              <InfoCircleOutlined
                style={{
                  marginLeft: 8,
                  color: "#3E53D7",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          );
        }

        if (domNode.name === "span") {
          if (domNode.attribs?.class === "bold") {
            return (
              <span style={{ fontWeight: "bold" }}>
                {domNode.children?.[0]?.data}
              </span>
            );
          } else if (domNode.attribs?.class === "danger") {
            return (
              <span style={{ color: "red", fontWeight: "600" }}>
                {domNode.children?.[0]?.data}
              </span>
            );
          }
        }
      },
    });
  };

  if (record?.key === "Current Release") {
    return (
      <div
        style={{
          padding: "5px",
          minWidth: "200px",
          fontSize: "14px",
          fontWeight: "400",
        }}
      >
        <span>{htmlString}</span>
      </div>
    );
  }

  if (!htmlString) {
    return null;
  }

  return (
    <div className={`${showOnLine ? "flex flex-wrap" : ""} `}>
      {processHtml(htmlString)}
    </div>
  );
};
export default ProcessDataHtml;
