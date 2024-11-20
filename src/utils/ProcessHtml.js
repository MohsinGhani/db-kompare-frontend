import React from "react";
import parse from "html-react-parser";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const ProcessDataHtml = ({ htmlString }) => {
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

          return (
            <Tooltip title={tooltipContent}>
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
      },
    });
  };

  if (!htmlString) {
    return null;
  }

  return <div>{processHtml(htmlString)}</div>;
};

export default ProcessDataHtml;
