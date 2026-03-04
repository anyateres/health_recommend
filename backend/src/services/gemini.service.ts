import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from '../config/index.js'
import { AnalysisResult, Ingredient } from '../types/index.js'
import { v4 as uuidv4 } from 'uuid'

const genAI = new GoogleGenerativeAI(config.geminiApiKey!)

export class GeminiService {
  static async analyzeImage(imageData: string): Promise<AnalysisResult> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      // Convert base64 to Image object
      const imageParts = [
        {
          inlineData: {
            data: imageData.replace(/^data:image\/\w+;base64,/, ''),
            mimeType: 'image/jpeg',
          },
        },
      ]

      const prompt = `You are a nutrition expert analyzing a product package image for someone with insulin resistance.
      
Please analyze this product image and provide:
1. List of detected ingredients
2. Sugar content (total and per serving)
3. Health score (0-100)
4. Whether it's healthy for insulin resistance (true/false)
5. Specific recommendations

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "ingredients": [{"name": "ingredient_name", "quantity": "amount", "unit": "g/ml", "sugarContent": 5, "isRiskyForInsulinResistance": false}],
  "totalSugar": 25,
  "sugarPerServing": 5,
  "servingSize": "100g",
  "healthScore": 65,
  "isHealthy": true,
  "recommendations": ["recommendation1", "recommendation2"]
}

Be accurate and focus on hidden sugars and ingredients problematic for insulin resistance.`

      const result = await model.generateContent([...imageParts, prompt])
      const text = result.response.text()

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const analysisData = JSON.parse(jsonMatch[0])

      return {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ingredients: analysisData.ingredients || [],
        totalSugar: analysisData.totalSugar || 0,
        sugarPerServing: analysisData.sugarPerServing || 0,
        servingSize: analysisData.servingSize || '100g',
        healthScore: analysisData.healthScore || 50,
        isHealthy: analysisData.isHealthy || false,
        recommendations: analysisData.recommendations || [],
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
