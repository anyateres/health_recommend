import './App.css'
import PhotoUpload from './components/PhotoUpload'
import LivestreamCamera from './components/LivestreamCamera'
import AnalysisResult from './components/AnalysisResult'
import { useState, useRef, useEffect } from 'react'
import { AnalysisResult as AnalysisResultType } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<'photo' | 'livestream'>('photo')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (analysisResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [analysisResult])

  return (
    <div className="app">
      <header className="header">
        <h1>Health Nutrition Analyzer</h1>
        <p>AI-powered recommendations based on nutrition score</p>
      </header>

      <main className="main">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'livestream' ? 'active' : ''}`}
            onClick={() => setActiveTab('livestream')}
          >
            🎥 Livestream
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'photo' && (
            <PhotoUpload onResult={setAnalysisResult} onLoadingChange={setIsAnalyzing} onClearResult={() => setAnalysisResult(null)} />
          )}
          {activeTab === 'livestream' && (
            <LivestreamCamera onResult={setAnalysisResult} onLoadingChange={setIsAnalyzing} onClearResult={() => setAnalysisResult(null)} />
          )}
        </div>

        {isAnalyzing && (
          <div className="analysis-loading" aria-live="polite">
            <div className="analysis-spinner" />
            <p>Analyzing your image... please wait</p>
          </div>
        )}

        {analysisResult && (
          <div ref={resultRef}>
            <AnalysisResult result={analysisResult} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Health Recommendation App | Gemini Live Agent Challenge</p>
      </footer>
    </div>
  )
}

export default App
