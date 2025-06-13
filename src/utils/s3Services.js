import { compressImage } from "./helper";
import { uploadData, remove, list, getProperties, getUrl } from "aws-amplify/storage";

export const _putFileToS3 = async (
  path,
  file,
  maxFileSize,
  contentType = "image/webp"
) => {
  // 1. Compress the image
  const image = await compressImage(file, maxFileSize);

  // 2. Upload and return the result metadata
  const uploadTask = uploadData({
    path,
    data: image,
    options: { contentType },
  });
  return await uploadTask.result;
};

export const _removeFileFromS3 = async (path) => {
  // Deletes the object at the specified path
  await remove({ path });
};

export const _getListFromS3 = async (path, options = {}) => {
  // Lists all items under the prefix (listAll pages through automatically)
  return await list({
    path,
    options: { listAll: true, ...options },
  });
};

export const _getUrlPropertiesFromS3 = async (path) => {
  // Retrieves metadata without downloading the file
  const res = await getProperties({ path });
  if (!res) {
    throw new Error(`No metadata found for "${path}"`);
  }
  return res;
};

export const _getUrlFromS3 = async (path, options = {}) => {
  // Retrieves a presigned URL for the object
  const res = await getUrl({ path, options });
  if (!res?.url) {
    throw new Error(`No URL returned for "${path}"`);
  }
  return res.url;
};
