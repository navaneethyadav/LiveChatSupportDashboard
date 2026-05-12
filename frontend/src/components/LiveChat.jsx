import { useEffect, useRef, useState } from "react"

import API from "../services/api"


function LiveChat() {

  const [messages, setMessages] = useState([])

  const [input, setInput] = useState("")

  const [loading, setLoading] = useState(true)

  const socketRef = useRef(null)

  const fullName = localStorage.getItem(
    "full_name"
  )


  useEffect(() => {

    fetchMessages()

    const socket = new WebSocket(
      "wss://livechatsupportdashboard.onrender.com/ws/chat"
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


    socket.onclose = () => {

      console.log("WebSocket disconnected")
    }


    socket.onerror = (error) => {

      console.log("WebSocket error:", error)
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

    } finally {

      setLoading(false)
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
          loading ? (

            <div className="flex items-center justify-center h-full">

              <div className="text-center">

                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                <p className="text-slate-400">
                  Loading chat...
                </p>

              </div>

            </div>

          ) : messages.length === 0 ? (

            <div className="flex items-center justify-center h-full">

              <div className="text-center">

                <h3 className="text-xl font-semibold mb-2">
                  No Messages Yet
                </h3>

                <p className="text-slate-400">
                  Start the conversation now.
                </p>

              </div>

            </div>

          ) : (

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

          )
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