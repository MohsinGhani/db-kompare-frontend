"use client";
import { executeQuery } from "@/utils/runSQL";
import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import React, { useRef } from "react";
import { toast } from "react-toastify";

const QueryEditor = ({
  query,
  handleQuery,
  setQuery,
  queryResult,
  queryLoading,
}) => {
  const editorRef = useRef(null);

  const handleEditorWillMount = (monaco) => {
    monaco.languages.registerCompletionItemProvider("pgsql", {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: "SELECT",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "SELECT",
            range: undefined,
          },
          {
            label: "FROM",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "FROM",
            range: undefined,
          },
          {
            label: "WHERE",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "WHERE",
            range: undefined,
          },
          {
            label: "GROUP BY",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "GROUP BY",
            range: undefined,
          },
          {
            label: "ORDER BY",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "ORDER BY",
            range: undefined,
          },
        ];

        // Return the suggestions in the format Monaco expects
        return {
          suggestions,
        };
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="w-full h-[75%]">
      {" "}
      <Editor
        height={"100%"}
        language="pgsql"
        // Save query changes to both state and localStorage
        defaultValue={query}
        value={query}
        beforeMount={handleEditorWillMount} // Register provider before editor mounts
        onMount={handleEditorDidMount} // Get ref to editor if needed
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onChange={(value) => {
          setQuery(value);
        }}
      />
      <div className="border-t flex justify-between items-center px-3 ">
        <div
          className={`${
            !queryResult?.data?.length ? "invisible" : ""
          } border rounded-md p-[2px] px-2 text-[#17A44B] `}
        >
          <CheckOutlined className="!text-sm border rounded-full p-[2px] border-[#17A44B]" />{" "}
          <span className="text-[#17A44B] text-sm">
            {queryResult?.data?.length} rows returned. Executed in{" "}
            {queryResult?.executionTime} ms.
          </span>
        </div>
        <Button
          icon={<CaretRightOutlined />}
          className="bg-[#3E53D7] text-white px-4 py-2 rounded-md mt-2"
          onClick={handleQuery}
          loading={queryLoading}
          disabled={queryLoading}
        >
          Run query
        </Button>
      </div>
    </div>
  );
};

export default QueryEditor;
