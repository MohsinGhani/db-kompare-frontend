import CommonDynamicTable from "@/components/shared/CommonDynamicTable";
import React from "react";

const QueryResult = ({ queryResult }) => {
  return (
    <div className="p-2 overflow-auto h-full">
      {!queryResult?.data ? (
        <div className="flex flex-col justify-center items-center h-[300px]">
          <img
            src="/assets/icons/dog-sad.svg"
            alt="dog-icon"
            className="h-32"
            draggable={false}
          />
          {!queryResult?.message?.error && (
            <p className="font-medium">Opps! no query result.</p>
          )}
          {queryResult?.message?.error && (
            <p className="text-white p-2  w-3/5 text-center bg-red-500 ">
              Error: {queryResult?.message?.error}
            </p>
          )}
        </div>
      ) : (
        <CommonDynamicTable data={queryResult?.data?.data} />
      )}
    </div>
  );
};

export default QueryResult;
