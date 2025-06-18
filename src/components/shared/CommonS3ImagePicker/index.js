// 1- This File for picking images from S3 bucket and this is reusable component. 
// 2- It can select single or multiple images based on the `multiple` prop. By default, it allows single selection.
// 3- It fetches folders and images from S3, displays them in a modal, and allows users to select images.



// ——————————————————————————————
//  COMMON S3 IMAGE PICKER FOR SELECTING IMAGES
// ——————————————————————————————


`use client`;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Modal, Row, Col, Card, Spin, Button } from "antd";
import {
  FolderOpenOutlined,
  FolderOpenFilled,
  EyeOutlined,
} from "@ant-design/icons";
import {
  _getListFromS3,
  _getUrlFromS3,
  _getUrlPropertiesFromS3,
} from "@/utils/s3Services";

export default function CommonS3ImagePicker({
  visible,
  onClose,
  onSelect,
  multiple = false,
}) {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // fetch folders
  const fetchFolders = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const res = await _getListFromS3("", {
        subpathStrategy: { strategy: "exclude" },
      });
      const dirs = res.excludedSubpaths || [];
      setFolders(dirs);
      if (!selectedFolder && dirs.length) {
        setSelectedFolder(dirs[0]);
      }
    } catch (err) {
      console.error("Error loading folders:", err);
    } finally {
      setLoadingFolders(false);
    }
  }, [selectedFolder]);

  // fetch images in folder
  const fetchImages = useCallback(async (folder) => {
    if (!folder) {
      setImages([]);
      return;
    }
    setLoadingImages(true);
    try {
      const res = await _getListFromS3(folder, { listAll: true });
      const items = (res.items || []).filter((i) => !i.path.endsWith("/"));
      const imgs = await Promise.all(
        items.map(async (file) => {
          const meta = await _getUrlPropertiesFromS3(file.path);
          const url = await _getUrlFromS3(file.path);
          return { key: file.path, url, meta };
        })
      );
      setImages(imgs);
    } catch (err) {
      console.error("Error loading images:", err);
    } finally {
      setLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    if (visible) fetchFolders();
  }, [visible, fetchFolders]);

  useEffect(() => {
    fetchImages(selectedFolder);
  }, [selectedFolder, fetchImages]);

  // handle click on image
  const handleSelectImage = (img) => {
    if (multiple) {
      setSelectedImages((prev) => {
        const exists = prev.some((i) => i.key === img.key);
        return exists ? prev.filter((i) => i.key !== img.key) : [...prev, img];
      });
    } else {
      setSelectedImages([img]); // reset selection for single select
      onSelect([img]);
      onClose();
    }
  };

  // confirm multi-selection
  const handleConfirm = () => {
    onSelect(selectedImages);
    onClose();
  };

  // Folder list UI
  const folderTabs = useMemo(
    () =>
      folders.map((folder) => {
        const active = folder === selectedFolder;
        return (
          <div
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-4 py-3 w-full md:w-36 flex items-center gap-2 rounded-lg cursor-pointer transition ${
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
    [folders]
  );

  // render preview card
    const renderPreview = (item) => {
    const {
      url,
      meta: { contentType },
    } = item;

    if (contentType.startsWith("image/")) {
      return (
        <img
          alt={item.key}
          src={url}
          style={{ objectFit: "cover", maxHeight: "100%", maxWidth: "100%" }}
          onClick={() => handleSelectImage(item)}
        />
      );
    }
    if (contentType === "application/pdf") {
      return (
        <iframe
          title={item.key}
          src={url}
          style={{ width: "100%", height: 150, border: "none" }}
          onClick={() => handleSelectImage(item)}

        />
      );
    }
    if (contentType.startsWith("video/")) {
      return (
        <video
          src={url}
          controls
          style={{ maxWidth: "100%", maxHeight: 150 }}
          onClick={() => handleSelectImage(item)}

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

  return (
    <Modal
      title={multiple ? "Select Images" : "Select Image"}
      open={visible}
      onCancel={onClose}
      footer={
        multiple && [
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            disabled={!selectedImages.length}
            onClick={handleConfirm}
          >
            Confirm ({selectedImages.length})
          </Button>,
        ]
      }
      width={800}
    >
      <div className="my-2">
        <p className="text-sm font-semibold mb-2">Folders</p>
        {loadingFolders ? (
          <Spin />
        ) : folders.length > 0 ? (
          <div className="flex gap-2 flex-wrap">{folderTabs}</div>
        ) : (
          <div className="text-gray-500 italic">No folders found.</div>
        )}
      </div>

      <p className="text-sm font-semibold my-2 mt-4">Files ({images.length})</p>
      {loadingImages ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[12, 12]}>
          {images.map((img) => (
            <Col key={img.key} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={renderPreview(img)}
                actions={[
                  <EyeOutlined
                    key="view"
                    onClick={() => window.open(img.url, "_blank")}
                  />,
                ]}
              />
            </Col>
          ))}
        </Row>
      )}
    </Modal>
  );
}
