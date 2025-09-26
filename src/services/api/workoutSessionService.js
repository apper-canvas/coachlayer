import { toast } from "react-toastify"

class WorkoutSessionService {
  constructor() {
    this.tableName = "workout_session_c"
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
          {"field": {"Name": "plan_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "exercises_data_c"}},
          {"field": {"Name": "user_id_c"}}
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
      console.error("Error fetching workout sessions:", error?.response?.data?.message || error)
      toast.error("Failed to load workout sessions")
      return []
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "plan_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "exercises_data_c"}},
          {"field": {"Name": "user_id_c"}}
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching workout session ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(sessionData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          plan_id_c: sessionData.plan_id_c,
          date_c: sessionData.date_c,
          duration_c: sessionData.duration_c,
          completed_c: sessionData.completed_c,
          exercises_data_c: sessionData.exercises_data_c,
          user_id_c: sessionData.user_id_c
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
          console.error(`Failed to create ${failed.length} workout sessions: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Workout session created successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error creating workout session:", error?.response?.data?.message || error)
      toast.error("Failed to create workout session")
      return null
    }
  }

  async update(id, sessionData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: id,
          plan_id_c: sessionData.plan_id_c,
          date_c: sessionData.date_c,
          duration_c: sessionData.duration_c,
          completed_c: sessionData.completed_c,
          exercises_data_c: sessionData.exercises_data_c,
          user_id_c: sessionData.user_id_c
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
          console.error(`Failed to update ${failed.length} workout sessions: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Workout session updated successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error updating workout session:", error?.response?.data?.message || error)
      toast.error("Failed to update workout session")
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
          console.error(`Failed to delete ${failed.length} workout sessions: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Workout session deleted successfully")
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error deleting workout session:", error?.response?.data?.message || error)
      toast.error("Failed to delete workout session")
      return false
    }
  }
}

export const workoutSessionService = new WorkoutSessionService()