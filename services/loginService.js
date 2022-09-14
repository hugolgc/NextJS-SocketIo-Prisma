import { repository } from '../configs'

export const loginService = {
  async findOrCreate(username) {
    try {
      return await repository.user.upsert({
        where: { name: username },
        create: { name: username },
        update: {}
      })
    } catch (e) {
      console.log(e)
      return null
    }
  }
}