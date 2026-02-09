import multer from 'multer';
import path from 'path';

// Store file in memory buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|ppt|pptx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  // Accept if either extension OR mimetype matches (OR logic)
  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, Word, PowerPoint, and image files are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter
});

export default upload;