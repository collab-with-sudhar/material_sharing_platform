import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import r2Client from '../config/r2.js';
import path from 'path';

// Upload File
export const uploadFileToR2 = async (file, folder = 'uploads') => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await r2Client.send(command);

  return {
    fileURL: `${process.env.R2_PUBLIC_URL}/${fileName}`,
    fileKey: fileName
  };
};

// Delete File
export const deleteFileFromR2 = async (fileKey) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
  });

  await r2Client.send(command);
};