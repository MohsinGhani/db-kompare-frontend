"use client";

import React, { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";

const DbStructureEditor = () => {
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
          {
            label: "JOIN",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "JOIN",
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
        <Button className="bg-[#3E53D7] text-white px-4 py-2 rounded-md mt-2">
          Run query
        </Button>
      </div>
    </div>
  );
};

export default DbStructureEditor;
