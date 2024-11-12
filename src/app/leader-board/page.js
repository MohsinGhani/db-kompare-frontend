import React from "react";
import ContentSection from "@/components/shared/ContentSection/page";
import DBChart from "@/components/DBChart";

export default function Page() {
  return (
    <div>
      <ContentSection
        heading1="Offer Technology and Software Solution"
        heading2="Offer Technology"
        paragraph1="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across technical forums, DB-Engines provides a comprehensive view of how different database systems are being used and perceived globally. This ranking serves as a valuable resource for anyone looking to understand trends in database technology and the current demand for various DBMS platforms."
        paragraph2="The DB-Engines Ranking is a monthly updated list that evaluates and ranks database management systems based on their popularity. By tracking various metrics such as search engine queries, job postings, and discussions across forums."
        imageAlt="blue line"
      >
        <div className="w-full mt-14">
          <DBChart />
        </div>
      </ContentSection>
    </div>
  );
}
