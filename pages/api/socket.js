import { Server } from 'socket.io'
import { messageService } from '../../services/messageService'

export default async function socket(req, res) {
  if (res.socket.server.io) return res.end()
  const io = new Server(res.socket.server)
  res.socket.server.io = io

  io.on('connection', socket => {
    socket.on('createMessage', async dto => {
      const message = await messageService.create(dto)
      if (message) io.emit('addMessage', message)
    })
  })

  res.end()
}