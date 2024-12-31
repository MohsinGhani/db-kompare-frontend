"use client";

import React, { useState, useEffect } from "react";
import { message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import uploadFile from "@/../public/assets/icons/uploadFile.svg";
import Image from "next/image";

const { Dragger } = Upload;

const ImageUploader = ({ onImageUpload, initialImageUrl }) => {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialImageUrl) {
      setFile(initialImageUrl);
    }
  }, [initialImageUrl]);

  const props = {
    name: "file",
    accept: "image/*",
    multiple: false,
    beforeUpload: (file) => {
      const isImage = file.type === "image/jpeg" || file.type === "image/png";
      if (!isImage) {
        message.error("You can only upload JPG/PNG file!");
      }

      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        message.error("Image must be smaller than 3MB!");
      }

      return isImage && isLt3M;
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        const uploadedFile = info.file.originFileObj;
        const previewUrl = URL.createObjectURL(uploadedFile);
        setFile(previewUrl);
        onImageUpload(uploadedFile);
      } else if (status === "error") {
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
            className="block h-[220px] bg-white border border-gray-300 rounded-lg border-dashed max-w-[500px]"
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
        <div className="group relative max-w-[500px]">
          <img
            src={file}
            alt="Uploaded"
            className="aspect-[2/1] w-full rounded-[10px] transition-transform duration-300 group-hover:brightness-80 inline"
          />

          <div className="absolute inset-0 aspect-[2/1] h-auto w-full rounded-[10px] bg-black opacity-0 transition-opacity group-hover:opacity-50"></div>
          <ImgCrop rotationSlider aspect={4 / 2}>
            <Upload {...props} showUploadList={false}>
              <div
                className="absolute left-1/2 top-[45%] transform -translate-x-1/2 -translate-y-1/2 
                           cursor-pointer rounded bg-white px-4 py-2 text-black 
                           opacity-0 transition-opacity duration-300 
                           group-hover:opacity-100 hover:bg-gray-100 "
              >
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
