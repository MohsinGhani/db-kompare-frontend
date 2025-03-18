"use client";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Select } from "antd";
import Output from "./Output";

const RightPanel = ({
  question,
  setIsSolutionCorrect,
  isSolutionCorrect,
  user,
  time,
}) => {
  const [query, setQuery] = useState("");
  const editorRef = useRef(null);

  // When the question changes, check localStorage for a saved query for that question.
  useEffect(() => {
    if (question && question.id) {
      const key = `query-${question.id}`;
      const savedQuery = localStorage.getItem(key);
      if (savedQuery) {
        setQuery(savedQuery);
      } else if (question.baseQuery) {
        setQuery(question.baseQuery);
      }
    }
  }, [question]);

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

  const onChangeRuntime = (value) => {
    console.log(`selected ${value}`);
  };

  const selectedOptions = question?.supportedRuntime?.map((item) => ({
    key: item,
    label: item,
  }));

  return (
    <div className="flex flex-col bg-[#EFFAFF] h-full px-6 pt-6 overflow-auto">
      <div className="bg-white rounded-t-lg h-[70%] p-4 overflow-hidden ">
        <div className="flex justify-between items-center pb-2">
          <p className="text-2xl font-bold">Input</p>
          <Select
            defaultValue={"POSTGRES"}
            onChange={onChangeRuntime}
            options={selectedOptions}
          />
        </div>
        <Editor
          height="100%"
          language="pgsql"
          value={query}
          // Save query changes to both state and localStorage
          onChange={(val) => {
            const newQuery = val || "";
            setQuery(newQuery);
            if (question && question.id) {
              localStorage.setItem(`query-${question.id}`, newQuery);
            }
          }}
          beforeMount={handleEditorWillMount} // Register provider before editor mounts
          onMount={handleEditorDidMount} // Get ref to editor if needed
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      <Output
        query={query}
        question={question}
        setIsSolutionCorrect={setIsSolutionCorrect}
        isSolutionCorrect={isSolutionCorrect}
        user={user}
        time={time}
      />
    </div>
  );
};

export default RightPanel;
