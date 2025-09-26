import exercisesData from "@/services/mockData/exercises.json"

class ExerciseService {
  constructor() {
    this.exercises = [...exercisesData]
  }

  async getAll() {
    await this.delay()
    return [...this.exercises]
  }

  async getById(id) {
    await this.delay()
    const exercise = this.exercises.find(e => e.Id === id)
    return exercise ? { ...exercise } : null
  }

  async create(exerciseData) {
    await this.delay()
    const newExercise = {
      Id: this.getNextId(),
      ...exerciseData
    }
    this.exercises.push(newExercise)
    return { ...newExercise }
  }

  async update(id, exerciseData) {
    await this.delay()
    const index = this.exercises.findIndex(e => e.Id === id)
    if (index !== -1) {
      this.exercises[index] = { ...this.exercises[index], ...exerciseData }
      return { ...this.exercises[index] }
    }
    throw new Error("Exercise not found")
  }

  async delete(id) {
    await this.delay()
    const index = this.exercises.findIndex(e => e.Id === id)
    if (index !== -1) {
      const deleted = this.exercises.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error("Exercise not found")
  }

  getNextId() {
    return Math.max(...this.exercises.map(e => e.Id), 0) + 1
  }

  delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const exerciseService = new ExerciseService()