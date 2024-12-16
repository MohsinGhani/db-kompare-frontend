"use client";

import React, { useState } from "react";
import { message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import uploadFile from "@/../public/assets/icons/uploadFile.svg";
import Image from "next/image";

const { Dragger } = Upload;

const ImageUploader = ({ onImageUpload }) => {
  const [file, setFile] = useState(null);

  const props = {
    name: "file",
    accept: "image/*", // Accept images only
    multiple: false, // Ensures only one file can be uploaded at a time
    beforeUpload: (file) => {
      // Restrict file types (only allow JPG, PNG)
      const isImage = file.type === "image/jpeg" || file.type === "image/png";
      if (!isImage) {
        message.error("You can only upload JPG/PNG file!");
      }

      // Restrict file size (example: 3MB limit)
      const isLt3M = file.size / 1024 / 1024 < 3; // 3MB
      if (!isLt3M) {
        message.error("Image must be smaller than 3MB!");
      }

      // Return false to prevent automatic upload if any condition fails
      return isImage && isLt3M;
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        // Handle successful upload
        const uploadedFile = info.file.originFileObj;
        const previewUrl = URL.createObjectURL(uploadedFile);
        setFile(previewUrl);
        onImageUpload(uploadedFile); // Pass the file to parent component
      } else if (status === "error") {
        // Handle error
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div>
      {!file && (
        <ImgCrop rotationSlider aspect={4 / 2}>
          <Dragger
            {...props}
            className="block h-[240px] bg-white border border-gray-300 rounded-lg border-dashed"
          >
            <p className="ant-upload-drag-icon flex justify-center">
              <Image
                src={uploadFile}
                alt="image"
                width={40}
                height={40}
                className="text-center"
              />
            </p>
            <p className="ant-upload-text text-gray-600">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint text-gray-500">JPG/PNG (max. 3MB)</p>
          </Dragger>
        </ImgCrop>
      )}

      {file && (
        <div className="group relative max-w-full">
          <img
            src={file}
            alt="Uploaded"
            className="aspect-[2/1] w-full rounded-[10px]"
          />

          <div className="absolute inset-0 aspect-[2/1] h-auto w-full rounded-[10px] bg-black opacity-0 transition-opacity group-hover:opacity-50"></div>
          <ImgCrop rotationSlider aspect={4 / 2}>
            <Upload {...props} showUploadList={false}>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded bg-white px-4 py-2 text-black opacity-0 transition-opacity group-hover:opacity-100">
                Change Image
              </div>
            </Upload>
          </ImgCrop>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
