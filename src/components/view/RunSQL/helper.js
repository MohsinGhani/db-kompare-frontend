// ==============================
// CONVERT TABLE NAME TO SNAKE CASE
// ==============================
export const sanitizeIdentifier = (identifier) => {
  let sanitized = identifier.replace(/[\.\-]/g, "_");
  if (/^\d/.test(sanitized)) {
    sanitized = "_" + sanitized;
  }
  return sanitized;
};

// ==============================
// PARSE CSV LINE
// ==============================
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // If within quotes and the next char is also a quote, that's an escaped quote.
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote.
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
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
// PARSE PIPELINE
// ==============================
function parsePipeLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // If we're inside quotes and the next char is a quote, treat it as an escaped quote.
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // Skip the next quote.
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "|" && !inQuotes) {
      // Field delimiter encountered outside quotes.
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
// FLATTEN RECORD
// ==============================
function flattenRecord(obj, prefix = "") {
  let result = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const sanitizedKey = sanitizeIdentifier(key);
    const newKey = prefix + sanitizedKey;
    const value = obj[key];

    if (Array.isArray(value)) {
      value.forEach((element, index) => {
        if (typeof element === "object" && element !== null) {
          Object.assign(result, flattenRecord(element, newKey + index));
        } else {
          result[newKey + index] = element;
        }
      });
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenRecord(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

// ==============================
// JSON to PGSQL Conversion
// ==============================
export const jsonToPgsql = (jsonData, tableName = "my_table") => {
  // Normalize data.
  const records = Array.isArray(jsonData) ? jsonData : [jsonData];
  if (records.length === 0) return "";

  // Flatten each record.
  const flatRecords = records.map((record) => flattenRecord(record));

  // Create union of all column names.
  const columnSet = new Set();
  flatRecords.forEach((record) => {
    Object.keys(record).forEach((key) => columnSet.add(key));
  });
  const columns = Array.from(columnSet);

  // Infer PostgreSQL data types for each column.
  const columnTypes = {};
  for (const col of columns) {
    let detectedType = null;
    let maxLength = 0;
    let allIntegers = true;
    for (const record of flatRecords) {
      if (record[col] === null || record[col] === undefined) continue;
      const val = record[col];
      if (typeof val === "number") {
        if (!Number.isInteger(val)) allIntegers = false;
        detectedType = "number";
      } else if (typeof val === "boolean") {
        detectedType = "boolean";
      } else if (typeof val === "string") {
        detectedType = "string";
        maxLength = Math.max(maxLength, val.length);
      } else {
        detectedType = "string";
        const strVal = String(val);
        maxLength = Math.max(maxLength, strVal.length);
      }
    }
    if (detectedType === "number") {
      columnTypes[col] = allIntegers ? "INTEGER" : "NUMERIC";
    } else if (detectedType === "boolean") {
      columnTypes[col] = "BOOLEAN";
    } else if (detectedType === "string") {
      columnTypes[col] =
        maxLength > 0
          ? `VARCHAR(${maxLength > 100 ? maxLength : 100})`
          : "TEXT";
    } else {
      columnTypes[col] = "TEXT";
    }
    // Fallback in case no non-null values were found.
    if (!detectedType) columnTypes[col] = "TEXT";
  }

  const sanitizedTableName = tableName.toLowerCase();
  const columnDefinitions = columns
    .map((col) => `${col} ${columnTypes[col]}`)
    .join(",\n  ");
  const createTableStatement = `CREATE TABLE ${sanitizedTableName} (\n  ${columnDefinitions}\n);\n\n`;

  let insertStatements = "";
  flatRecords.forEach((record) => {
    const values = columns
      .map((col) => {
        let value = record.hasOwnProperty(col) ? record[col] : null;
        if (value === null || value === undefined) return "NULL";
        if (typeof value === "number" || typeof value === "boolean")
          return value;
        if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
        return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
      })
      .join(", ");
    insertStatements += `INSERT INTO ${sanitizedTableName} (${columns.join(
      ", "
    )}) VALUES (${values});\n`;
  });

  const output = `\n${createTableStatement}${insertStatements}`;
  return {
    output,
    createTableStatement,
    insertStatements,
  };
};

// ==============================
// PIPE to PGSQL Conversion
// ==============================
export const pipeToPgsql = (pipeData, tableName = "my_table") => {
  // Sanitize the table name.
  tableName = sanitizeIdentifier(tableName);

  // Split the data into non-empty lines.
  const lines = pipeData.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return "";

  // The first line is the header row.
  const headerLine = lines[0];
  // Parse and sanitize header values.
  const headers = parsePipeLine(headerLine).map(sanitizeIdentifier);

  // Parse the rest of the lines into record objects.
  const records = lines.slice(1).map((line) => {
    const fields = parsePipeLine(line);
    let record = {};
    headers.forEach((header, index) => {
      record[header] = (fields[index] || "").trim();
    });
    return record;
  });
  if (records.length === 0) return "";

  const columns = headers;

  // Infer data types for each column.
  const columnDefinitions = columns
    .map((col) => {
      let allNumeric = true;
      let allInteger = true;
      let allBoolean = true;
      for (const record of records) {
        const value = record[col];
        if (value === null || value === undefined || value === "") continue;
        if (isNaN(Number(value))) {
          allNumeric = false;
          allInteger = false;
        } else {
          const num = Number(value);
          if (!Number.isInteger(num)) {
            allInteger = false;
          }
        }
        const lower = value.toLowerCase();
        if (lower !== "true" && lower !== "false") {
          allBoolean = false;
        }
      }
      let type;
      if (allBoolean) {
        type = "BOOLEAN";
      } else if (allNumeric) {
        type = allInteger ? "INTEGER" : "NUMERIC";
      } else {
        type = "TEXT";
      }
      return `${col} ${type}`;
    })
    .join(",\n  ");

  const sanitizedTableName = tableName.toLowerCase();
  const createTableStatement = `CREATE TABLE ${sanitizedTableName} (\n  ${columnDefinitions}\n);\n\n`;

  let insertStatements = "";
  records.forEach((record) => {
    const values = columns
      .map((col) => {
        let value = record[col];
        if (value === null || value === undefined || value === "")
          return "NULL";
        if (!isNaN(Number(value)) && value.trim() !== "") return value;
        const lower = value.toLowerCase();
        if (lower === "true" || lower === "false") return lower;
        return `'${value.replace(/'/g, "''")}'`;
      })
      .join(", ");
    insertStatements += `INSERT INTO ${sanitizedTableName} (${columns.join(
      ", "
    )}) VALUES (${values});\n`;
  });

  const output = `\n${createTableStatement}${insertStatements}`;
  return {
    output,
    createTableStatement,
    insertStatements,
  };
};

// ==============================
// CSV to PGSQL Conversion
// ==============================
export const csvToPgsql = (csvData, tableName = "my_table") => {
  // Sanitize table name.
  tableName = sanitizeIdentifier(tableName);

  // Split CSV data into non-empty lines.
  const lines = csvData.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return "";

  // Parse header row and sanitize each header.
  const headerLine = lines[0];
  const headers = parseCsvLine(headerLine).map(sanitizeIdentifier);

  // Parse remaining lines into record objects.
  const records = lines.slice(1).map((line) => {
    const fields = parseCsvLine(line);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (fields[index] || "").trim();
    });
    return record;
  });
  if (records.length === 0) return "";

  const columns = headers;

  // Infer data types for each column by scanning all records.
  const columnDefinitions = columns
    .map((col) => {
      let allNumeric = true;
      let allInteger = true;
      let allBoolean = true;
      for (const record of records) {
        const value = record[col];
        if (value === null || value === undefined || value === "") continue;
        if (isNaN(Number(value))) {
          allNumeric = false;
          allInteger = false;
        } else {
          const num = Number(value);
          if (!Number.isInteger(num)) {
            allInteger = false;
          }
        }
        const lower = value.toLowerCase();
        if (lower !== "true" && lower !== "false") {
          allBoolean = false;
        }
      }
      let type;
      if (allBoolean) {
        type = "BOOLEAN";
      } else if (allNumeric) {
        type = allInteger ? "INTEGER" : "NUMERIC";
      } else {
        type = "TEXT";
      }
      return `${col} ${type}`;
    })
    .join(",\n  ");

  // Build CREATE TABLE statement.
  const sanitizedTableName = tableName?.toLowerCase();
  const createTableStatement = `CREATE TABLE ${sanitizedTableName} (\n  ${columnDefinitions}\n);\n\n`;

  // Generate INSERT statements.
  let insertStatements = "";
  records.forEach((record) => {
    const values = columns
      .map((col) => {
        let value = record[col];
        if (value === null || value === undefined || value === "")
          return "NULL";
        if (!isNaN(Number(value)) && value.trim() !== "") return value;
        const lower = value.toLowerCase();
        if (lower === "true" || lower === "false") return lower;
        return `'${value.replace(/'/g, "''")}'`;
      })
      .join(", ");
    insertStatements += `INSERT INTO ${sanitizedTableName} (${columns.join(
      ", "
    )}) VALUES (${values});\n`;
  });

  const output = `\n${createTableStatement}${insertStatements}`;
  return {
    output,
    createTableStatement,
    insertStatements,
  };
};
