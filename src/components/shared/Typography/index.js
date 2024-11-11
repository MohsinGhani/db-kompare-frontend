"use client";

import { Typography } from "antd";

const { Title, Text, Paragraph, Link } = Typography;

const CommonTypography = ({ type, children, classes, ...props }) => {
  switch (type) {
    case "title":
      return (
        <Title className={`!mb-0 font-dmSans ${classes}`} {...props}>
          {children}
        </Title>
      );
    case "text":
      return (
        <Text className={`!mb-0 font-dmSans ${classes}`} {...props}>
          {children}
        </Text>
      );
    case "paragraph":
      return (
        <Paragraph className={`!mb-0 font-dmSans ${classes}`} {...props}>
          {children}
        </Paragraph>
      );
    case "link":
      return (
        <Link className={`!mb-0 font-dmSans ${classes}`} {...props}>
          {children}
        </Link>
      );
    default:
      return (
        <Text className={`!mb-0 font-dmSans ${classes}`} {...props}>
          {children}
        </Text>
      );
  }
};

export default CommonTypography;
