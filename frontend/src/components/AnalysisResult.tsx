import { AnalysisResult as AnalysisResultType } from '../types'
import './AnalysisResult.css'

interface AnalysisResultProps {
  result: AnalysisResultType
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="analysis-result">
      <div className="result-header">
        <h2>Analysis Result</h2>
        <div 
          className="grade-badge"
          style={{ backgroundColor: result.gradeColor }}
        >
          Grade {result.nutritionGrade}
        </div>
      </div>

      <div className="result-grid">
        <div className="result-card">
          <h3>Sugar Content</h3>
          <p className="big-number">{result.totalSugar}g</p>
          <p className="small-text">Total per package</p>
          <p className="small-text">{result.sugarPerServing}g per serving</p>
        </div>

        <div className="result-card">
          <h3>Nutrition Score</h3>
          <p className="big-number">{result.nutritionScore}/100</p>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${result.nutritionScore}%`, backgroundColor: result.gradeColor }}
            />
          </div>
        </div>
      </div>

      <div className="ingredients-section">
        <h3>Detected Ingredients</h3>
        <div className="ingredients-list">
          {result.ingredients.map((ingredient, idx) => (
            <div
              key={idx}
              className={`ingredient-item ${
                ingredient.isHighSugar ? 'high-sugar' : ''
              }`}
            >
              <span className="ingredient-name">{ingredient.name}</span>
              <span className="ingredient-qty">
                {ingredient.quantity}
                {ingredient.unit}
              </span>
              {ingredient.isHighSugar && (
                <span className="sugar-badge">🍯 High Sugar</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="recommendations-section">
        <h3>Recommendations</h3>
        <ul className="recommendations-list">
          {result.recommendations.map((rec, idx) => (
            <li key={idx}>💡 {rec}</li>
          ))}
        </ul>
      </div>

      <div className="result-footer">
        <p className="timestamp">
          Analyzed: {new Date(result.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
