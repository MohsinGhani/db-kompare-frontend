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
  const buttonStyle = {
    // width: "201.92px",
    width: "100%",
    height: "54px",
    padding: "13px 40.92px 13px 41px",
    gap: "0px",
    fontWeight: 700,
    borderRadius: "9px ",
    color: "black",
    border: "1px solid black",
  };

  const mergedStyle = { ...buttonStyle, ...style };

  return (
    <Button
      type={type}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      style={mergedStyle}
      className={classes}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
