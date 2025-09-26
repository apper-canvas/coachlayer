import workoutPlansData from "@/services/mockData/workoutPlans.json"

class WorkoutPlanService {
  constructor() {
    this.plans = [...workoutPlansData]
  }

  async getAll() {
    await this.delay()
    return [...this.plans]
  }

  async getById(id) {
    await this.delay()
    const plan = this.plans.find(p => p.Id === id)
    return plan ? { ...plan } : null
  }

  async create(planData) {
    await this.delay()
    const newPlan = {
      Id: this.getNextId(),
      ...planData
    }
    this.plans.push(newPlan)
    return { ...newPlan }
  }

  async update(id, planData) {
    await this.delay()
    const index = this.plans.findIndex(p => p.Id === id)
    if (index !== -1) {
      this.plans[index] = { ...this.plans[index], ...planData }
      return { ...this.plans[index] }
    }
    throw new Error("Workout plan not found")
  }

  async delete(id) {
    await this.delay()
    const index = this.plans.findIndex(p => p.Id === id)
    if (index !== -1) {
      const deleted = this.plans.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error("Workout plan not found")
  }

  getNextId() {
    return Math.max(...this.plans.map(p => p.Id), 0) + 1
  }

  delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const workoutPlanService = new WorkoutPlanService()