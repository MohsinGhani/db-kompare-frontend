"use client";
import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";

const QueryEditor = ({
  query, // Parent query (fiddle query) passed in initially
  handleQuery, // Callback to run the query
  queryResult,
  queryLoading,
  tables, // (Optional) table suggestions if needed
}) => {
  // Manage the query locally; initial value is the parent's query.
  const [localQuery, setLocalQuery] = useState(query);

  // If the parent query changes (e.g. when the fiddle is fetched/refreshed),
  // update the local state.
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const editorRef = useRef(null);
  // Reference for autocompletion provider; used if you need table suggestions.
  const providerRef = useRef(null);
  // Ref for table suggestions (if needed).
  const tableSuggestionsRef = useRef([]);

  // (Optional) If you wish to update table suggestions when the tables prop changes.
  useEffect(() => {
    tableSuggestionsRef.current = (tables || []).map((table) => ({
      label: table,
      kind: 2, // Fallback for monaco.languages.CompletionItemKind.Field
      insertText: table,
    }));
  }, [tables]);

  const handleEditorWillMount = (monaco) => {
    providerRef.current = monaco.languages.registerCompletionItemProvider(
      "pgsql",
      {
        provideCompletionItems: (model, position) => {
          // Standard SQL keyword suggestions.
          const keywordSuggestions = [
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
          ];

          // Merge any table suggestions if available.
          const allSuggestions = [
            ...keywordSuggestions,
            ...tableSuggestionsRef.current,
          ];

          // Remove duplicate suggestions.
          const uniqueSuggestions = allSuggestions.filter(
            (suggestion, index, self) =>
              index ===
              self.findIndex(
                (s) =>
                  s.label === suggestion.label &&
                  s.insertText === suggestion.insertText
              )
          );

          return { suggestions: uniqueSuggestions };
        },
      }
    );
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Update local query state as the editor changes.
  const handleEditorChange = (value) => {
    if (value !== undefined) {
      setLocalQuery(value);
    }
  };

  // When the "Run query" button is clicked, trigger handleQuery with the current localQuery.
  const onRunQuery = () => {
    handleQuery(localQuery);
  };

  return (
    <div className="w-full h-[78%]">
      <Editor
        height="100%"
        language="pgsql"
        value={localQuery}
        onChange={handleEditorChange}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <div className="border-t flex justify-between items-center px-3 h-max py-2">
        <div
          className={`${
            !queryResult?.data?.length ? "invisible" : ""
          } border rounded-md p-[2px] px-2 text-[#17A44B]`}
        >
          <CheckOutlined className="!text-sm border rounded-full p-[2px] border-[#17A44B]" />{" "}
          <span className="text-[#17A44B] text-sm">
            {queryResult?.data?.length} rows returned. Executed in{" "}
            {queryResult?.executionTime} ms.
          </span>
        </div>
        <Button
          icon={<CaretRightOutlined />}
          className="bg-[#3E53D7] text-white px-4 py-2 rounded-md"
          onClick={onRunQuery}
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
