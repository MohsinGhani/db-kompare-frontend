"use client";

import React from "react";

const RunSQL = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "5px",
        width: "100vw",
        height: "100vh",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Panel 1 */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          overflow: "auto", // Required for native resize to work
          resize: "both", // Allow both horizontal and vertical resizing
          minWidth: "100px",
          minHeight: "100px",
        }}
      >
        Panel 1
      </div>

      {/* Panel 2 */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          overflow: "auto",
          resize: "both",
          minWidth: "100px",
          minHeight: "100px",
        }}
      >
        Panel 2
      </div>

      {/* Panel 3 */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          overflow: "auto",
          resize: "both",
          minWidth: "100px",
          minHeight: "100px",
        }}
      >
        Panel 3
      </div>

      {/* Panel 4 */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          overflow: "auto",
          resize: "both",
          minWidth: "100px",
          minHeight: "100px",
        }}
      >
        Panel 4
      </div>
    </div>
  );
};

export default RunSQL;
