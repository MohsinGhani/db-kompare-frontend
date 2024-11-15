import React from "react";
import { Select } from "antd";

const { Option } = Select;

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  maxSelection = 4,
  style = {},
  className = "",
}) => {
  return (
    <Select
      disabled={disabled || value.length > maxSelection || value.length <= 0}
      mode="multiple"
      className={className}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      style={{
        borderRadius: "4px 0 0 4px",
        border: "none",
        ...style,
      }}
    >
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelect;
