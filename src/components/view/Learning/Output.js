import { useState } from "react";
// import { executeCode } from "../api";
import { Button } from "antd";

const Output = ({ editorRef, language,result }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  //   const runCode = async () => {
  //     const sourceCode = editorRef.current.getValue();
  //     if (!sourceCode) return;
  //     try {
  //       setIsLoading(true);
  //       const { run: result } = await executeCode(language, sourceCode);
  //       setOutput(result.output.split("\n"));
  //       result.stderr ? setIsError(true) : setIsError(false);
  //     } catch (error) {
  //       console.log(error);
  //       toast({
  //         title: "An error occurred.",
  //         description: error.message || "Unable to run code",
  //         status: "error",
  //         duration: 6000,
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
console.log("output", result);
  return (
    <>
      <div
        className="h-[75vh]"
        height="75vh"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        {result
          ? result?.map((line, i) => <p key={i}>{line?.first_name}</p>)
          : 'Opps! No output to display.'}
      </div>
    </>
  );
};
export default Output;


