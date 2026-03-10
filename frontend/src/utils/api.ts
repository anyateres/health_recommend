import apiClient from '../utils/apiClient'
import axios from 'axios'
import { AnalysisResult, ApiResponse } from '../types'

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData()
  formData.append('image', file)

  let response
  try {
    response = await apiClient.post<ApiResponse<AnalysisResult>>(
      '/analyze/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendMessage = (error.response?.data as ApiResponse<AnalysisResult> | undefined)?.error
      throw new Error(backendMessage || error.message || 'Analysis failed')
    }
    throw error
  }

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
