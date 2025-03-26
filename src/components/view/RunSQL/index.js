"use client";

import React, { useEffect, useState } from "react";
import DbStructureEditor from "./DbStructureEditor";
import QueryEditor from "./QueryEditor";
import DataDefination from "./DataDefination";
import QueryResult from "./QueryResult";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CommonLoader from "@/components/shared/CommonLoader";
import { executeQuery, getSingleFiddle, getLatestFiddle } from "@/utils/runSQL";

const RunSQL = ({ fiddleId }) => {
  const [fiddle, setFiddle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);

  const [queryResult, setQueryResult] = useState(null);

  const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;

  // Fetch the fiddle data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = fiddleId
          ? await getSingleFiddle(fiddleId)
          : await getLatestFiddle();
        setFiddle(data?.data);
      } catch (err) {
        toast.error(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fiddleId]);

  // Update the query state based on fiddle data
  useEffect(() => {
    if (fiddle && fiddle.query) {
      setQuery(fiddle.query);
    }
    if (fiddle && fiddle?.queryResult) {
      setQueryResult(fiddle.queryResult);
    }
  }, [fiddle]);

  const handleQuery = async () => {
    try {
      setQueryLoading(true);
      const res = await executeQuery({
        userId: user.id,
        query,
      });
      setQueryResult(res);
      setQueryLoading(false);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
      setQueryLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <CommonLoader />
      ) : (
        <div className="grid grid-cols-2 grid-rows-2 gap-[5px] py-24 min-h-screen box-border 2xl:px-20 lg:pl-6 px-3 runsql-container ">
          {/* DB Structure Editor */}
          <div className="border border-[#DFE0EB] rounded-[8px] min-h-[100px] overflow-hidden">
            <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
              <div className="bg-[#3E53D7] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
                1
              </div>
              <span className="font-medium">Define Database Structure</span>
            </div>
            <div className="h-full">
              <DbStructureEditor
                dbStructure={fiddle?.dbStructure}
                user={user}
              />
            </div>
          </div>

          {/* SQL Query Editor */}
          <div className="border border-[#DFE0EB] rounded-[8px] min-h-[100px] overflow-hidden">
            <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
              <div className="bg-[#3EB6D7] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
                3
              </div>
              <span className="font-medium">Write SQL Query</span>
            </div>
            <div className="h-full overflow-hidden">
              <QueryEditor
                query={query}
                handleQuery={handleQuery}
                setQuery={setQuery}
                queryResult={queryResult?.data}
                queryLoading={queryLoading}
              />
            </div>
          </div>

          {/* Data Definations */}
          <div className="border border-[#DFE0EB] rounded-[8px] min-h-[100px] overflow-hidden">
            <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
              <div className="bg-[#D7853E] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
                2
              </div>
              <span className="font-medium">Define Data</span>
            </div>
            <div className="h-full w-full overflow-hidden data-defination">
              <DataDefination dataSample={fiddle?.dataSample} />
            </div>
          </div>

          {/* Query Result */}
          <div className="border border-[#DFE0EB] rounded-[8px] min-h-[100px]">
            <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
              <div className="bg-[#67D73E] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
                4
              </div>
              <span className="font-medium">Query Result</span>
            </div>
            <div>
              <QueryResult queryResult={queryResult} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RunSQL;
