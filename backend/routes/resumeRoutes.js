import express from 'express';
import multer from 'multer';
import { uploadResume } from '../controllers/resumeController.js';

const router = express.Router();

/**
 * Configure Multer with Memory Storage
 * We don't need disk storage for Render/Vercel compatibility
 */
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'), false);
    }
  }
});

/**
 * @route   POST /api/resume/upload
 * @desc    Single resume upload using multer
 */
router.post('/upload', upload.single('resume'), uploadResume);

export default router;
