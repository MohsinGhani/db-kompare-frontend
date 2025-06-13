"use client";

import React, { useState, useEffect } from "react";
import { TreeSelect, Spin } from "antd";
import { buildTreeData } from "@/utils/helper";
import { toast } from "react-toastify";
import { getCategories } from "@/utils/categoriesUtils";

export default function CommonCategoryTreeSelect({
  value,
  onChange,
  onClear,
  multiple = false,
  placeholder = "Select category",
  allowClear = true,
  disabled = false,
  className = "",
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


  const handleChange = (selectedValue) => {
    // If multiple, selectedValue will be an array; if single, it will be a string (category ID)
    if (multiple) {
      // You may want to get the category names here if needed for display
      const selectedCategories = categories.filter((category) =>
        selectedValue.includes(category.id)
      );
      const categoryNames = selectedCategories.map((category) => category.name);
      onChange(selectedValue, categoryNames); // Pass the ID and the category names
    } else {
      // Handle selecting single category and its children (nested categories)
      const selectedCategory = categories.find(
        (category) => category.id === selectedValue
      );

      if (selectedCategory) {
        onChange(selectedValue, selectedCategory?.name || ""); // Pass the ID and name of the selected category
      } else {
        // If the selected category is a child, traverse the tree and find it
        const findChildCategory = (categoryList) => {
          for (const category of categoryList) {
            if (category.id === selectedValue) return category;
            if (category.children && category.children.length > 0) {
              const childCategory = findChildCategory(category.children);
              if (childCategory) return childCategory;
            }
          }
          return null;
        };

        const foundCategory = findChildCategory(categories);
        if (foundCategory) {
          onChange(selectedValue, foundCategory.name);
        }
      }
    }
  };

  return (
    <TreeSelect
      value={value}
      onChange={handleChange}
      treeData={treeData}
      treeCheckable={multiple}
      multiple={multiple}
      onClear={onClear}
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled || loading}
      loading={loading}
      className={`common-category-tree-select capitalize ${className}`}
      showSearch={true}
      treeDefaultExpandAll
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      notFoundContent={loading ? <Spin size="small" /> : null}
      {...rest}
    />
  );
}
