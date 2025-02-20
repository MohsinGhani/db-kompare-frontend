import { Col, Grid, Row } from "antd";
import React from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

const Questions = () => {
  return (
    <div className="pt-28 container">
      <Row gutter={[16]}>
        <Col xs={24} md={6}>
          <LeftPanel />
        </Col>
        <Col xs={24} md={18}>
          <RightPanel />
        </Col>
      </Row>
    </div>
  );
};

export default Questions;
