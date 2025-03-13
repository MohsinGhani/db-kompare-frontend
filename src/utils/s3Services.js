import { compressImage } from "./helper";
import { uploadData, remove } from "aws-amplify/storage";

export const _putFileToS3 = (
  path,
  file,
  maxFileSize,
  contentType = "image/webp"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const image = await compressImage(file, maxFileSize);

      const res = await uploadData({
        path,
        data: image,
        options: {
          contentType,
        },
      }).result;
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
};

export const _removeFileFromS3 = (path) => {
  return new Promise((resolve, reject) => {
    remove({
      path,
    })
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};
