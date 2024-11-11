"use client";

import React from "react";
import { Button } from "antd";
import { color } from "highcharts";

const CommonButton = ({
  type,
  onClick,
  children,
  loading = false,
  disabled = false,
  style = {},
  classes,
  ...props
}) => {
  // Default button style
  const buttonStyle = {
    width: "201.92px",
    height: "54px",
    padding: "13px 40.92px 13px 41px",
    gap: "0px",
    fontWeight: 700,
    borderRadius: "9px ",
    color: "black",
    border: "1px solid black",
  };

  // Merge default button style with custom style from props
  const mergedStyle = { ...buttonStyle, ...style };

  return (
    <Button
      type={type}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      style={mergedStyle} // Apply merged style
      className={classes} // Optionally apply additional CSS classes
      {...props}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
