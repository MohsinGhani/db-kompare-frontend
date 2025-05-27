"use client";

import React, { useState, useEffect } from "react";
import { fetchCertificates } from "@/utils/quizUtil";
import { Spin, Row, Col, Card, Typography, Badge, Empty, Button } from "antd";
import { DownloadOutlined, EyeFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";
import CommonLoader from "@/components/shared/CommonLoader";

const { Text, Title } = Typography;

export default function MyCertificates({ user }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const res = await fetchCertificates({ userId: user.id });
        setCertificates(res?.data || []);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError(err.message || "Error fetching certificates");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="relative min-h-[200px] flex items-center justify-center">
        <CommonLoader text="Loading certificates..."/>
      </div>
    );
  }


  if (!certificates.length) {
    return <Empty description="No certificates found." />;
  }

  return (
    <Row gutter={[16, 16]}>
      {certificates.map((cert) => {
        const { id, issueDate, metaData, status, submissionId, userId } = cert;
        const { quizName, score } = metaData || {};
        const formattedDate = dayjs(issueDate).format("DD MMM YYYY");
        const certificateUrl = `${process.env.NEXT_PUBLIC_BUCKET_URL}/CERTIFICATES/${id}-${userId}-${submissionId}.pdf`;

        return (
          <Col key={id} xs={24} sm={12} md={8} lg={8}>
            <div className="border p-3 rounded-md">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/icons/certificate.png"
                  alt="Certificate icon"
                  className="h-14 "
                />
                <div>
                  <p className="font-semibold">{quizName}</p>
                  <p className="text-xs">
                    Score Achieved:{" "}
                    <span className="font-semibold">{score}%</span>
                  </p>
                  <p className="text-xs">
                    Completed On:{" "}
                    <span className="font-semibold">{formattedDate}</span>
                  </p>
                </div>
              </div>
              <Link
                href={certificateUrl}
                target="_blank"
                className="block mt-2"
              >
                <Button
                  className="mt-4 !h-7"
                  type="primary"
                  icon={<EyeFilled />}
                  block
                >
                  View
                </Button>
              </Link>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}
