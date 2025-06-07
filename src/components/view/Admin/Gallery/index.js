// src/pages/admin/gallery.jsx

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { list, getUrl, getProperties, Storage } from "aws-amplify/storage";
import { Row, Col, Card, Modal, Spin, Popconfirm, message, Button } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  FolderOpenFilled,
} from "@ant-design/icons";
import AdminLayout from "../"; // adjust import if needed
import { toast } from "react-toastify";
import Link from "next/link";

// Initialize Amplify (if not already configured elsewhere)
const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

const Gallery = () => {
  // State for folder prefixes
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // State for files in the selected folder
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // State for the preview modal
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  // Fetch unique folder prefixes
  const fetchFolders = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const allItems = await list({ path: "" });
      console.log("Fetched S3 items:", allItems);
      const folderSet = new Set();
      allItems?.items?.forEach((item) => {
        if (item.path.includes("/")) {
          const [folderName] = item.path.split("/");
          folderSet.add(folderName);
        }
      });
      const folderArray = Array.from(folderSet).sort();
      setFolders(folderArray);
      if (folderArray.length > 0) {
        setSelectedFolder((prev) => prev || folderArray[0]);
      }
    } catch (err) {
      console.error("Error listing S3 objects:", err);
      toast.error("Unable to load gallery folders.");
    } finally {
      setLoadingFolders(false);
    }
  }, []);

  // Fetch files under the selected folder
  const fetchImagesInFolder = useCallback(async (folder) => {
    if (!folder) {
      setImages([]);
      return;
    }
    setLoadingImages(true);
    try {
      const folderItems = await list({
        path: `${folder}/`,
        accessLevel: "public",
        options: { subpathStrategy: { strategy: "exclude" }, listAll: true },
      });
      const fileItems = folderItems?.items.filter(
        (it) => !it.path.endsWith("/")
      );

      const urlPromises = fileItems.map(async (file) => {
        const props = await getProperties({ path: file.path });
        const signedUrl = `${BUCKET_URL}/${props.path}`;
        return { key: file.path, url: signedUrl, data: props };
      });
      const urlList = await Promise.all(urlPromises);
      setImages(urlList);
    } catch (err) {
      console.error(`Error listing files in S3 at ${folder}/:`, err);
      message.error("Unable to load files for the selected folder.");
    } finally {
      setLoadingImages(false);
    }
  }, []);

  // Delete a single file from S3
  const handleDeleteImage = useCallback(async (fullKey) => {
    try {
      await Storage.remove(fullKey, { level: "public" });
      setImages((prev) => prev.filter((img) => img.key !== fullKey));
      message.success("File deleted successfully");
    } catch (err) {
      console.error("Error deleting file:", err);
      message.error("Failed to delete file");
    }
  }, []);

  // Open preview modal
  const openPreview = useCallback((url, type) => {
    setPreviewUrl(url);
    setPreviewType(type);
  }, []);

  // Close preview modal
  const closePreview = useCallback(() => {
    setPreviewUrl(null);
    setPreviewType(null);
  }, []);

  // Decide how to render file based on content type
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
          style={{ width: "100%", height: "150px", border: "none" }}
        />
      );
    }
    if (contentType.startsWith("video/")) {
      return (
        <video
          src={url}
          controls
          style={{ maxWidth: "100%", maxHeight: "150px" }}
        />
      );
    }
    // Fallback to download link for other types
    return (
      <div style={{ padding: 16 }}>
        <p>Preview not available for this file type.</p>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download
        </a>
      </div>
    );
  };

  // Memoize folder list UI
  const folderList = useMemo(
    () =>
      folders.map((folder) => {
        const isActive = folder === selectedFolder;
        return (
          <div
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-4 py-6 w-full md:w-56 flex items-center gap-2 rounded-lg cursor-pointer transition ${
              isActive
                ? "bg-blue-100 border-2 border-primary font-semibold"
                : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            {isActive ? (
              <FolderOpenFilled className="text-2xl text-primary" />
            ) : (
              <FolderOpenOutlined className="text-2xl text-primary" />
            )}
            <p className="text-sm text-gray-800">{folder}</p>
          </div>
        );
      }),
    [folders, selectedFolder]
  );

  // Load folders on mount
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Whenever selectedFolder changes, reload files
  useEffect(() => {
    fetchImagesInFolder(selectedFolder);
  }, [selectedFolder, fetchImagesInFolder]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Gallery</h1>

      {/* Folder Bar */}
      <div className="mb-6 px-2">
        <p className="text-lg font-semibold mb-3">Folders</p>
        {loadingFolders ? (
          <Spin tip="Loading folders..." />
        ) : folders.length > 0 ? (
          <div className="flex gap-4 flex-wrap">{folderList}</div>
        ) : (
          <div className="text-gray-500 italic">
            No folders found in your S3 bucket.
          </div>
        )}
      </div>

      {/* File Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold">Files ({images?.length})</p>
          <Button type="primary" size="large" href="/admin/upload">
            Upload Files {selectedFolder && `in ${selectedFolder} Folder`}
          </Button>
        </div>
        {loadingImages ? (
          <Spin tip="Loading files..." />
        ) : images.length === 0 ? (
          <div className="text-gray-500 italic">
            {selectedFolder
              ? "No files found in this folder."
              : "Select a folder above to view its files."}
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {images.map((img) => (
              <Col key={img.key} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card
                  hoverable
                  style={{ padding: 0 }}
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
                    <div className="flex items-center justify-around gap-2">
                      <Link
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-max"
                      >
                        <EyeOutlined key="view" />
                      </Link>
                      <Popconfirm
                        key="delete"
                        title="Delete this file?"
                        onConfirm={() => handleDeleteImage(img.key)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </div>,
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
