import usersData from "@/services/mockData/users.json"

class UserService {
  constructor() {
    this.users = [...usersData]
  }

  async getAll() {
    await this.delay()
    return [...this.users]
  }

  async getById(id) {
    await this.delay()
    const user = this.users.find(u => u.Id === id)
    return user ? { ...user } : null
  }

  async create(userData) {
    await this.delay()
    const newUser = {
      Id: this.getNextId(),
      ...userData
    }
    this.users.push(newUser)
    return { ...newUser }
  }

  async update(id, userData) {
    await this.delay()
    const index = this.users.findIndex(u => u.Id === id)
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData }
      return { ...this.users[index] }
    }
    throw new Error("User not found")
  }

  async delete(id) {
    await this.delay()
    const index = this.users.findIndex(u => u.Id === id)
    if (index !== -1) {
      const deleted = this.users.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error("User not found")
  }

  getNextId() {
    return Math.max(...this.users.map(u => u.Id), 0) + 1
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const userService = new UserService()