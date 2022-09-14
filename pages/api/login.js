import { loginService } from '../../services/loginService'

export default async function login(req, res) {
  if (req.method !== 'POST') return
  const { username } = JSON.parse(req.body)
  const user = await loginService.findOrCreate(username)
  res.status(200).json(user)
}