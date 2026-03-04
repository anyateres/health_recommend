export interface AnalysisResult {
  id: string
  timestamp: string
  ingredients: Ingredient[]
  totalSugar: number
  sugarPerServing: number
  healthScore: number
  recommendations: string[]
  isHealthy: boolean
  servingSize: string
}

export interface Ingredient {
  name: string
  quantity: string
  unit: string
  sugarContent?: number
  isRiskyForInsulinResistance: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
