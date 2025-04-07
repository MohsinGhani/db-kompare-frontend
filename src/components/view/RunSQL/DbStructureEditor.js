"use client";

import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import { executeQuery, updateFiddle } from "@/utils/runSQL";
import { toast } from "react-toastify";

const DbStructureEditor = ({ user, fiddle, fetchData }) => {
  // Fixed comment that remains in the editor as instructions.
  const initialComment = `-- Remove the below query to create new Tables...
-- Don't worry, we will keep the old queries for you

`;

  // For the editor, combine the comment with any existing dbStructure.
  const defaultEditorValue =
    initialComment + (fiddle?.dbStructure ? "\n" + fiddle.dbStructure : "");
  // The backend dbStructure should NOT include the initial comment.
  const initialBackendStructure = fiddle?.dbStructure || "";

  useEffect(() => {
    if (defaultEditorValue) {
      setQuery(defaultEditorValue);
    }
  }, [fiddle]);
  // baseline remains the fixed comment.
  const [baseline] = useState(initialComment);
  const [query, setQuery] = useState("");
  const [backendDbStructure, setBackendDbStructure] = useState(
    initialBackendStructure
  );
  const [error, setError] = useState(null);
  const [tables, setTables] = useState(fiddle?.tables || []);

  const editorRef = useRef(null);

  const handleEditorWillMount = (monaco) => {
    monaco.languages.registerCompletionItemProvider("pgsql", {
      provideCompletionItems: () => {
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

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Computes the new SQL (anything typed after the fixed comment).
  const getNewQueries = () => {
    return query.replace(baseline, "").trim();
  };

  // Extracts table names from CREATE TABLE commands.
  const extractTableNames = (sql) => {
    const tableNames = [];
    const regex = /CREATE\s+TABLE\s+(\w+)/gi;
    let match;
    while ((match = regex.exec(sql)) !== null) {
      if (match[1]) {
        tableNames.push(match[1]);
      }
    }
    return tableNames;
  };

  // Merges the new SQL into the existing backend structure.
  const mergeDbStructures = (backendStructure, newSql) => {
    const trimmedBackend = backendStructure.trim();
    const trimmedNewSql = newSql.trim();
    return trimmedBackend
      ? `${trimmedBackend}\n${trimmedNewSql}`
      : trimmedNewSql;
  };

  const handleQuery = async () => {
    // Extract new queries (ignoring the fixed comment).
    const newQueries = getNewQueries();
    if (!newQueries) {
      toast.error("No new queries found.");
      return;
    }

    // Extract DROP TABLE commands.
    const dropTableRegex = /DROP\s+TABLE\s+(\w+)/gi;
    const dropTableNames = [];
    let match;
    while ((match = dropTableRegex.exec(newQueries)) !== null) {
      if (match[1]) {
        dropTableNames.push(match[1]);
      }
    }

    // Extract CREATE TABLE commands.
    const createTableRegex = /CREATE\s+TABLE\s+(\w+)/gi;
    const createTableNames = [];
    while ((match = createTableRegex.exec(newQueries)) !== null) {
      if (match[1]) {
        createTableNames.push(match[1]);
      }
    }

    // Update the table list:
    // Remove any dropped tables from the list.
    let updatedTables = [...tables];
    if (dropTableNames.length) {
      updatedTables = updatedTables.filter(
        (t) =>
          !dropTableNames.some((drop) => drop.toLowerCase() === t.toLowerCase())
      );
    }
    // Add any new CREATE TABLE names that aren't already in the list.
    if (createTableNames.length) {
      createTableNames.forEach((name) => {
        if (
          !updatedTables.some((t) => t.toLowerCase() === name.toLowerCase())
        ) {
          updatedTables.push(name);
        }
      });
    }

    // For merging the new queries into the backend structure, we only want the CREATE TABLE parts.
    // Remove DROP TABLE commands from newQueries.
    const createQueriesOnly = newQueries.replace(dropTableRegex, "").trim();
    let mergedStructure = backendDbStructure;
    if (createQueriesOnly) {
      mergedStructure = mergeDbStructures(
        backendDbStructure,
        createQueriesOnly
      );
    }

    // Also, for each dropped table, remove its corresponding CREATE TABLE statement from mergedStructure.
    dropTableNames.forEach((tableName) => {
      // This regex matches a CREATE TABLE statement for the given table.
      const createStmtRegex = new RegExp(
        `CREATE\\s+TABLE\\s+${tableName}\\s*\\([^;]+;`,
        "i"
      );
      mergedStructure = mergedStructure.replace(createStmtRegex, "").trim();
    });

    // Update the backend DB structure.
    setBackendDbStructure(mergedStructure);

    // Execute the full newQueries (which include both CREATE and DROP commands) on the backend.
    try {
      const res = await executeQuery({
        userId: user.id,
        query: newQueries,
      });
      if (!res?.data) {
        setError(res?.message?.error || "Failed to run query");
      } else {
        const payload = {
          ...fiddle,
          dbStructure: mergedStructure,
          tables: updatedTables,
        };
        await updateFiddle(payload, fiddle?.id);
        await fetchData();
      }
      toast.success("Query executed!");
    } catch (err) {
      toast.error(err?.message || "Error executing query");
    }

    // Reset the editor content to show only the fixed comment plus the updated backend structure.
    setQuery(initialComment + (mergedStructure ? "\n" + mergedStructure : ""));
    // Update the tables state with the latest list.
    setTables(updatedTables);
  };

  return (
    <div className="w-full h-[78%]">
      <Editor
        height="100%"
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
        {error && <p className="text-red-500">Error: {error}</p>}
        <Button
          onClick={handleQuery}
          className="bg-[#3E53D7] text-white px-4 py-2 rounded-md mt-2 disabled:hover:!text-gray-400 disabled:hover:!border-gray-400"
        >
          Run query
        </Button>
      </div>
    </div>
  );
};

export default DbStructureEditor;
