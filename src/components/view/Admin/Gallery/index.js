// src/pages/admin/gallery.jsx

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { list ,getUrl} from 'aws-amplify/storage';
import { Row, Col, Card, Modal, Spin, Popconfirm, message } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import AdminLayout from "../"; // adjust import if needed

// Initialize Amplify (if not already configured elsewhere)

const Gallery = () => {
  // State for folder prefixes
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // State for images in the selected folder
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // State for the preview modal
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch unique folder prefixes (first segment before “/” in each key)
  const fetchFolders = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const allItems = await list({
        path:"",
      })
      console.log("Fetched items:", allItems);
      const folderSet = new Set();

      allItems?.items?.forEach((item) => {
        if (item.path.includes("/")) {
          const [folderName] = item.path.split("/");
          folderSet.add(folderName);
        }
      });

      const folderArray = Array.from(folderSet).sort();
      setFolders(folderArray);

      // Auto-select the first folder if none is selected
      if (folderArray.length > 0) {
        setSelectedFolder((prev) => prev || folderArray[0]);
      }
    } catch (err) {
      console.error("Error listing S3 objects:", err);
      message.error("Unable to load gallery folders.");
    } finally {
      setLoadingFolders(false);
    }
  }, []);

  // Fetch images under the selected folder
  const fetchImagesInFolder = useCallback(
    async (folder) => {
      if (!folder) {
        setImages([]);
        return;
      }
      setLoadingImages(true);
      try {
          const folderItems = await list({
        path: `${folder}/`,
        accessLevel: "public",
      })
      console.log("Fetched folder items:", folderItems,folder);
        const imageFiles = folderItems.filter((it) => !it.path.endsWith("/"));

        const urlPromises = imageFiles.map(async (file) => {
          const signedUrl = await Storage.get(file.key, { level: "public" });
          return { key: file.key, url: signedUrl };
        });
        const urlList = await Promise.all(urlPromises);
        setImages(urlList);
      } catch (err) {
        console.error(`Error listing images in S3 at ${folder}/:`, err);
        message.error("Unable to load images for the selected folder.");
      } finally {
        setLoadingImages(false);
      }
    },
    []
  );

  // Load folders on mount
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Whenever selectedFolder changes, reload images
  useEffect(() => {
    fetchImagesInFolder(selectedFolder);
  }, [selectedFolder, fetchImagesInFolder]);

  // Delete a single image from S3
  const handleDeleteImage = useCallback(async (fullKey) => {
    try {
      await Storage.remove(fullKey, { level: "public" });
      setImages((prev) => prev.filter((img) => img.key !== fullKey));
      message.success("Image deleted successfully");
    } catch (err) {
      console.error("Error deleting image:", err);
      message.error("Failed to delete image");
    }
  }, []);

  // Open preview modal
  const openPreview = useCallback((url) => {
    setPreviewUrl(url);
  }, []);

  // Close preview modal
  const closePreview = useCallback(() => {
    setPreviewUrl(null);
  }, []);

  // Memoize folder list UI
  const folderList = useMemo(() => {
    return folders.map((folder) => {
      const isActive = folder === selectedFolder;
      return (
        <div
          key={folder}
          onClick={() => setSelectedFolder(folder)}
          className={`
            px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition
            ${isActive
              ? "bg-blue-100 border border-blue-500 font-semibold"
              : "bg-gray-100 hover:bg-gray-200 border border-transparent"}
          `}
        >
          {folder}
        </div>
      );
    });
  }, [folders, selectedFolder]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Gallery</h1>

      {/* Folder Bar */}
      <div className="mb-6 px-2">
        {loadingFolders ? (
          <Spin tip="Loading folders..." />
        ) : folders.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto">{folderList}</div>
        ) : (
          <div className="text-gray-500 italic">
            No folders found in your S3 bucket.
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div>
        {loadingImages ? (
          <Spin tip="Loading images..." />
        ) : images.length === 0 ? (
          <div className="text-gray-500 italic">
            {selectedFolder
              ? "No images found in this folder."
              : "Select a folder above to view its images."}
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {images.map((img) => (
              <Col key={img.key} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card
                  hoverable
                  bodyStyle={{ padding: 0 }}
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
                      <img
                        alt={img.key}
                        src={img.url}
                        style={{
                          objectFit: "cover",
                          maxHeight: "100%",
                          maxWidth: "100%",
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <EyeOutlined key="view" onClick={() => openPreview(img.url)} />,
                    <Popconfirm
                      key="delete"
                      title="Delete this image?"
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

      {/* Preview Modal */}
      <Modal
        open={!!previewUrl}
        footer={null}
        onCancel={closePreview}
        centered
        bodyStyle={{ padding: 0 }}
        width="50%"
        destroyOnClose
      >
        {previewUrl && (
          <img
            alt="Preview"
            style={{ width: "100%", height: "auto", display: "block" }}
            src={previewUrl}
          />
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Gallery;
