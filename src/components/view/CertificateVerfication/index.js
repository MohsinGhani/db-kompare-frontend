"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchCertificateById } from "@/utils/quizUtil";
import CommonLoader from "@/components/shared/CommonLoader";
import { pdfjs } from "react-pdf";
import dayjs from "dayjs";
import { Avatar, Skeleton } from "antd";
import CommonNotFound from "@/components/shared/CommonNotFound";
import { CopyOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CertificateVerification = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const response = await fetchCertificateById(id);
        setData(response?.data || {});
      } catch (err) {
        setError(err.message || "Failed to fetch certificate");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen">
        <CommonLoader />
      </div>
    );

  const handleCopyEmail = (email) => {
    if (email) {
      navigator.clipboard
        .writeText(user.email)
        .then(() => {
          toast.success("Email copied to clipboard");
        })
        .catch(() => {
          toast.error("Failed to copy email");
        });
    }
  };

  const { certificate, quiz, user } = data || {};
  const certificateUrl = `${process.env.NEXT_PUBLIC_BUCKET_URL}/CERTIFICATES/${certificate?.id}-${certificate?.userId}-${certificate?.submissionId}.pdf`;

  return (
    <div className="w-full 2xl:px-20 lg:pl-6 px-3 py-20 pt-28">
      {!data ? (
        <div className="flex items-center justify-center flex-col ">
          <CommonNotFound />
          <p className="text-red-600 font-semibold text-4xl text-center">
            Certificate not found.
          </p>
          <p className="italic text-gray-500 text-center">
            There is no certificate of this record.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">{quiz?.name}</h1>
          <section className="mb-6 h-full">
            <div className="flex flex-wrap md:flex-nowrap h-full gap-4 ">
              {/*--------- LEFT DETAILS----------- */}
              <div className=" h-full ">
                {certificateUrl ? (
                  <PdfPageAsImage
                    fileUrl={certificateUrl}
                    scale={0.7}
                    pageNumber={1}
                  />
                ) : (
                  <p className="text-red-600">Certificate URL not available.</p>
                )}
              </div>

              {/*--------- RIGHT DETAILS----------- */}

              <div className="h-full w-full md:w-[40%]">
                {/*--------- USER DETAILS----------- */}
                <div className="bg-[#E5F3FF] p-4 rounded-lg flex items-center justify-between gap-8 h-full">
                  <div className="flex flex-col justify-between gap-2 h-full">
                    <p className="font-bold text-xl">
                      Certificate earned by {user?.name}
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      {user?.email}{" "}
                      <CopyOutlined
                        className="text-primary"
                        onClick={() => handleCopyEmail(user?.email)}
                      />
                    </p>
                    <p className="font-semibold">
                      {dayjs(certificate?.issueDate).format("MMMM DD, YYYY")}
                    </p>
                    <p className="font-semibold">
                      Grade Achieved: {certificate?.metaData?.score}%
                    </p>
                    <p className="text-sm font-normal text-gray-700">
                      <span className="font-semibold text-base text-orange-500">
                        {user?.name}{" "}
                      </span>{" "}
                      account is verified. DB Kompare certifies their successful
                      completion of{" "}
                      <span className="text-green-500 font-semibold">
                        {quiz?.name}
                      </span>
                      .
                    </p>
                  </div>
                  <div>
                    <Avatar className="w-20 h-20 flex items-center justify-center text-2xl bg-primary/80">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                  </div>
                </div>

                {/*--------- WHAT YOU WILL LEARN----------- */}
                {quiz?.description && (
                  <div className="mt-4 bg-white rounded-lg ">
                    <h2 className="text-lg font-semibold mb-1">
                      What You Will Learn
                    </h2>
                    <p className="text-gray-700 text-sm">{quiz.description}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default CertificateVerification;

function PdfPageAsImage({ fileUrl, scale = 1.5, pageNumber = 1 }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileUrl) return;
    let cancelled = false;

    (async () => {
      try {
        // Fetch PDF bytes
        const res = await fetch(fileUrl);
        if (!res.ok)
          throw new Error(`Network response was not ok: ${res.statusText}`);
        const arrayBuffer = await res.arrayBuffer();

        // Load the PDF document
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        // Get the desired page
        const page = await pdf.getPage(pageNumber);

        // Prepare an off-screen canvas
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        // Render page into canvas
        await page.render({ canvasContext: ctx, viewport }).promise;

        // Extract PNG data URL
        if (!cancelled) {
          setImgSrc(canvas.toDataURL("image/png"));
        }
      } catch (err) {
        console.error("Error rendering PDF page as image:", err);
        if (!cancelled) setError("Failed to render PDF page.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fileUrl, scale, pageNumber]);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }
  if (!imgSrc) {
    return <Skeleton.Node active={true} style={{ width: 700, height: 500 }} />;
  }

  return (
    <img
      src={imgSrc}
      alt={`PDF page ${pageNumber} preview`}
      style={{ maxWidth: "100%", height: "auto" }}
      className="rounded-2xl  border border-gray-200"
    />
  );
}
