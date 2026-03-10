import './App.css'
import PhotoUpload from './components/PhotoUpload'
import LivestreamCamera from './components/LivestreamCamera'
import AnalysisResult from './components/AnalysisResult'
import { useState } from 'react'
import { AnalysisResult as AnalysisResultType } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<'photo' | 'livestream'>('photo')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null)

  return (
    <div className="app">
      <header className="header">
        <h1>Health Nutrition Analyzer</h1>
        <p>AI-powered recommendations based on nutrition score</p>
      </header>

      <main className="main">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => setActiveTab('photo')}
          >
            📸 Upload Photo
          </button>
          <button
            className={`tab-btn ${activeTab === 'livestream' ? 'active' : ''}`}
            onClick={() => setActiveTab('livestream')}
          >
            🎥 Livestream
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'photo' && (
            <PhotoUpload onResult={setAnalysisResult} />
          )}
          {activeTab === 'livestream' && (
            <LivestreamCamera onResult={setAnalysisResult} />
          )}
        </div>

        {analysisResult && (
          <AnalysisResult result={analysisResult} />
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Health Recommendation App | Gemini Live Agent Challenge</p>
      </footer>
    </div>
  )
}

export default App
