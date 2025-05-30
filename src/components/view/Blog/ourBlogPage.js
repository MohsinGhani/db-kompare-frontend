"use client";

import React, { useState } from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import Blog from ".";

export default function OurBlogPage() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ContentSection
        heading1="DB Internals"
        paragraph1="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across technical forums, DB-Engines provides a blog"
        imageAlt="blue line"
      >
        <div className="container">
          <Blog />
        </div>
      </ContentSection>
    </div>
  );
}
