"use client"

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function SQLEditor() {
  const [query, setQuery] = useState("");

  const executeQuery = async () => {
    const response = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: query }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div >
      <h2>SQL Editor</h2>
      <Editor
        height="90vh"
        language="sql"
        value={query}
        onChange={(val) => setQuery(val)}
        className="mt-32"
      />
      <button onClick={executeQuery}>Run Query</button>
    </div>
  );
}
