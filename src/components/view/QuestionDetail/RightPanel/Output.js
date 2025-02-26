import { runQuery, runSubmission } from "@/utils/queryServices";
import { Button, Table } from "antd";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Output = ({
  query,
  question,
  setIsSolutionCorrect,
  isSolutionCorrect,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [outputData, setOutputData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      // Clear the timer if query changes again
      return () => clearTimeout(timer);
    } else {
      // No query means definitely not typing
      setIsTyping(false);
    }
  }, [query]);

  const handleRunQuery = async () => {
    const payload = {
      questionId: question?.id,
      query: query,
    };
    try {
      const res = await runQuery(payload);
      setOutputData(res?.data);
      if (!res?.data) {
        setError(res?.message?.error || "Failed to run query");
        setIsSolutionCorrect(false);
        // toast.error(res?.message?.error || "Failed to run query");
      } else {
        setError(null);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to run query");
    }
  };
  const handleSubmission = async () => {
    const payload = {
      questionId: question?.id,
      userQuery: query,
    };
    try {
      const res = await runSubmission(payload);
      if (res?.data?.correct) {
        setIsSolutionCorrect(true);
        setOutputData(res?.data?.expectedOutput);
      } else if (!res?.data?.correct) {
        setOutputData(res?.data?.userOutput);
        setIsSolutionCorrect(false);
      }
      if (!res?.data) {
        setError(res?.message?.error || "Failed to run query");
        // toast.error(res?.message?.error || "Failed to run query");
      } else {
        setError(null);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to run query");
    }
  };
  const isOutputData = outputData?.length > 0;
  return (
    <div className={`bg-[#FAFAFA] h-auto  p-3 relative`}>
      <p className="font-semibold">Output</p>

      <div className="overflow-auto h-[250px] ">
        {isOutputData ? <DynamicTable data={outputData} /> : <></>}
        {error && (
          <div className="flex items-center justify-center mt-3 w-full">
            <p className="border bg-red-500 text-white p-5 w-full rounded-xl">
              {error}
            </p>
          </div>
        )}
      </div>
      <div
        className={`flex gap-2 items-baseline justify-end ${
          !isOutputData ? "absolute bottom-4 right-4" : "mt-6"
        }  `}
      >
        <Button onClick={handleRunQuery} type="dashed">
          Run Code
        </Button>
        <div className="relative">
          {isTyping ? (
            <img
              src={"/assets/icons/dog-play-g.gif"}
              alt="dog-play"
              className="mb-[-2px] h-32  object-cover absolute bottom-5"
              draggable={false}
            />
          ) : isSolutionCorrect ? (
            <img
              src={"/assets/icons/dog-success.gif"}
              alt="dog-success"
              className="mb-[-2px] h-40 object-cover absolute bottom-5"
              draggable={false}
            />
          ) : (
            <img
              src={"/assets/icons/dog-play.svg"}
              alt="dog-play"
              className="mb-[-2px] h-24 object-cover absolute bottom-8"
              draggable={false}
            />
          )}
          <Button onClick={handleSubmission} type="primary">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Output;

const DynamicTable = ({ data }) => {
  const columns = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return Object.keys(data[0]).map((key) => ({
      title: key,
      dataIndex: key,
      key,
    }));
  }, [data]);

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record, index) => index}
      pagination={false}
      className="h-[300px]"
    />
  );
};
