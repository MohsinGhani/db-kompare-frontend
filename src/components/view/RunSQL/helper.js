// helpers.js

// ==============================
// CONVERT TABLE NAME TO SNAKE CASE
// ==============================
export const sanitizeIdentifier = (identifier) => {
  let sanitized = identifier.toLowerCase();
  sanitized = sanitized.replace(/[^a-z0-9_]/g, "_");
  sanitized = sanitized.replace(/_+/g, "_");
  sanitized = sanitized.replace(/^_+|_+$/g, "");
  if (/^[0-9]/.test(sanitized)) {
    sanitized = "_" + sanitized;
  }
  if (sanitized === "") {
    sanitized = "table";
  }
  return sanitized;
};

// ==============================
// FETCH-IF-URL UTILITY
// ==============================
async function fetchIfUrl(dataOrUrl, asJson = false) {
  if (typeof dataOrUrl === "string" && /^https?:\/\//.test(dataOrUrl)) {
    const res = await fetch(dataOrUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${dataOrUrl}: ${res.status} ${res.statusText}`
      );
    }
    return asJson ? res.json() : res.text();
  }
  return dataOrUrl;
}

// ==============================
// PARSE DELIMITED LINE (CSV/PSV)
// ==============================
function parseDelimitedLine(line, delimiter) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// ==============================
// FLATTEN RECORD (for JSON)
// ==============================
function flattenRecord(obj, prefix = "") {
  let result = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const sanitizedKey = sanitizeIdentifier(key);
    const newKey = prefix + sanitizedKey;
    const val = obj[key];
    if (Array.isArray(val)) {
      val.forEach((el, idx) => {
        if (el && typeof el === "object") {
          Object.assign(result, flattenRecord(el, `${newKey}${idx}_`));
        } else {
          result[`${newKey}${idx}`] = el;
        }
      });
    } else if (val && typeof val === "object") {
      Object.assign(result, flattenRecord(val, `${newKey}_`));
    } else {
      result[newKey] = val;
    }
  }
  return result;
}

// ==============================
// BUILD PGSQL STATEMENTS
// ==============================
function buildPgSql(tableName, records) {
  if (!records.length) return { output: "" };

  const tbl = sanitizeIdentifier(tableName).toLowerCase();
  const colSet = new Set();
  records.forEach((rec) => Object.keys(rec).forEach((k) => colSet.add(k)));
  const columns = Array.from(colSet);

  // infer types
  const columnTypes = {};
  columns.forEach((col) => {
    let detected = null,
      maxLen = 0,
      allInt = true,
      allBool = true;
    records.forEach((rec) => {
      const v = rec[col];
      if (v == null) return;
      if (typeof v === "boolean") {
        detected = "boolean";
      } else if (typeof v === "number") {
        detected = "number";
        if (!Number.isInteger(v)) allInt = false;
      } else {
        detected = "string";
        const s = String(v);
        maxLen = Math.max(maxLen, s.length);
        if (!["true", "false"].includes(s.toLowerCase())) allBool = false;
      }
    });
    if (detected === "boolean" && allBool) {
      columnTypes[col] = "BOOLEAN";
    } else if (detected === "number") {
      columnTypes[col] = allInt ? "INTEGER" : "NUMERIC";
    } else if (detected === "string") {
      if (maxLen > 0) {
        const len = Math.max(maxLen, 100);
        columnTypes[col] = `VARCHAR(${len})`;
      } else {
        columnTypes[col] = "TEXT";
      }
    } else {
      columnTypes[col] = "TEXT";
    }
  });

  // CREATE TABLE
  const createTableStatement =
    `CREATE TABLE ${tbl} (\n  ` +
    columns.map((c) => `${c} ${columnTypes[c]}`).join(",\n  ") +
    `\n);\n\n`;

  // INSERT statements
  let insertStatements = "";
  records.forEach((rec) => {
    const vals = columns
      .map((col) => {
        const v = rec[col];
        if (v == null || v === "") return "NULL";
        if (typeof v === "boolean") return v;
        if (typeof v === "number") return v;
        const s = String(v);
        if (["true", "false"].includes(s.toLowerCase())) return s.toLowerCase();
        return `'${s.replace(/'/g, "''")}'`;
      })
      .join(", ");
    insertStatements += `INSERT INTO ${tbl} (${columns.join(
      ", "
    )}) VALUES (${vals});\n`;
  });

  return {
    output: createTableStatement + insertStatements,
    createTableStatement,
    insertStatements,
  };
}

// ==============================
// JSON to PGSQL Conversion
// ==============================
export async function jsonToPgsql(input, tableName = "my_table") {
  // if URL, fetch JSON; else assume object/array
  const jsonData = await fetchIfUrl(input, true);
  const raw = Array.isArray(jsonData) ? jsonData : [jsonData];
  const records = raw.map((o) => flattenRecord(o));
  return buildPgSql(tableName, records);
}

// ==============================
// DELIMITED to PGSQL Conversion
// ==============================
export async function delimitedToPgsql(
  input,
  tableName = "my_table",
  delimiter = ","
) {
  // if URL, fetch text; else assume raw CSV/PSV string
  const rawData = await fetchIfUrl(input, false);
  const lines = String(rawData)
    .split("\n")
    .filter((l) => l.trim() !== "");
  if (!lines.length) return { output: "" };

  const headers = parseDelimitedLine(lines.shift(), delimiter).map(
    sanitizeIdentifier
  );
  const records = lines.map((line) => {
    const fields = parseDelimitedLine(line, delimiter);
    const rec = {};
    headers.forEach((h, i) => {
      rec[h] = fields[i] !== undefined ? fields[i].trim() : null;
    });
    return rec;
  });

  return buildPgSql(tableName, records);
}

// convenience wrappers
export const csvToPgsql = (dataOrUrl, tableName) =>
  delimitedToPgsql(dataOrUrl, tableName, ",");
export const pipeToPgsql = (dataOrUrl, tableName) =>
  delimitedToPgsql(dataOrUrl, tableName, "|");
