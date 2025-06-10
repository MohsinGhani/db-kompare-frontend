"use client";

import React, { useEffect } from 'react';
import { Drawer, Form, Input, TreeSelect, Button } from 'antd';

const { TextArea } = Input;

const buildTreeData = (categories) => {
  return categories.map(category => ({
    value: category.id,       // Using id as value (must be unique)
    title: category.name,     // Using name as title
    children: category.children ? buildTreeData(category.children) : [],
  }));
};

const ManageCategory = ({
  visible,
  onClose,
  onSubmit,
  loading,
  categories = [],
  initialValues = {}
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: initialValues.name || '',
        description: initialValues.description || '',
        parentId: initialValues.parentId || null,
        status: initialValues.status || 'ACTIVE'
      });
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Drawer
      title={initialValues.id ? 'Edit Category' : 'Add New Category'}
      width={360}
      onClose={onClose}
      open={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            onClick={() => form.submit()}
            type="primary"
            loading={loading}
          >
            {initialValues.id ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input placeholder="Category name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={3} placeholder="Description (optional)" />
        </Form.Item>

        <Form.Item
          name="parentId"
          label="Parent Category"
        >
          <TreeSelect
            allowClear
            treeData={buildTreeData(categories)}
            placeholder="Select parent category"
            treeDefaultExpandAll
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ManageCategory;
