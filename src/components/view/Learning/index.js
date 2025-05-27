"use client";

import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import Output from "./Output";

export default function SQLEditor() {
  const [query, setQuery] = useState("");
  const editorRef = useRef();
  const [language, setLanguage] = useState("sql");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const executeQuery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: query }),
      });
      const result = await response.json();
      setOutput(result?.data);
    } catch (error) {
      setOutput({ error: "Error executing query." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-32 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">SQL Editor</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* SQL Editor Section */}
          <div className="bg-gray-50 border rounded-xl shadow-inner">
            <Editor
              height="70vh"
              language={"pgsql"}
              value={query}
              onChange={(val) => setQuery(val || "")}
              className="rounded-t-xl"
              onMount={onMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Output Section */}
          <div className="bg-gray-50 border rounded-xl shadow-inner p-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Output</h3>
            {isLoading ? (
              <div className="text-center text-gray-500">Running query...</div>
            ) : output ? (
              <Output editorRef={editorRef} language={language} result={output} />
            ) : (
              <div className="text-gray-400">No output to display.</div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={executeQuery}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
            >
              Run Query
            </button>
            <button
              onClick={() => setQuery("")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition duration-200"
            >
              Clear Editor
            </button>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition duration-200"
          >
            <option value="pgsql">PGSQL</option>
            <option value="javascript">JavaScript</option>
            <option value="json">JSON</option>
          </select>
        </div>
      </div>
    </div>
  );
}
