const express = require('express');
const { AIAgentService } = require('../ai-agent.js');

const router = express.Router();

// Get nutrition advice
router.post('/advice', async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    const advice = await AIAgentService.getNutritionAdvice(query, context);

    res.json({
      success: true,
      data: advice,
      message: 'Advice generated successfully'
    });
  } catch (error) {
    console.error('Advice error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Advice failed'
    });
  }
});

// Analyze meal combination
router.post('/meal-analysis', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        error: 'Ingredients array is required'
      });
    }

    const analysis = await AIAgentService.analyzeMealCombination(ingredients);

    res.json({
      success: true,
      data: analysis,
      message: 'Meal analyzed successfully'
    });
  } catch (error) {
    console.error('Meal analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Meal analysis failed'
    });
  }
});

// Get personalized recommendations
router.post('/personalized', async (req, res) => {
  try {
    const { userProfile, recentAnalysis } = req.body;

    if (!userProfile) {
      return res.status(400).json({
        success: false,
        error: 'User profile is required'
      });
    }

    const recommendations = await AIAgentService.getPersonalizedRecommendations(
      userProfile,
      recentAnalysis
    );

    res.json({
      success: true,
      data: recommendations,
      message: 'Personalized recommendations generated'
    });
  } catch (error) {
    console.error('Personalized recommendations error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Recommendations failed'
    });
  }
});

module.exports = router;