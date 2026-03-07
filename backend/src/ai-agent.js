const { GoogleGenerativeAI } = require('@google/generative-ai');
const { config } = require('../config.js');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

class AIAgentService {
  static get model() {
    return genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
  }

  static async getNutritionAdvice(query, context) {
    try {
      const contextPrompt = context
        ? `Based on this nutrition analysis: ${JSON.stringify(context)}\n\n`
        : '';

      const prompt = `${contextPrompt}You are a helpful nutrition AI assistant. Answer this question about nutrition and healthy eating: ${query}

Provide practical, evidence-based advice. Keep responses concise but informative.`;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI Agent error:', error);
      throw new Error('Failed to get AI advice');
    }
  }

  static async analyzeMealCombination(ingredients) {
    try {
      const prompt = `Analyze this combination of ingredients for nutritional compatibility and meal balance: ${ingredients.join(', ')}

Return JSON with:
{
  "compatibility": "good|moderate|poor",
  "suggestions": ["suggestion1", "suggestion2"],
  "nutritionalNotes": "brief analysis"
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Meal analysis error:', error);
      return {
        compatibility: 'moderate',
        suggestions: ['Consider balancing with vegetables'],
        nutritionalNotes: 'Unable to analyze combination'
      };
    }
  }

  static async getPersonalizedRecommendations(userProfile, recentAnalysis) {
    try {
      const prompt = `Based on user profile: ${JSON.stringify(userProfile)}
And recent nutrition analysis: ${JSON.stringify(recentAnalysis)}

Provide 3-5 personalized nutrition recommendations. Focus on practical, actionable advice.`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      // Split into recommendations
      return text.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return ['Focus on whole foods', 'Stay hydrated', 'Balance your meals'];
    }
  }
}

module.exports = { AIAgentService };