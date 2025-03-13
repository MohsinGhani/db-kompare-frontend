"use client";

import React from "react";
import { Form, Input } from "antd";
import CommonTypography from "../Typography";

const CommonInput = ({
  label,
  name,
  rules = [],
  inputType,
  inputProps = {},
  labelLevel = 5,
  size = "large",
  placeholder,
  disabled,
  ...rest
}) => {
  return (
    <div className="w-full">
      <CommonTypography classes="text-base font-semibold ">
        {label}
      </CommonTypography>
      <Form.Item
        name={name}
        rules={rules}
        {...rest}
        style={{ marginTop: "6px" }}
      >
        {inputType === "password" ? (
          <Input.Password
            size={size}
            placeholder={placeholder}
            allowClear={false}
            {...inputProps}
          />
        ) : (
          <Input
            size={size}
            type={inputType ? inputType : "text"}
            placeholder={placeholder}
            allowClear={false}
            {...inputProps}
            disabled={disabled}
          />
        )}
      </Form.Item>
    </div>
  );
};

export default CommonInput;
