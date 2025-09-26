import workoutSessionsData from "@/services/mockData/workoutSessions.json"

class WorkoutSessionService {
  constructor() {
    this.sessions = [...workoutSessionsData]
  }

  async getAll() {
    await this.delay()
    return [...this.sessions]
  }

  async getById(id) {
    await this.delay()
    const session = this.sessions.find(s => s.Id === id)
    return session ? { ...session } : null
  }

  async create(sessionData) {
    await this.delay()
    const newSession = {
      Id: this.getNextId(),
      ...sessionData
    }
    this.sessions.push(newSession)
    return { ...newSession }
  }

  async update(id, sessionData) {
    await this.delay()
    const index = this.sessions.findIndex(s => s.Id === id)
    if (index !== -1) {
      this.sessions[index] = { ...this.sessions[index], ...sessionData }
      return { ...this.sessions[index] }
    }
    throw new Error("Workout session not found")
  }

  async delete(id) {
    await this.delay()
    const index = this.sessions.findIndex(s => s.Id === id)
    if (index !== -1) {
      const deleted = this.sessions.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error("Workout session not found")
  }

  getNextId() {
    return Math.max(...this.sessions.map(s => s.Id), 0) + 1
  }

  delay(ms = 400) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const workoutSessionService = new WorkoutSessionService()