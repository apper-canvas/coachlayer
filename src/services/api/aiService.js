const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AIService {
  constructor() {
    // Initialize ApperClient for Edge function calls
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  /**
   * Get AI-powered form guidance for an exercise during workout
   */
  async getFormGuidance(exerciseData) {
    try {
      await delay(800) // Simulate AI processing time
      
      const result = await this.apperClient.functions.invoke(
        import.meta.env.VITE_AI_WORKOUT_ASSISTANT,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'form-guidance',
            data: {
              exerciseName: exerciseData.name_c || exerciseData.name,
              muscleGroups: exerciseData.muscle_groups_c || exerciseData.muscleGroups,
              equipment: exerciseData.equipment_c || exerciseData.equipment,
              instructions: exerciseData.instructions_c || exerciseData.instructions
            }
          })
        }
      )

      if (!result.success) {
        throw new Error(result.message || 'Failed to get form guidance')
      }

      return {
        success: true,
        tips: this.parseFormTips(result.data.content),
        timestamp: result.data.timestamp
      }
    } catch (error) {
      console.error('Error getting form guidance:', error)
      return {
        success: false,
        message: error.message,
        fallbackTips: this.getFallbackFormTips()
      }
    }
  }

  /**
   * Get AI-enhanced exercise instructions and tips
   */
  async getExerciseEnhancement(exerciseData) {
    try {
      await delay(1000) // AI enhancement processing time
      
      const result = await this.apperClient.functions.invoke(
        import.meta.env.VITE_AI_WORKOUT_ASSISTANT,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'exercise-enhancement',
            data: {
              exerciseName: exerciseData.name_c || exerciseData.name,
              currentInstructions: exerciseData.instructions_c || exerciseData.instructions,
              muscleGroups: exerciseData.muscle_groups_c || exerciseData.muscleGroups,
              equipment: exerciseData.equipment_c || exerciseData.equipment
            }
          })
        }
      )

      if (!result.success) {
        throw new Error(result.message || 'Failed to enhance exercise')
      }

      return {
        success: true,
        enhancement: result.data.content,
        timestamp: result.data.timestamp
      }
    } catch (error) {
      console.error('Error enhancing exercise:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }

  /**
   * Get AI-powered progress insights and recommendations
   */
  async getProgressInsights(progressData) {
    try {
      await delay(1200) // Progress analysis processing time
      
      const result = await this.apperClient.functions.invoke(
        import.meta.env.VITE_AI_WORKOUT_ASSISTANT,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'progress-insights',
            data: {
              totalWorkouts: progressData.totalWorkouts,
              currentStreak: progressData.currentStreak,
              thisWeekWorkouts: progressData.thisWeekWorkouts,
              recentWorkouts: progressData.recentWorkouts || 'Mixed training'
            }
          })
        }
      )

      if (!result.success) {
        throw new Error(result.message || 'Failed to get progress insights')
      }

      return {
        success: true,
        insights: result.data.content,
        timestamp: result.data.timestamp
      }
    } catch (error) {
      console.error('Error getting progress insights:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }

  // Helper method to parse form tips from AI response
  parseFormTips(content) {
    // Split content into individual tips, handling various formats
    return content.split(/\n|•|\d\.|\-/).filter(tip => 
      tip.trim().length > 10 && !tip.includes('Tips:') && !tip.includes('Form:')
    ).map(tip => tip.trim()).slice(0, 5)
  }

  // Fallback form tips when AI is unavailable
  getFallbackFormTips() {
    return [
      "Keep your core engaged throughout the movement",
      "Maintain controlled breathing - exhale on exertion",
      "Focus on proper form over speed or weight",
      "Keep your shoulders relaxed and away from your ears",
      "Maintain neutral spine alignment"
    ]
  }
}

export const aiService = new AIService()