"use client";
import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import React, { useRef } from "react";

const QueryEditor = () => {
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
        defaultValue={`-- Get all users and related posts
SELECT *
FROM users u
JOIN posts p ON u.id = p.user_id;
`}
        beforeMount={handleEditorWillMount} // Register provider before editor mounts
        onMount={handleEditorDidMount} // Get ref to editor if needed
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <div className="border-t flex justify-between items-center px-3 ">
        <div className="border rounded-md p-[2px] px-2 text-[#17A44B] ">
          <CheckOutlined className="!text-sm border rounded-full p-[2px] border-[#17A44B]" />{" "}
          <span className="text-[#17A44B] text-sm">
            3 rows returned. Executed in 2.634313 ms.
          </span>
        </div>
        <Button
          icon={<CaretRightOutlined />}
          className="bg-[#3E53D7] text-white px-4 py-2 rounded-md mt-2"
        >
          Run query
        </Button>
      </div>
    </div>
  );
};

export default QueryEditor;
