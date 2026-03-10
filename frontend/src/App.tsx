import './App.css'
import PhotoUpload from './components/PhotoUpload'
import LivestreamCamera from './components/LivestreamCamera'
import AnalysisResult from './components/AnalysisResult'
import { useState, useRef, useEffect } from 'react'
import { AnalysisResult as AnalysisResultType } from './types'

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null)
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
        <div className="tab-content">
          <PhotoUpload onResult={setAnalysisResult} />
          <LivestreamCamera onResult={setAnalysisResult} />
        </div>

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
