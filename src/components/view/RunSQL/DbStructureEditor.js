"use client";

import React, { useRef } from "react";
import { Editor } from "@monaco-editor/react";

const DbStructureEditor = () => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Optional: You can add customizations here.
    // For example, if DBML isn't supported out-of-the-box, you can register a custom language:
    monaco.languages.register({ id: "dbml" });
    monaco.languages.setMonarchTokensProvider("dbml", {
      tokenizer: {
        root: [
          [/[A-Z][\w]*/, "type.identifier"],
          // add more rules as needed...
        ],
      },
    });
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <Editor
        width="100%"
        defaultLanguage="dbml" // Change to a custom language id if you register one.
        defaultValue={`// Write your DBML code here

Table users {
id int [pk, increment]
name varchar
}
            
Table posts {
id int [pk, increment]
user_id int [ref: > users.id]
title varchar
}`}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        className="!overflow-hidden !h-full"
      />
    </div>
  );
};

export default DbStructureEditor;
