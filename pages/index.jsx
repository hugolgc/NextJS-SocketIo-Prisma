import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { messageService } from '../services/messageService'

let socket = null

export async function getServerSideProps() {
  const messages = await messageService.findAll()
  return { props: { messagesJSON: JSON.stringify(messages) }}
}

export default function Index({ messagesJSON }) {
  const [messages, setMessages] = useState(JSON.parse(messagesJSON))
  const [user, setUser] = useState(null)
  const [data, setData] = useState({
    username: '',
    value: ''
  })

  useEffect(() => { initSocket() }, [])

  async function initSocket() {
    await fetch('/api/socket')
    socket = io()
    socket.on('addMessage', newMessage => {
      const messagesDto = messages
      if (!messagesDto.find(({ id }) => id === newMessage.id)) messagesDto.push(newMessage)
      setData({...data, value: ''})
      setMessages(messagesDto)
    })
  }

  function handleMessage(e) {
    e.preventDefault()
    if (!user || !data.value.length || data.value.length > 200) return
    socket.emit('createMessage', {
      value: data.value,
      userId: user.id
    })
  }

  async function handleUser(e) {
    e.preventDefault()
    if (!data.username.length || data.username.length > 50) return
    const userDto = await fetch('/api/login', {
      method: 'post',
      body: JSON.stringify({ username: data.username })
    })
    if (!user) setUser(await userDto.json())
  }

  return (
    <main className="bg-neutral-900 text-white tracking-wide">
      <div className="h-screen max-w-lg flex flex-col mx-auto px-4 py-8 space-y-8">
        <ul className="flex-1 space-y-4 overflow-y-auto">
          
          { user && messages.map(message =>
            <li
              key={ message.id }
              className={ `max-w-[90%] px-4 py-3 space-y-1.5 rounded-[4px] ${ message.user.id == user.id ? 'ml-auto bg-emerald-600' : 'bg-neutral-800' }` }
            >
              <p>{ message.value }</p>
              { message.user.id == user.id ? '' : <p className="text-[12px] text-white/50">{ message.user.name }</p> }
            </li>
          )}

        </ul>
        <form
          className="flex-none flex"
          onSubmit={ e => handleMessage(e) }
        >
          <input
            required
            type="text"
            maxLength="200"
            className="flex-1 px-4 py-3 bg-neutral-800 rounded-l-[4px] outline-none"
            onChange={ ({ target }) => setData({...data, value: target.value }) }
            value={ data.value }
          />
          <button
            type="submit"
            className="flex-none px-4 py-3 bg-emerald-600 rounded-[4px]"
          >Envoyer</button>
        </form>
      </div>
      
      { user ? '' :
        <div className="fixed inset-0 flex">
          <form
            className="z-10 w-full max-w-lg flex m-auto p-4 rounded-[4px]"
            onSubmit={ e => handleUser(e) }
          >
            <input
              required
              type="text"
              maxLength="50"
              placeholder="Saisir un nom d'utilisateur"
              className="flex-1 px-4 py-3 bg-neutral-800 rounded-l-[4px] placeholder:text-white/50 outline-none"
              onChange={ ({ target }) => setData({...data, username: target.value }) }
              value={ data.username }
            />
            <button
              type="submit"
              className="flex-none px-4 py-3 bg-emerald-600 rounded-[4px]"
            >Discuter</button>
          </form>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      }

    </main>
  )
}
