import { Col, Grid, Row } from "antd";
import React from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

const Questions = () => {
  return (
    <div className="pt-28 md:pt-36 pb-20 container questions-container">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={9} xl={6}>
          <LeftPanel />
        </Col>
        <Col xs={24} md={15} xl={18}>
          <RightPanel />
        </Col>
      </Row>
    </div>
  );
};

export default Questions;
