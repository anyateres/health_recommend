const { GoogleGenerativeAI } = require('@google/generative-ai');
const { config } = require('./config.js');
const { v4: uuidv4 } = require('uuid');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const PREFERRED_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro-vision-latest',
  'gemini-pro-vision',
];

const isModelNotFoundError = (error) => {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('404 Not Found') || message.includes('is not found for API version');
};

const getDiscoveredModels = async () => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${config.geminiApiKey}`
    );

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    const models = Array.isArray(payload?.models) ? payload.models : [];

    return models
      .filter((model) =>
        Array.isArray(model?.supportedGenerationMethods) &&
        model.supportedGenerationMethods.includes('generateContent')
      )
      .map((model) => String(model.name || '').replace(/^models\//, ''))
      .filter(Boolean);
  } catch (error) {
    console.warn('Could not fetch model list, using fallback models only.');
    return [];
  }
};

const getCandidateModels = async () => {
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const discoveredModels = await getDiscoveredModels();

  const combined = [
    configuredModel,
    ...PREFERRED_MODELS,
    ...discoveredModels,
  ].filter(Boolean);

  return [...new Set(combined)];
};

const analyzeImage = async (imageData, mimeType = 'image/jpeg') => {
  try {
    // Convert base64 to Image object
    const imageParts = [
      {
        inlineData: {
          data: imageData.replace(/^data:image\/\w+;base64,/, ''),
          mimeType,
        },
      },
    ];

    const prompt = `You are a nutrition expert analyzing a product package image.

Please analyze this product image and provide:
1. List of detected ingredients
2. Sugar content (total and per serving)
3. Nutrition score (0-100)
4. Nutrition grade (A, B, or C based on score: A=80-100, B=60-79, C=0-59)
5. Grade color (green for A, yellow for B, red for C)
6. Specific recommendations

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "ingredients": [{"name": "ingredient_name", "quantity": "amount", "unit": "g/ml", "sugarContent": 5, "isHighSugar": false}],
  "totalSugar": 25,
  "sugarPerServing": 5,
  "servingSize": "100g",
  "nutritionScore": 85,
  "nutritionGrade": "A",
  "gradeColor": "#4CAF50",
  "recommendations": ["recommendation1", "recommendation2"]
}

Be accurate and focus on nutritional value, sugar content, and overall health benefits.`;

    const candidateModels = await getCandidateModels();
    let result;
    let lastModelError;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent([...imageParts, prompt]);
        break;
      } catch (error) {
        lastModelError = error;
        if (!isModelNotFoundError(error)) {
          throw error;
        }
      }
    }

    if (!result) {
      throw lastModelError || new Error('No compatible Gemini model found for generateContent');
    }

    const text = result.response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysisData = JSON.parse(jsonMatch[0]);

    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ingredients: analysisData.ingredients || [],
      totalSugar: analysisData.totalSugar || 0,
      sugarPerServing: analysisData.sugarPerServing || 0,
      servingSize: analysisData.servingSize || '100g',
      nutritionScore: analysisData.nutritionScore || 50,
      nutritionGrade: analysisData.nutritionGrade || 'C',
      gradeColor: analysisData.gradeColor || '#F44336',
      recommendations: analysisData.recommendations || [],
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

module.exports = { analyzeImage };
