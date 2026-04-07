import pkg from 'pdf-parse';
const pdf = pkg;
import { parseResumeContent } from '../utils/resumeParser.js';

/**
 * @desc    Upload and Process Resume
 * @route   POST /api/resume/upload
 * @access  Public
 */
export const uploadResume = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file (PDF or TXT)' });
    }

    let extractedText = '';

    // 2. Extract text from file based on mimetype
    if (req.file.mimetype === 'application/pdf') {
      try {
        const data = await pdf(req.file.buffer);
        extractedText = data.text;
      } catch (pdfErr) {
        console.error('PDF Parse Error:', pdfErr);
        return res.status(500).json({ success: false, message: 'Error extracting text from PDF' });
      }
    } else if (req.file.mimetype === 'text/plain') {
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file type. Please upload PDF or TXT' });
    }

    // 3. Simple validation for extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(422).json({ success: false, message: 'Could not extract any text from the resume' });
    }

    // 4. Pass text to parser utility
    const parsedData = parseResumeContent(extractedText);

    // 5. Enhance with metadata
    const responseData = {
      ...parsedData,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      processedAt: new Date()
    };

    // 6. Return structured JSON
    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Resume Upload Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing resume',
      error: error.message
    });
  }
};
