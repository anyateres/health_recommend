import { useRef, useState } from 'react'
import { AnalysisResult } from '../types'
import { analyzeImage } from '../utils/api'
import './PhotoUpload.css'

interface PhotoUploadProps {
  onResult: (result: AnalysisResult) => void
  onLoadingChange?: (isLoading: boolean) => void
}

export default function PhotoUpload({ onResult, onLoadingChange }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      fileInputRef.current?.click()
      setError('')
      return
    }

    setLoading(true)
    onLoadingChange?.(true)
    setError('')

    try {
      const result = await analyzeImage(file)
      onResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
      onLoadingChange?.(false)
    }
  }

  return (
    <div className="photo-upload">
      <form onSubmit={handleSubmit}>
        <div className="upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="file-input"
            className="file-input"
            ref={fileInputRef}
          />
          <label htmlFor="file-input" className="file-label">
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="preview-image" />
              </div>
            ) : (
              <div className="upload-placeholder">
                <p>📸 Click to upload or drag and drop</p>
                <p className="text-small">Product package photo</p>
              </div>
            )}
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Analyzing...' : file ? 'Analyze Product' : 'Choose Photo'}
        </button>
      </form>
    </div>
  )
}
