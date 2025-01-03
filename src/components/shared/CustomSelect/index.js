import React from "react";
import { Select } from "antd";

const { Option } = Select;

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  maxSelection,
  style = {},
  className = "",
}) => {
  return (
    <Select
      disabled={(maxSelection && disabled) || value?.length > maxSelection}
      mode="multiple"
      className={className}
      size="large"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      style={{
        borderRadius: "4px 0 0 4px",
        border: "none",
        ...style,
      }}
      maxTagTextLength={10}
    >
      {options?.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelect;
