import { toast } from "react-toastify"

class WorkoutPlanService {
  constructor() {
    this.tableName = "workout_plan_c"
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== "undefined" && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "exercises_c"}},
          {"field": {"Name": "created_by_c"}}
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching workout plans:", error?.response?.data?.message || error)
      toast.error("Failed to load workout plans")
      return []
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "exercises_c"}},
          {"field": {"Name": "created_by_c"}}
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching workout plan ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(planData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          name_c: planData.name_c,
          description_c: planData.description_c,
          difficulty_c: planData.difficulty_c,
          duration_c: planData.duration_c,
          exercises_c: planData.exercises_c,
          created_by_c: planData.created_by_c
        }]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} workout plans: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Workout plan created successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error creating workout plan:", error?.response?.data?.message || error)
      toast.error("Failed to create workout plan")
      return null
    }
  }

  async update(id, planData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: id,
          name_c: planData.name_c,
          description_c: planData.description_c,
          difficulty_c: planData.difficulty_c,
          duration_c: planData.duration_c,
          exercises_c: planData.exercises_c,
          created_by_c: planData.created_by_c
        }]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} workout plans: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Workout plan updated successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error updating workout plan:", error?.response?.data?.message || error)
      toast.error("Failed to update workout plan")
      return null
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [id]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} workout plans: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Workout plan deleted successfully")
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error deleting workout plan:", error?.response?.data?.message || error)
      toast.error("Failed to delete workout plan")
      return false
    }
  }
}

export const workoutPlanService = new WorkoutPlanService()