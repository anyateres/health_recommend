const express = require('express');
const multer = require('multer');
const { analyzeImage } = require('./gemini.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Analyze image upload
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';
    const imageData = `data:${mimeType};base64,${base64Image}`;

    const result = await analyzeImage(imageData, mimeType);

    res.json({
      success: true,
      data: result,
      message: 'Image analyzed successfully',
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed',
    });
  }
});

// Analyze livestream frame
router.post('/livestream', async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    const mimeMatch = typeof imageData === 'string' ? imageData.match(/^data:(image\/[^;]+);base64,/) : null;
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const result = await analyzeImage(imageData, mimeType);

    res.json({
      success: true,
      data: result,
      message: 'Frame analyzed successfully',
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed',
    });
  }
});

module.exports = router;
