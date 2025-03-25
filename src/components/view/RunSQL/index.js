"use client";

import React from "react";
import DbStructureEditor from "./DbStructureEditor";
import QueryEditor from "./QueryEditor";
import DataDefination from "./DataDefination";
import QueryResult from "./QueryResult";

const RunSQL = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-[5px] py-24 h-screen box-border 2xl:px-20 lg:pl-6 px-3 runsql-container ">
      {/* DBML */}
      <div className="border border-[#DFE0EB]  min-w-[100px] rounded-[8px] min-h-[100px] overflow-hidden">
        <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
          <div className="bg-[#3E53D7] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
            1
          </div>
          <span className="font-medium">Define Database Structure</span>
        </div>
        <div className="h-full ">
          <DbStructureEditor />
        </div>
      </div>

      {/* SQL QUERY EDITOR */}
      <div className="border border-[#DFE0EB]  min-w-[100px] rounded-[8px] min-h-[100px] overflow-hidden">
        <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
          <div className="bg-[#3EB6D7] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
            3
          </div>
          <span className="font-medium">Write SQL Query</span>
        </div>
        <div className="h-full overflow-hidden">
          <QueryEditor />
        </div>
      </div>

      {/* DATA DEFINATIONS */}
      <div className="border border-[#DFE0EB]  min-w-[100px] rounded-[8px] min-h-[100px] overflow-hidden">
        <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
          <div className="bg-[#D7853E] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
            2
          </div>
          <span className="font-medium">Define Data</span>
        </div>
        <div className="h-full w-full overflow-hidden data-defination">
          <DataDefination />
        </div>
      </div>

      {/* QUERY RESULT*/}
      <div className="border border-[#DFE0EB]  min-w-[100px] rounded-[8px] min-h-[100px]">
        <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
          <div className="bg-[#67D73E] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
            4
          </div>
          <span className="font-medium">Query Result</span>
        </div>
        <div>
          <QueryResult />
        </div>
      </div>
    </div>
  );
};

export default RunSQL;
