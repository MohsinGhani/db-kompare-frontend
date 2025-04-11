"use client";
import React, { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";

const QueryEditor = ({
  query,
  handleQuery,
  setQuery,
  queryResult,
  queryLoading,
  tables,
}) => {
  const editorRef = useRef(null);
  // Reference to store the registered provider so it won't be re-registered repeatedly.
  const providerRef = useRef(null);
  // A ref to keep the current table suggestions updated.
  const tableSuggestionsRef = useRef([]);

  // Whenever the tables prop changes, update the tableSuggestionsRef.
  useEffect(() => {
    // Here we use 2 as a fallback for the Field constant.
    // If you have access to monaco.languages.CompletionItemKind.Field, you can use that value.
    tableSuggestionsRef.current = (tables || []).map((table) => ({
      label: table,
      kind: 2,
      insertText: table,
    }));
  }, [tables]);

  const handleEditorWillMount = (monaco) => {
    // Register the completion provider only once.
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

          // Combine keyword suggestions with current table suggestions.
          const allSuggestions = [
            ...keywordSuggestions,
            ...tableSuggestionsRef.current,
          ];

          // Create a unique suggestion array (based on label and insertText).
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

  return (
    <div className="w-full h-[78%]">
      <Editor
        height="100%"
        language="pgsql"
        defaultValue={query}
        value={query}
        beforeMount={handleEditorWillMount} // Provider is registered here (once)
        onMount={handleEditorDidMount} // Save reference to editor if needed
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onChange={(value) => setQuery(value)}
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
