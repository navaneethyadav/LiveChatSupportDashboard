import { useEffect, useRef, useState } from "react"

import API from "../services/api"


function LiveChat() {

  const [messages, setMessages] = useState([])

  const [input, setInput] = useState("")

  const socketRef = useRef(null)

  const fullName = localStorage.getItem(
    "full_name"
  )


  useEffect(() => {

    fetchMessages()

    const socket = new WebSocket(
      "ws://127.0.0.1:8000/ws/chat"
    )

    socketRef.current = socket


    socket.onopen = () => {

      console.log("WebSocket connected")
    }


    socket.onmessage = (event) => {

      const parsedMessage = JSON.parse(
        event.data
      )

      setMessages((prev) => [
        ...prev,
        parsedMessage
      ])
    }


    return () => {

      socket.close()
    }

  }, [])


  const fetchMessages = async () => {

    try {

      const response = await API.get(
        "/chat/messages"
      )

      setMessages(response.data)

    } catch (error) {

      console.log(error)
    }
  }


  const sendMessage = () => {

    if (
      !input.trim() ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      return
    }

    const messageData = {
      sender: fullName,
      message: input
    }

    socketRef.current.send(
      JSON.stringify(messageData)
    )

    setInput("")
  }


  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Live Support Chat
      </h2>


      <div className="bg-slate-950 rounded-xl h-[350px] overflow-y-auto p-4 space-y-3">

        {
          messages.map((msg, index) => (

            <div
              key={index}
              className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl w-fit"
            >

              <span className="font-bold">
                {msg.sender}
              </span>

              {": "}

              {msg.message}

            </div>
          ))
        }

      </div>


      <div className="flex gap-3 mt-4">

        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 rounded-xl font-semibold"
        >
          Send
        </button>

      </div>

    </div>
  )
}

export default LiveChat