"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Row, Col, Card, Spin, Popconfirm, message, Button } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  FolderOpenFilled,
} from "@ant-design/icons";
import AdminLayout from "../"; // adjust if needed
import CommonHeading from "@/components/shared/CommonHeading";
import Link from "next/link";
import {
  _getListFromS3,
  _getUrlFromS3,
  _getUrlPropertiesFromS3,
  _removeFileFromS3,
} from "@/utils/s3Services";
import CommonFileUploadToS3 from "@/components/shared/CommonFileUploadToS3";

const Gallery = () => {
  // Folder state
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // File state
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Fetch top-level folder prefixes
  const fetchFolders = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const res = await _getListFromS3("", {
        subpathStrategy: { strategy: "exclude" },
      });
      const dirs = res.excludedSubpaths || [];
      setFolders(dirs);
      if (!selectedFolder && dirs.length > 0) {
        setSelectedFolder(dirs[0]);
      }
    } catch (error) {
      console.error("Unable to list folders:", error);
      message.error("Failed to load gallery folders.");
    } finally {
      setLoadingFolders(false);
    }
  }, []);

  // Fetch files for current folder
  const fetchImagesInFolder = useCallback(async (folder) => {
    if (!folder) {
      setImages([]);
      return;
    }
    setLoadingImages(true);
    try {
      const res = await _getListFromS3(folder);
      const items = (res.items || []).filter(
        (item) => !item.path.endsWith("/")
      );
      const imgs = await Promise.all(
        items.map(async (file) => {
          const data = await _getUrlPropertiesFromS3(file.path);
          const url = await _getUrlFromS3(file.path);
          return { key: file.path, url, data };
        })
      );
      setImages(imgs);
    } catch (error) {
      console.error(`Unable to list files in ${folder}/:`, error);
      message.error("Failed to load files for selected folder.");
    } finally {
      setLoadingImages(false);
    }
  }, []);

  // Delete a file
  const handleDeleteImage = useCallback(async (key) => {
    try {
      await _removeFileFromS3(key);
      setImages((prev) => prev.filter((img) => img.key !== key));
      message.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error("Unable to delete file.");
    }
  }, []);

  // Render preview based on content type
  const renderFilePreview = (item) => {
    const {
      url,
      data: { contentType },
    } = item;

    if (contentType.startsWith("image/")) {
      return (
        <img
          alt={item.key}
          src={url}
          style={{ objectFit: "cover", maxHeight: "100%", maxWidth: "100%" }}
        />
      );
    }
    if (contentType === "application/pdf") {
      return (
        <iframe
          title={item.key}
          src={url}
          style={{ width: "100%", height: 150, border: "none" }}
        />
      );
    }
    if (contentType.startsWith("video/")) {
      return (
        <video
          src={url}
          controls
          style={{ maxWidth: "100%", maxHeight: 150 }}
        />
      );
    }
    return (
      <div style={{ padding: 16 }}>
        <p>No preview available.</p>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download
        </a>
      </div>
    );
  };

  // Folder list UI
  const folderList = useMemo(
    () =>
      folders.map((folder) => {
        const active = folder === selectedFolder;
        return (
          <div
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-4 py-3 w-full md:w-52 flex items-center gap-2 rounded-lg cursor-pointer transition ${
              active
                ? "border-2 border-primary font-semibold"
                : "hover:bg-gray-200 border border-gray-300"
            }`}
          >
            {active ? (
              <FolderOpenFilled className="text-2xl text-primary" />
            ) : (
              <FolderOpenOutlined className="text-2xl text-primary" />
            )}
            <p className="text-xs text-gray-800">{folder}</p>
          </div>
        );
      }),
    [folders,selectedFolder]
  );

  // Load on mount and when folder changes
  useEffect(() => {
    fetchFolders();
  }, []);
  useEffect(() => {
    fetchImagesInFolder(selectedFolder);
  }, [selectedFolder, fetchImagesInFolder]);

  return (
    <AdminLayout>
      <CommonHeading title="Gallery" />

      {/* Folders */}
      <div className="my-6 px-2">
        <p className="text-lg font-semibold mb-3">Folders</p>
        {loadingFolders ? (
          <Spin tip="Loading folders..." />
        ) : folders.length > 0 ? (
          <div className="flex gap-4 flex-wrap">{folderList}</div>
        ) : (
          <div className="text-gray-500 italic">No folders found.</div>
        )}
      </div>

      {/* Files */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold">Files ({images.length})</p>
          <CommonFileUploadToS3
            path="QUIZZES"
            buttonText="Add Media"
            multiple
            maxFileSize={2 * 1024 * 1024}
            onUploadComplete={(results) => console.log(results)}
          />
        </div>
        {loadingImages ? (
          <Spin tip="Loading files..." />
        ) : images.length === 0 ? (
          <div className="text-gray-500 italic">
            {selectedFolder
              ? "No files in this folder."
              : "Select a folder to view files."}
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {images.map((img) => (
              <Col key={img.key} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card
                  hoverable
                  cover={
                    <div
                      style={{
                        overflow: "hidden",
                        height: 150,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      {renderFilePreview(img)}
                    </div>
                  }
                  actions={[
                    <Link
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      key="view"
                    >
                      <EyeOutlined />
                    </Link>,
                    <Popconfirm
                      key="delete"
                      title="Delete this file?"
                      onConfirm={() => handleDeleteImage(img.key)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined />
                    </Popconfirm>,
                  ]}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </AdminLayout>
  );
};

export default Gallery;
