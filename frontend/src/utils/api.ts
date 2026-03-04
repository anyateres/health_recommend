import apiClient from '../utils/apiClient'
import { AnalysisResult, ApiResponse } from '../types'

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await apiClient.post<ApiResponse<AnalysisResult>>(
    '/analyze/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  if (!response.data.success) {
    throw new Error(response.data.error || 'Analysis failed')
  }

  return response.data.data!
}

export const analyzeLivestream = async (imageData: string): Promise<AnalysisResult> => {
  const response = await apiClient.post<ApiResponse<AnalysisResult>>(
    '/analyze/livestream',
    { imageData }
  )

  if (!response.data.success) {
    throw new Error(response.data.error || 'Analysis failed')
  }

  return response.data.data!
}
