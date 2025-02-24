"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
const CommonMarkdown = ({ markdown }) => {
  return (
    <div className="markdown-body !bg-transparent container mx-auto p-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};
export default CommonMarkdown;
