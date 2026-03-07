export interface AnalysisResult {
  id: string
  timestamp: string
  ingredients: Ingredient[]
  totalSugar: number
  sugarPerServing: number
  nutritionScore: number
  nutritionGrade: 'A' | 'B' | 'C'
  gradeColor: string
  recommendations: string[]
  servingSize: string
}

export interface Ingredient {
  name: string
  quantity: string
  unit: string
  sugarContent?: number
  isHighSugar: boolean
}

export interface HealthProfile {
  age: number
  gender: string
  insulinResistanceLevel: 'mild' | 'moderate' | 'severe'
  targetSugarIntake: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
