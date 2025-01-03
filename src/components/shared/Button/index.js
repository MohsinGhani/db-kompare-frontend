"use client";

import React from "react";
import { Button } from "antd";

const CommonButton = ({
  type,
  htmltype,
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
    gap: "8px",
    fontWeight: 700,
    borderRadius: "9px",
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const mergedStyle = { ...buttonStyle, ...style };

  return (
    <Button
      htmlType={htmltype}
      type={type}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      style={mergedStyle}
      className={`bg-blue-500 hover:bg-blue-400 text-white border-none ${
        disabled ? "disabled-button" : ""
      }  `}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
