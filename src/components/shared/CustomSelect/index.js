import React from "react";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";

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
      suffixIcon={<DownOutlined />}
      style={{
        borderRadius: "4px 0 0 4px",
        border: "none",
        ...style,
      }}
      maxTagTextLength={10}
      showSearch
      filterOption={(input, option) =>
        option?.children.toLowerCase().includes(input.toLowerCase())
      }
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
