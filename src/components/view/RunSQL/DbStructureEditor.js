"use client";

import React, { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import { executeQuery } from "@/utils/runSQL";
import { toast } from "react-toastify";

const DbStructureEditor = ({ dbStructure, user }) => {
  // Keep a copy of the original schema as baseline
  const [baseline] = useState(dbStructure);
  const [query, setQuery] = useState(dbStructure);
  const [error, setError] = useState(null);

  const editorRef = useRef(null);
  const handleEditorWillMount = (monaco) => {
    monaco.languages.registerCompletionItemProvider("pgsql", {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: "SELECT",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "SELECT",
          },
          {
            label: "FROM",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "FROM",
          },
          {
            label: "WHERE",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "WHERE",
          },
          {
            label: "GROUP BY",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "GROUP BY",
          },
          {
            label: "ORDER BY",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "ORDER BY",
          },
          {
            label: "JOIN",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "JOIN",
          },
        ];
        return { suggestions };
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const newQueries = query?.replace(baseline, "").trim();

  const handleRunQuery = async () => {
    try {
      // Compute new SQL queries by removing the baseline (already executed queries)

      if (!newQueries) {
        toast.error("No new queries found.");
        return;
      }

      // Execute only the new queries
      const res = await executeQuery({
        userId: user.id,
        query: newQueries,
      });
      if (!res?.data) {
        setError(res?.message?.error || "Failed to run query");
      }
      // You can update state or notify success here as needed.
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full h-[75%]">
      <Editor
        height={"100%"}
        language="pgsql"
        value={query}
        onChange={(value) => setQuery(value)}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <div className="border-t flex justify-between items-center px-3">
        <p className={`text-red-500 ${!error ? "invisible" : ""} `}>
          Error: {error}
        </p>
        <Button
          onClick={handleRunQuery}
          // disabled={!newQueries}
          className="bg-[#3E53D7] text-white px-4 py-2 rounded-md mt-2 disabled:hover:!text-gray-400 disabled:hover:!border-gray-400"
        >
          Run query
        </Button>
      </div>
    </div>
  );
};

export default DbStructureEditor;
