"use client";

import React from "react";
import { Button } from "antd";

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
    height: "54px",
    padding: "13px 40.92px 13px 41px",
    gap: "0px",
    fontWeight: 700,
    borderRadius: "9px ",
  };

  const mergedStyle = { ...buttonStyle, ...style };

  return (
    <Button
      type={type}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      style={mergedStyle}
      className="bg-blue-500 hover:bg-blue-400 text-white border-none"
      {...props}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
