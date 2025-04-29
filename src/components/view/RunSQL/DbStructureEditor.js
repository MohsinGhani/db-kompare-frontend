"use client";

import React, { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "antd";
import { executeQuery, updateFiddle } from "@/utils/runSQL";
import { toast } from "react-toastify";

const INITIAL_COMMENT = `-- Remove the below query to create new Tables...
-- Don't worry, we will keep the old queries for you
`;

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

const mergeDbStructures = (backendStructure, newSql) => {
  const trimmedBackend = backendStructure.trim();
  const trimmedNewSql = newSql.trim();
  return trimmedBackend ? `${trimmedBackend}\n${trimmedNewSql}` : trimmedNewSql;
};

const DbStructureEditor = ({
  user,
  fiddle,
  fetchData,
  dbStructureQuery,
  setdbStructureQuery,
}) => {
  // Use saved backend structure if it exists, otherwise start with the default comment.
  const defaultEditorValue = fiddle?.dbStructure
    ? `${fiddle.dbStructure}`
    : INITIAL_COMMENT;
  const [backendDbStructure, setBackendDbStructure] =
    useState(defaultEditorValue);

  const [error, setError] = useState(null);
  const [tables, setTables] = useState(fiddle?.tables || []);
  const editorRef = useRef(null);

  // Configure Monaco editor autocompletion for common PGSQL keywords.
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

  // Remove the initial comment when extracting new queries.
  const getNewQueries = () => {
    return dbStructureQuery?.dbStructure.replace(INITIAL_COMMENT, "").trim();
  };

  const handleQuery = async () => {
    const newQueries = getNewQueries();
    if (!newQueries) {
      toast.error("No new queries found.");
      return;
    }

    // Extract CREATE TABLE statements and merge them with the existing structure.
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
    try {
      const res = await executeQuery({ userId: user.id, query: newQueries });
      if (!res?.data) {
        setError(res?.message?.error || "Failed to run query");
        toast.error(res?.message?.error || "Failed to run query");
        return;
      }

      // Update tables based on DROP and CREATE statements.
      const dropTableNames = extractDropTableNames(newQueries);
      const createTableNames = extractCreateTableNames(newQueries);
      let updatedTables = [...tables];


      if (dropTableNames.length) {
        updatedTables = updatedTables.filter(
          (table) =>
            !dropTableNames.some(
              (drop) => drop.toLowerCase() === table?.name?.toLowerCase()
            )
        );
      }
      if (createTableNames.length) {
        createTableNames.forEach((tableName) => {
          if (
            !updatedTables.some(
              (table) => table?.name.toLowerCase() === tableName.toLowerCase()
            )
          ) {
            updatedTables.push({
              name: tableName,
              createdAt: new Date().getTime(),
            });
          }
        });
      }

      // Remove CREATE TABLE commands for dropped tables.
      dropTableNames.forEach((tableName) => {
        const createStmtRegex = new RegExp(
          `CREATE\\s+TABLE\\s+${tableName}\\s*\\([^;]+;`,
          "i"
        );
        mergedStructure = mergedStructure.replace(createStmtRegex, "").trim();
      });

      setBackendDbStructure(mergedStructure);

      const payload = {
        ...fiddle,
        dbStructure: mergedStructure,
        tables: updatedTables,
      };
      // await updateFiddle(payload, fiddle?.id);
      await fetchData(fiddle?.id);
      setTables(updatedTables);
      setError("");
      toast.success("Query executed successfully!");
    } catch (err) {
      setError(err?.message || "Error executing query");
      toast.error(err?.message || "Error executing query");
    }
  };

  return (
    <div className="w-full h-[78%]">
      <Editor
        height="100%"
        language="pgsql"
        value={dbStructureQuery?.dbStructure}
        onChange={(value) =>
          setdbStructureQuery((prev) => ({ ...prev, dbStructure: value }))
        }
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
        {error && <p className="text-red-500">Error: {error}</p>}
        <Button
          onClick={handleQuery}
          className="bg-[#3E53D7] text-white px-4 py-2 rounded-md"
        >
          Run query
        </Button>
      </div>
    </div>
  );
};

export default DbStructureEditor;
