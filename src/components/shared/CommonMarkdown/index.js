"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
const CommonMarkdown = ({ markdown }) => {
  return (
    <div className="markdown-body overflow-auto !bg-transparent ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};
export default CommonMarkdown;
