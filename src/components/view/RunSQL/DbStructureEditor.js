"use client";

import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import { executeQuery, updateFiddle } from "@/utils/runSQL";
import { toast } from "react-toastify";

// Fixed initial comment that remains in the editor.
const INITIAL_COMMENT = `-- Remove the below query to create new Tables...
-- Don't worry, we will keep the old queries for you

`;

// Helper: Extract table names from DROP TABLE commands.
const extractDropTableNames = (sql) => {
  const regex = /DROP\s+TABLE\s+(\w+)/gi;
  const names = [];
  let match;
  while ((match = regex.exec(sql)) !== null) {
    if (match[1]) {
      names.push(match[1]);
    }
  }
  return names;
};

// Helper: Extract table names from CREATE TABLE commands.
const extractCreateTableNames = (sql) => {
  const regex = /CREATE\s+TABLE\s+(\w+)/gi;
  const names = [];
  let match;
  while ((match = regex.exec(sql)) !== null) {
    if (match[1]) {
      names.push(match[1]);
    }
  }
  return names;
};

// Helper: Merge existing backend structure with new CREATE queries.
const mergeDbStructures = (backendStructure, newSql) => {
  const trimmedBackend = backendStructure.trim();
  const trimmedNewSql = newSql.trim();
  return trimmedBackend ? `${trimmedBackend}\n${trimmedNewSql}` : trimmedNewSql;
};

const DbStructureEditor = ({ user, fiddle, fetchData }) => {
  // Combine the initial comment and existing DB structure.
  const defaultEditorValue =
    INITIAL_COMMENT + (fiddle?.dbStructure ? "\n" + fiddle.dbStructure : "");
  const initialBackendStructure = fiddle?.dbStructure || "";

  const [query, setQuery] = useState(defaultEditorValue);
  const [backendDbStructure, setBackendDbStructure] = useState(
    initialBackendStructure
  );
  const [error, setError] = useState(null);
  const [tables, setTables] = useState(fiddle?.tables || []);
  const editorRef = useRef(null);

  useEffect(() => {
    // Update editor content if fiddle changes.
    setQuery(defaultEditorValue);
  }, [fiddle, defaultEditorValue]);

  // Monaco completion provider for pgsql keywords.
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

  // Get all new queries (ignoring the fixed comment) from the editor.
  const getNewQueries = () => {
    return query.replace(INITIAL_COMMENT, "").trim();
  };

  // Main handler for query execution.
  const handleQuery = async () => {
    // Get the full set of queries from the editor.
    const newQueries = getNewQueries();
    if (!newQueries) {
      toast.error("No new queries found.");
      return;
    }

    // Extract only CREATE TABLE statements from the new queries.
    const createTableStatements =
      newQueries.match(/CREATE\s+TABLE\s+\w+\s*\([^;]+\);/gi) || [];
    const createQueriesOnly = createTableStatements.join("\n").trim();

    let mergedStructure = backendDbStructure;
    if (createQueriesOnly) {
      mergedStructure = mergeDbStructures(
        backendDbStructure,
        createQueriesOnly
      );
    }

    console.log("Executing queries:", newQueries);

    // Execute the entire newQueries (including CREATE, INSERT, etc.).
    try {
      const res = await executeQuery({
        userId: user.id,
        query: newQueries,
      });
      if (!res?.data) {
        setError(res?.message?.error || "Failed to run query");
        toast.error(res?.message?.error || "Failed to run query");
        return;
      }

      // Extract table names from DROP and CREATE statements.
      const dropTableNames = extractDropTableNames(newQueries);
      const createTableNames = extractCreateTableNames(newQueries);

      // Update the table list by removing dropped tables and adding new ones.
      let updatedTables = [...tables];
      if (dropTableNames.length) {
        updatedTables = updatedTables.filter(
          (table) =>
            !dropTableNames.some(
              (drop) => drop.toLowerCase() === table.toLowerCase()
            )
        );
      }
      if (createTableNames.length) {
        createTableNames.forEach((tableName) => {
          if (
            !updatedTables.some(
              (table) => table.toLowerCase() === tableName.toLowerCase()
            )
          ) {
            updatedTables.push(tableName);
          }
        });
      }

      // Remove CREATE TABLE statements corresponding to dropped tables.
      dropTableNames.forEach((tableName) => {
        // Regex to match CREATE TABLE statement including its columns until the semicolon.
        const createStmtRegex = new RegExp(
          `CREATE\\s+TABLE\\s+${tableName}\\s*\\([^;]+;`,
          "i"
        );
        mergedStructure = mergedStructure.replace(createStmtRegex, "").trim();
      });

      // Update backend DB structure with only the CREATE queries.
      setBackendDbStructure(mergedStructure);
      const payload = {
        ...fiddle,
        dbStructure: mergedStructure,
        tables: updatedTables,
        createTableStatement: null,
      };
      await updateFiddle(payload, fiddle?.id);
      await fetchData(fiddle?.id);
      setTables(updatedTables);

      // Only update the editor content on success.
      setQuery(
        INITIAL_COMMENT + (mergedStructure ? "\n" + mergedStructure : "")
      );
      toast.success("Query executed!");
    } catch (err) {
      // On error, do not reset editor content so the user's input remains.
      setError(err?.message || "Error executing query");
      toast.error(err?.message || "Error executing query");
    }
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
      <div className="border-t flex justify-between items-center px-3 h-max  py-2">
        {error && <p className="text-red-500">Error: {error}</p>}
        <Button
          onClick={handleQuery}
          className="bg-[#3E53D7] text-white px-4 py-2 rounded-md disabled:hover:!text-gray-400 disabled:hover:!border-gray-400"
        >
          Run query
        </Button>
      </div>
    </div>
  );
};

export default DbStructureEditor;
