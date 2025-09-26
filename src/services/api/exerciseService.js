import { toast } from "react-toastify"

class ExerciseService {
  constructor() {
    this.tableName = "exercise_c"
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
          {"field": {"Name": "muscle_groups_c"}},
          {"field": {"Name": "equipment_c"}},
          {"field": {"Name": "instructions_c"}},
          {"field": {"Name": "difficulty_c"}}
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
      console.error("Error fetching exercises:", error?.response?.data?.message || error)
      toast.error("Failed to load exercises")
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
          {"field": {"Name": "muscle_groups_c"}},
          {"field": {"Name": "equipment_c"}},
          {"field": {"Name": "instructions_c"}},
          {"field": {"Name": "difficulty_c"}}
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(exerciseData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          name_c: exerciseData.name_c,
          description_c: exerciseData.description_c,
          muscle_groups_c: exerciseData.muscle_groups_c,
          equipment_c: exerciseData.equipment_c,
          instructions_c: exerciseData.instructions_c,
          difficulty_c: exerciseData.difficulty_c
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
          console.error(`Failed to create ${failed.length} exercises: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Exercise created successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error creating exercise:", error?.response?.data?.message || error)
      toast.error("Failed to create exercise")
      return null
    }
  }

  async update(id, exerciseData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: id,
          name_c: exerciseData.name_c,
          description_c: exerciseData.description_c,
          muscle_groups_c: exerciseData.muscle_groups_c,
          equipment_c: exerciseData.equipment_c,
          instructions_c: exerciseData.instructions_c,
          difficulty_c: exerciseData.difficulty_c
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
          console.error(`Failed to update ${failed.length} exercises: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Exercise updated successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error updating exercise:", error?.response?.data?.message || error)
      toast.error("Failed to update exercise")
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
          console.error(`Failed to delete ${failed.length} exercises: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Exercise deleted successfully")
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error deleting exercise:", error?.response?.data?.message || error)
      toast.error("Failed to delete exercise")
      return false
    }
  }
}

export const exerciseService = new ExerciseService()