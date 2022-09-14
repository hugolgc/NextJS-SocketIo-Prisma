import { repository } from '../configs'

export const messageService = {
  async create({ value, userId }) {
    try {
      return await repository.message.create({
        data: { value: value, userId: userId },
        include: { user: true }
      })
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findAll() {
    try {
      return await repository.message.findMany({ include: {
        user: true
      }})
    } catch (e) {
      console.log(e)
      return []
    }
  }
}