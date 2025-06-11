"use client";

import React, { useState, useEffect } from "react";
import { TreeSelect, Spin } from "antd";
import { buildTreeData } from "@/utils/helper";
import { toast } from "react-toastify";
import { getCategories } from "@/utils/categoriesUtils";

export default function CommonCategoryTreeSelect({
  value,
  onChange,
  multiple = false,
  placeholder = "Select category",
  allowClear = true,
  disabled = false,
  ...rest
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await getCategories();
        if (res?.data) {
          setCategories(res.data);
        } else {
          toast.error(res?.message || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Fetch categories error:", err);
        toast.error("Error fetching categories");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const treeData = buildTreeData(categories);

  return (
    <TreeSelect
      value={value}
      onChange={onChange}
      treeData={treeData}
      treeCheckable={multiple}
      multiple={multiple}
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled || loading}
      showSearch
      treeDefaultExpandAll
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      notFoundContent={loading ? <Spin size="small" /> : null}
      {...rest}
    />
  );
}
