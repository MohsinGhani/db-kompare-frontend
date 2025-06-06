"use client";

import React, { useEffect, useState } from "react";
import DbStructureEditor from "./DbStructureEditor";
import QueryEditor from "./QueryEditor";
import DataDefination from "./DataDefination";
import QueryResult from "./QueryResult";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  executeQuery,
  getSingleFiddle,
  createUserSchema,
  addFiddle,
} from "@/utils/runSQL";
import TopSection from "./TopSection";
import { Alert, Flex, Spin, Tooltip } from "antd";
import FileImporter from "./FileImporter";
import DownloadResult from "./DownloadResult";
import ProfilingBtn from "./ProfilingBtn";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import ProfilingWithFile from "./ProfilingWithFile";
import Link from "next/link";
import SampleFileList from "./SampleFileList";
import CommonLoader from "@/components/shared/CommonLoader";

const RunSQL = () => {
  const { id: fiddleId } = useParams();
  const { userDetails,isUserLoading } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data || null;

  // State for the entire fiddle and for the DB structure query (plus any auxiliary data)
  const [fiddle, setFiddle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbStructureQuery, setdbStructureQuery] = useState({
    dbStructure: "",
    createTableStatement: "",
  });
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);

  // Fetch fiddle data from the server.
  const fetchData = async (fiddleId = "") => {
    setLoading(true);
    try {
      let fiddleData;
      // When fiddleId is provided, include the user id as the second argument.
      if (user && !isUserLoading) {
        if (fiddleId) {
          fiddleData = await getSingleFiddle(fiddleId, user.id);
        } else {
          // Get the "latest" fiddle for the user.
          fiddleData = await getSingleFiddle("latest", user.id);
          if (!fiddleData?.data) {
            // If no fiddle is found, create a user schema and add a fiddle.
            const schemaCreated = await createUserSchema({ userId: user.id });
            if (schemaCreated?.data) {
              const payload = { ownerId: user.id };
              const fiddleAdded = await addFiddle(payload);
              if (fiddleAdded) {
                fiddleData = await getSingleFiddle("latest", user.id);
              }
            }
          }
        }
      } else {
        fiddleData = await getSingleFiddle(
          "cd809ddc-453e-449b-b796-a92440af2f15"
        );
      }

      setFiddle(fiddleData?.data);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(fiddleId ?? "");
  }, [fiddleId, user]);

  // When fiddle is updated, update query result and backend structure state.
  useEffect(() => {
    if (fiddle) {
      if (fiddle.queryResult) setQueryResult(fiddle.queryResult);
      if (fiddle?.dbStructure) {
        setdbStructureQuery((prev) => ({
          ...prev,
          dbStructure: fiddle.dbStructure,
        }));
      }
    }
  }, [fiddle]);

  // Execute a given query.
  const handleQuery = async (query) => {
    try {
      setQueryLoading(true);
      const res = await executeQuery({
        userId: user?.id,
        query,
      });
      setQueryResult(res);
      setFiddle((prev) => ({ ...prev, query, queryResult: res }));
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setQueryLoading(false);
    }
  };


  return (
    <div className="py-20">
      <Spin className="max-h-[80vh]" spinning={loading || isUserLoading}>
        <TopSection
          user={user}
          fiddle={fiddle}
          setFiddle={setFiddle}
          fetchData={fetchData}
        />
        {!user && (
          <div className="2xl:px-20 lg:pl-6 px-3 my-4 ">
            <Alert
              message="We will recommend you to login to save your work and access it later. You will get many features. It's totally free!"
              showIcon
            />
          </div>
        )}
        <div className="grid grid-cols-2 grid-rows-2 gap-[5px] box-border 2xl:px-20 lg:pl-6 px-3 runsql-container">
          {/* DB Structure Editor */}
          <div className="border border-[#DFE0EB] rounded-[8px] min-h-[100px] overflow-hidden">
            <div className="border-b border-[#DFE0EB] p-2 flex gap-2 items-center">
              <div className="bg-[#3E53D7] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
                1
              </div>
              <span className="font-medium">Define Database Structure</span>
            </div>
            <div className="h-full">
              {fiddle?.dbStructure && (
                <DbStructureEditor
                  fiddle={fiddle}
                  user={user}
                  fetchData={fetchData}
                  dbStructureQuery={dbStructureQuery}
                  setdbStructureQuery={setdbStructureQuery}
                />
              )}
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
                query={fiddle?.query || ""}
                handleQuery={handleQuery}
                queryResult={queryResult?.data}
                queryLoading={queryLoading}
                tables={fiddle?.tables}
              />
            </div>
          </div>

          {/* Data Definitions */}
          <div className="border border-[#DFE0EB] rounded-[8px] overflow-auto min-h-[100px]">
            <div className="border-b border-[#DFE0EB] p-2 flex justify-between w-full gap-2 items-center">
              <Flex gap={4} align="center">
                <div className="bg-[#D7853E] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
                  2
                </div>
                <span className="font-medium inline-block">
                  Define Data{" "}
                  <Tooltip title="Insert data from CSV/JSON or add rows manually">
                    <InfoCircleOutlined size="small" className="text-sm" />
                  </Tooltip>
                </span>
              </Flex>
              <Flex align="center" gap={4}>
                <SampleFileList user={user} />
                <FileImporter
                  user={user}
                  fiddle={fiddle}
                  setdbStructureQuery={setdbStructureQuery}
                  fetchData={fetchData}
                />
                <ProfilingWithFile
                  tables={fiddle?.tables}
                  user={user}
                  fiddleId={fiddle?.id}
                />
              </Flex>
            </div>
            <div className="h-full w-full max-h-[400px] overflow-hidden data-defination">
              <DataDefination
                dataSample={fiddle?.dataSample}
                user={user}
                fetchData={fetchData}
                fiddleId={fiddle?.id}
              />
            </div>
          </div>

          {/* Query Result */}
          <div className="border border-[#DFE0EB] rounded-[8px] overflow-auto min-h-[100px]">
            <div className="border-b border-[#DFE0EB] p-2 flex justify-between w-full gap-2 items-center">
              <Flex gap={8} align="center">
                <Flex gap={4} align="center">
                  <div className="bg-[#67D73E] rounded-full p-2 text-white h-8 w-8 flex items-center justify-center">
                    4
                  </div>
                  <span className="font-medium">Query Result</span>
                </Flex>
                {user && (
                  <Link
                    href={`/user-profile?tab=4`}
                    target="_blank"
                    className="text-primary hover:text-primary underline"
                  >
                    See all your profiling results
                  </Link>
                )}
              </Flex>
              <Flex align="center" gap={4}>
                <ProfilingBtn
                  data={queryResult}
                  user={user}
                  fiddleId={fiddle?.id ?? ""}
                />
                <DownloadResult data={queryResult} />
              </Flex>
            </div>
            <div className="h-full w-full max-h-[400px] overflow-hidden data-defination">
              <QueryResult queryResult={queryResult} />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default RunSQL;
