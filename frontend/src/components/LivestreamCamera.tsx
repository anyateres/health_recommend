import { useRef, useState, useEffect } from 'react'
import { AnalysisResult } from '../types'
import { analyzeLivestream } from '../utils/api'
import './LivestreamCamera.css'

interface LivestreamCameraProps {
  onResult: (result: AnalysisResult) => void
  onLoadingChange?: (isLoading: boolean) => void
  onClearResult?: () => void
}

export default function LivestreamCamera({ onResult, onLoadingChange, onClearResult }: LivestreamCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState<string>('Waiting for camera...')
  const [capturedImage, setCapturedImage] = useState<string>('')

  const startCamera = async () => {
    try {
      setError('')
      setDebugInfo('Step 1: Starting camera...')
      console.log('Step 1: Starting camera...')
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available. Please ensure:\n1. Page is loaded over HTTPS\n2. Browser supports camera API\n3. You\'re not using a private/incognito window')
      }

      setDebugInfo('Step 2: Camera API available, requesting stream...')
      console.log('Step 2: Camera API available, requesting stream...')

      // Try with back camera first, fall back to any camera
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      }

      setDebugInfo('Step 3: Requesting camera with constraints...')
      console.log('Step 3: Requesting camera with constraints:', constraints)
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Camera request timed out after 10 seconds')), 10000)
      )
      
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia(constraints),
        timeoutPromise,
      ]) as MediaStream
      
      setDebugInfo('Step 4: Camera stream obtained')
      console.log('Step 4: Camera stream obtained:', stream)
      console.log('Step 5: Video tracks:', stream.getVideoTracks())

      if (videoRef.current) {
        setDebugInfo('Step 6: Setting video ref...')
        console.log('Step 6: Setting video ref')
        console.log('Video element exists:', videoRef.current)
        videoRef.current.srcObject = stream
        console.log('Video srcObject set:', videoRef.current.srcObject)
        
        // Mark as streaming immediately - let the video element handle playback
        setDebugInfo('Waiting for video to display...')
        console.log('Step 7: Video stream set, waiting for display')
        
        // Try to play without awaiting
        videoRef.current.play().catch(err => {
          console.warn('Video play warning (expected on some browsers):', err)
        })
        
        // Set streaming after a short delay to ensure DOM is ready
        setTimeout(() => {
          console.log('Setting streaming to true')
          setStreaming(true)
          setDebugInfo('Camera ready!')
          console.log('Step 8: Camera feed ready')
          onClearResult?.()
        }, 500)
      } else {
        console.error('❌ videoRef.current is NULL!')
        setDebugInfo('Error: Video element not found')
        setError('Error: Video element not available')
      }
    } catch (err) {
      console.error('❌ Full error object:', err)
      console.error('❌ Error message:', err instanceof Error ? err.message : String(err))
      console.error('❌ Error name:', err instanceof Error ? err.name : 'unknown')
      
      let errorMsg = '❌ Cannot access camera. Please check permissions.'
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMsg = '❌ Camera permission denied. Please allow camera access in browser settings.'
        } else if (err.name === 'NotFoundError') {
          errorMsg = '❌ No camera found on this device.'
        } else if (err.name === 'NotReadableError') {
          errorMsg = '❌ Camera is already in use by another application.'
        } else if (err.message.includes('timeout')) {
          errorMsg = '❌ Camera request timed out. Try again or check if another app is using the camera.'
        } else {
          errorMsg = `❌ Camera error: ${err.message}`
        }
      }
      
      setDebugInfo(errorMsg)
      setError(errorMsg)
    }
  }

  useEffect(() => {
    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setLoading(true)
    onLoadingChange?.(true)
    setError('')

    try {
      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        throw new Error('Camera is not ready yet. Please wait a moment and try again.')
      }

      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) throw new Error('Cannot get canvas context')

      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx.drawImage(videoRef.current, 0, 0)

      const imageData = canvasRef.current.toDataURL('image/jpeg')
      
      // Stop camera and show captured image
      if (videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
      setStreaming(false)
      setCapturedImage(imageData)
      
      const result = await analyzeLivestream(imageData)
      onResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
      onLoadingChange?.(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setStreaming(false)
    }
  }

  return (
    <div className="livestream-camera">
      {/* Video element always rendered so ref exists */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        controls={false}
        className="video-feed"
        style={{
          width: '100%',
          borderRadius: '8px',
          backgroundColor: '#000',
          display: streaming ? 'block' : 'none',
        }}
      />
      {capturedImage && !streaming && (
        <img src={capturedImage} alt="Captured frame" className="video-feed" style={{ width: '100%', borderRadius: '8px' }} />
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {streaming ? (
        <>
          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button
              onClick={captureAndAnalyze}
              disabled={loading}
              className="capture-btn"
            >
              {loading ? 'Analyzing...' : '📸 Capture & Analyze'}
            </button>
            <button onClick={stopCamera} className="stop-btn">
              Stop Camera
            </button>
          </div>
        </>
      ) : capturedImage ? (
        <div className="button-group">
          <button onClick={() => { setCapturedImage(''); startCamera(); }} className="retry-btn">
            🔄 Capture New Photo
          </button>
        </div>
      ) : (
        <div className="camera-inactive">
          {error ? (
            <>
              <p className="error-text">{error}</p>
              <button onClick={startCamera} className="retry-btn">
                🔄 Try Again
              </button>
            </>
          ) : (
            <>
              <p>{debugInfo}</p>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                This should happen in ~2 seconds...
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
