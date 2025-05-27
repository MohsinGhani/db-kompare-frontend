import { Table } from "antd";
import React from "react";

const CommonTable = ({
  className,
  rowKey,
  bordered,
  pagination,
  columns,
  dataSource,
  loading,
  rowSelection,
  locale,
  footer,
  onRow,
  rowClassName,
  components,
  size,
}) => {
  return (
    <Table
      components={components}
      className={`common-table ${className}`}
      rowKey={rowKey}
      bordered={bordered}
      pagination={pagination}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowSelection={rowSelection}
      locale={locale}
      footer={footer}
      onRow={onRow}
      size={size}
      rowClassName={rowClassName}
    />
  );
};

export default CommonTable;
