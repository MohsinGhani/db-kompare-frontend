import CommonTable from "@/components/shared/CommonTable";
import { runQuery, runSubmission } from "@/utils/queryServices";
import { Button, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Output = ({
  query,
  question,
  setIsSolutionCorrect,
  isSolutionCorrect,
  user,
  time,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [outputData, setOutputData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [outSubmittedDate, setOutSubmittedDate] = useState(null);

  useEffect(() => {
    if (query) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [query]);

  const handleRunQuery = async () => {
    setLoadingQuery(true);
    const payload = {
      questionId: question?.id,
      query: query,
    };
    try {
      const res = await runQuery(payload);
      setOutputData(res?.data?.data);
      if (!res?.data?.data) {
        setError(res?.message?.error || "Failed to run query");
        // setIsSolutionCorrect(false);
      } else {
        setError(null);
      }
      // Set the submitted date to the current time
      setOutSubmittedDate(new Date());
    } catch (error) {
      toast.error(error?.message || "Failed to run query");
    } finally {
      setLoadingQuery(false);
    }
  };

  const handleSubmission = async () => {
    if (!user) {
      toast.error("Please login to submit the solution");
      return;
    }

    setLoadingSubmission(true);
    const payload = {
      questionId: question?.id,
      userQuery: query,
      userId: user?.id,
      timetaken: time,
    };
    try {
      const res = await runSubmission(payload);
      if (res?.data?.correct) {
        setIsSolutionCorrect(true);
        setOutputData(res?.data?.userOutput);
      } else if (!res?.data?.correct) {
        setOutputData(res?.data?.userOutput);
        setIsSolutionCorrect(false);
      }
      if (!res?.data) {
        setError(res?.message?.error || "Failed to run query");
      } else {
        setError(null);
      }
      // Optionally, update the submitted time after a submission as well
      setOutSubmittedDate(new Date());
    } catch (error) {
      toast.error(error?.message || "Failed to run query");
    } finally {
      setLoadingSubmission(false);
    }
  };

  const isOutputData = outputData?.length > 0;
  const isLoading = loadingQuery || loadingSubmission;
  return (
    <div className="bg-[#FAFAFA] h-auto p-3 relative">
      <p className="font-semibold">
        Submitted Output{" "}
        {outSubmittedDate ? dayjs(outSubmittedDate).fromNow() : ""}
      </p>

      <div className="overflow-auto h-[250px]">
        {isOutputData ? (
          <DynamicTable data={outputData} />
        ) : isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Spin spinning tip={"Please wait..."} />
          </div>
        ) : null}
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
        }`}
      >
        <Button onClick={handleRunQuery} type="dashed" loading={loadingQuery}>
          Run Code
        </Button>
        <div className="relative">
          {isTyping ? (
            <img
              src="/assets/icons/dog-play-g.gif"
              alt="dog-play"
              className="mb-[-2px] h-32 object-cover absolute bottom-5"
              draggable={false}
            />
          ) : isSolutionCorrect ? (
            <img
              src="/assets/icons/dog-success.gif"
              alt="dog-success"
              className="mb-[-2px] h-40 object-cover absolute bottom-5"
              draggable={false}
            />
          ) : (!isSolutionCorrect && isOutputData) || error ? (
            <img
              src="/assets/icons/dog-sad.svg"
              alt="dog-play"
              className="-mb-[7px] h-28 object-cover absolute bottom-8"
              draggable={false}
            />
          ) : (
            <img
              src="/assets/icons/dog-play.svg"
              alt="dog-play"
              className="mb-[-2px] h-24 object-cover absolute bottom-8"
              draggable={false}
            />
          )}
          <Button
            onClick={handleSubmission}
            type="primary"
            loading={loadingSubmission}
          >
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
    <CommonTable
      columns={columns}
      dataSource={data}
      rowKey={(record, index) => index}
      pagination={false}
      className="h-[300px] mt-4"
      bordered
    />
  );
};
