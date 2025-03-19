"use client";

import { Col, Row } from "antd";
import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { useSelector } from "react-redux";

const Questions = () => {
  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: null,
    difficulty: null,
    status: null,
    tags: [],
  });
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const { userDetails } = useSelector((state) => state.auth);
  const user = userDetails?.data?.data;
  return (
    <div className="pt-28 md:pt-36 pb-20 container questions-container">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={9} xl={6}>
          <LeftPanel
            filters={filters}
            setFilters={setFilters}
            filteredQuestions={filteredQuestions}
            setFilteredQuestions={setFilteredQuestions}
            user={user}
          />
        </Col>
        <Col xs={24} md={15} xl={18}>
          <RightPanel
            filters={filters}
            setFilters={setFilters}
            filteredQuestions={filteredQuestions}
            setFilteredQuestions={setFilteredQuestions}
            user={user}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Questions;
