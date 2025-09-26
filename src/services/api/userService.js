import { toast } from "react-toastify"

class UserService {
  constructor() {
    this.tableName = "user_c"
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
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "fitness_level_c"}},
          {"field": {"Name": "goals_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "avatar_c"}}
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
      console.error("Error fetching users:", error?.response?.data?.message || error)
      toast.error("Failed to load users")
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
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "fitness_level_c"}},
          {"field": {"Name": "goals_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async getCurrentUser() {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "fitness_level_c"}},
          {"field": {"Name": "goals_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "avatar_c"}}
        ],
        pagingInfo: {"limit": 1, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data?.[0] || null
    } catch (error) {
      console.error("Error fetching current user:", error?.response?.data?.message || error)
      return null
    }
  }

  async create(userData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          name_c: userData.name_c,
          email_c: userData.email_c,
          fitness_level_c: userData.fitness_level_c,
          goals_c: userData.goals_c,
          join_date_c: userData.join_date_c,
          avatar_c: userData.avatar_c
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
          console.error(`Failed to create ${failed.length} users: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("User created successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error)
      toast.error("Failed to create user")
      return null
    }
  }

  async update(id, userData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: id,
          name_c: userData.name_c,
          email_c: userData.email_c,
          fitness_level_c: userData.fitness_level_c,
          goals_c: userData.goals_c,
          join_date_c: userData.join_date_c,
          avatar_c: userData.avatar_c
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
          console.error(`Failed to update ${failed.length} users: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Profile updated successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error)
      toast.error("Failed to update profile")
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
          console.error(`Failed to delete ${failed.length} users: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("User deleted successfully")
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error)
      toast.error("Failed to delete user")
      return false
    }
  }
}

export const userService = new UserService()