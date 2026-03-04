const { v4: uuidv4 } = require('uuid');

// Mock Gemini API response for demonstration
// In production, integrate with actual Google Gemini API
const analyzeImage = async (imageData) => {
  try {
    // For demo purposes, return mock analysis
    // In production, call actual Gemini API
    const mockAnalysis = {
      ingredients: [
        { name: 'Sugar', quantity: '25', unit: 'g', sugarContent: 25, isRiskyForInsulinResistance: true },
        { name: 'Corn Syrup', quantity: '12', unit: 'g', sugarContent: 12, isRiskyForInsulinResistance: true },
        { name: 'Flour', quantity: '100', unit: 'g', sugarContent: 0, isRiskyForInsulinResistance: false },
      ],
      totalSugar: 37,
      sugarPerServing: 12,
      servingSize: '100g',
      healthScore: 35,
      isHealthy: false,
      recommendations: [
        'High sugar content - not recommended for insulin resistance',
        'Consider alternative products with less than 10g sugar per serving',
        'Check for hidden sugars in ingredient list',
      ],
    };

    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...mockAnalysis,
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
};

module.exports = { analyzeImage };
