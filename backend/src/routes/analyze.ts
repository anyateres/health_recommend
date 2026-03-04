import { Router, Request, Response } from 'express'
import { GeminiService } from '../services/gemini.service.js'
import { ApiResponse, AnalysisResult } from '../types/index.js'
import multer from 'multer'
import fs from 'fs/promises'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Analyze image upload
router.post(
  '/image',
  upload.single('image'),
  async (req: Request, res: Response<ApiResponse<AnalysisResult>>) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, error: 'No image provided' })
      }

      const base64Image = req.file.buffer.toString('base64')
      const mimeType = req.file.mimetype || 'image/jpeg'
      const imageData = `data:${mimeType};base64,${base64Image}`

      const result = await GeminiService.analyzeImage(imageData)

      res.json({
        success: true,
        data: result,
        message: 'Image analyzed successfully',
      })
    } catch (error) {
      console.error('Analysis error:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      })
    }
  }
)

// Analyze livestream frame
router.post(
  '/livestream',
  async (req: Request, res: Response<ApiResponse<AnalysisResult>>) => {
    try {
      const { imageData } = req.body

      if (!imageData) {
        return res
          .status(400)
          .json({ success: false, error: 'No image data provided' })
      }

      const result = await GeminiService.analyzeImage(imageData)

      res.json({
        success: true,
        data: result,
        message: 'Frame analyzed successfully',
      })
    } catch (error) {
      console.error('Analysis error:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      })
    }
  }
)

export default router
