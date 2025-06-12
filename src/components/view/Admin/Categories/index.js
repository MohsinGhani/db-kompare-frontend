"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "..";
import CommonHeading from "@/components/shared/CommonHeading";
import CommonTable from "@/components/shared/CommonTable";
import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/utils/categoriesUtils";
import ManageCategory from "./ManageCategory";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res?.data) {
        setCategories(res.data);
      } else {
        setCategories([]);
        toast.error(res?.message || "Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Error fetching categories");
      console.error("Fetch categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryAction = async (values, isEdit) => {
    setActionLoading(true);
    try {
      if (isEdit) {
        await updateCategory(selectedCategory.id, values);
        toast.success("Category updated");
      } else {
        await createCategory([values]);
        toast.success("Category created");
      }
      fetchCategories();
      setDrawerVisible(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Category action error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteCategory(record.id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
      console.error("Delete category error:", error);
    }
  };

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      // Sort by createdAt in descending order (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [categories]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      className:"capitalize",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span className={`text-gray-700 ${!text ? "!italic !text-gray-400" : ""}`}>
          {text || "--No description--"}
        </span>
      ),
    },
    {
      title: "Child Categories",
      dataIndex: "children",
      key: "children",
      width: 200,
      render: (children) => (
        <span
          className={`font-medium ${
            children?.length ? "text-green-600" : "text-red-600"
          }`}
        >
          {children?.length ? "YES" : "NO"}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (ts) => new Date(ts).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedCategory(record);
              setDrawerVisible(true);
            }}
          />
          <Popconfirm
            title="Delete this category?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between admin-categories items-center mb-6 px-2">
        <CommonHeading title="Categories" />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedCategory(null);
            setDrawerVisible(true);
          }}
        >
          Add New Category
        </Button>
      </div>

      <CommonTable
        bordered
        rowKey="id"
        dataSource={sortedCategories}
        columns={columns}
        loading={loading}
        pagination={false}
      />

      <ManageCategory
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={(values) => handleCategoryAction(values, !!selectedCategory)}
        loading={actionLoading}
        categories={categories}
        initialValues={selectedCategory || {}}
      />
    </AdminLayout>
  );
};

export default Categories;
