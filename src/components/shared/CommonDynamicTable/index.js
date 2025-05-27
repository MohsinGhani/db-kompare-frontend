import React from "react";
import CommonTable from "../CommonTable";

const CommonDynamicTable = ({ data, className, pagination = false }) => {
  const columns = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      title: key,
      dataIndex: key,
      key,
    }));
  }, [data]);

  return (
    <CommonTable
      columns={columns}
      dataSource={data}
      rowKey={(record, index) => index}
      pagination={pagination}
      className={`mt-4 common-dynamic-table w-full ${className}`}
      bordered
    />
  );
};

export default CommonDynamicTable;
