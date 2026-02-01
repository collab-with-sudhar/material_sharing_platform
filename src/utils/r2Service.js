const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const r2Client = require('../config/r2');
const path = require('path');

// Upload File
const uploadFileToR2 = async (file, folder = 'uploads') => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read' // Only if your bucket allows ACLs, otherwise manage via R2 settings
  });

  await r2Client.send(command);

  return {
    fileURL: `${process.env.R2_PUBLIC_DOMAIN}/${fileName}`,
    fileKey: fileName
  };
};

// Delete File
const deleteFileFromR2 = async (fileKey) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
  });

  await r2Client.send(command);
};

module.exports = { uploadFileToR2, deleteFileFromR2 };