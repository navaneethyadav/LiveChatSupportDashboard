import {
  useEffect,
  useRef,
  useState
} from "react"

import API from "../services/api"

import {
  FiSend
} from "react-icons/fi"


function LiveChat() {

  const [messages, setMessages] = useState([])

  const [input, setInput] = useState("")

  const [loading, setLoading] = useState(true)

  const [typingUser, setTypingUser] = useState("")

  const [isConnected, setIsConnected] = useState(false)

  const socketRef = useRef(null)

  const reconnectTimeoutRef = useRef(null)

  const typingTimeoutRef = useRef(null)

  const messagesEndRef = useRef(null)

  const mountedRef = useRef(false)

  const reconnectingRef = useRef(false)

  const fullName = localStorage.getItem(
    "full_name"
  )

  const role = localStorage.getItem(
    "role"
  )

  const email = localStorage.getItem(
    "email"
  )

  const token = localStorage.getItem(
    "token"
  )


  const fetchMessages = async () => {

    try {

      const response = await API.get(
        `/chat/messages?email=${email}&role=${role}`
      )

      setMessages(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }


  const connectWebSocket = () => {

    if (!mountedRef.current) {

      return
    }

    if (!token) {

      console.log("Token not found")

      return
    }

    if (
      socketRef.current &&
      (
        socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING
      )
    ) {

      return
    }

    const WS_BASE_URL =
      window.location.hostname === "localhost"
        ? "ws://127.0.0.1:8000"
        : "wss://livechatsupportdashboard.onrender.com"

    const socket = new WebSocket(
      `${WS_BASE_URL}/ws/chat?token=${token}`
    )

    socketRef.current = socket

    socket.onopen = () => {

      console.log(
        "WebSocket Connected"
      )

      setIsConnected(true)

      reconnectingRef.current = false
    }

    socket.onmessage = (
      event
    ) => {

      const parsedMessage = JSON.parse(
        event.data
      )

      if (
        parsedMessage.is_typing
      ) {

        if (
          parsedMessage.sender !== fullName
        ) {

          setTypingUser(
            parsedMessage.sender
          )

          clearTimeout(
            typingTimeoutRef.current
          )

          typingTimeoutRef.current =
            setTimeout(() => {

              setTypingUser("")

            }, 2000)
        }

        return
      }

      setMessages((prev) => {

        const alreadyExists = prev.some(
          (msg) =>
            msg.id === parsedMessage.id
        )

        if (alreadyExists) {

          return prev
        }

        if (
          role !== "admin" &&
          parsedMessage.email !== email
        ) {

          return prev
        }

        return [
          ...prev,
          parsedMessage
        ]
      })
    }

    socket.onclose = () => {

      console.log(
        "WebSocket Disconnected"
      )

      setIsConnected(false)

      if (!mountedRef.current) {

        return
      }

      if (reconnectingRef.current) {

        return
      }

      reconnectingRef.current = true

      reconnectTimeoutRef.current =
        setTimeout(() => {

          connectWebSocket()

        }, 3000)
    }

    socket.onerror = (
      error
    ) => {

      console.log(
        "WebSocket Error:",
        error
      )
    }
  }


  useEffect(() => {

    if (mountedRef.current) {

      return
    }

    mountedRef.current = true

    fetchMessages()

    connectWebSocket()

    return () => {

      mountedRef.current = false

      clearTimeout(
        reconnectTimeoutRef.current
      )

      clearTimeout(
        typingTimeoutRef.current
      )

      if (socketRef.current) {

        socketRef.current.close()
      }
    }

  }, [])


  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

      behavior: "smooth"

    })

  }, [messages])


  const handleTyping = (
    e
  ) => {

    setInput(
      e.target.value
    )

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {

      socketRef.current.send(
        JSON.stringify({

          message: "",

          status: "Open",

          is_typing: true

        })
      )
    }
  }


  const sendMessage = () => {

    if (
      !input.trim()
    ) {

      return
    }

    if (
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {

      console.log(
        "WebSocket not connected"
      )

      return
    }

    socketRef.current.send(
      JSON.stringify({

        message: input,

        status: "Open",

        is_typing: false

      })
    )

    setInput("")
  }


  const handleKeyDown = (
    e
  ) => {

    if (
      e.key === "Enter"
    ) {

      sendMessage()
    }
  }


  const updateStatus = async (
    messageId,
    newStatus
  ) => {

    try {

      await API.put(
        `/chat/status/${messageId}?status=${newStatus}`
      )

      setMessages((prev) =>

        prev.map((msg) =>

          msg.id === messageId

            ? {
                ...msg,
                status: newStatus
              }

            : msg
        )
      )

    } catch (error) {

      console.log(error)
    }
  }


  const getStatusColor = (
    status
  ) => {

    switch (status) {

      case "Open":
        return "bg-red-500/20 text-red-300 border border-red-500/30"

      case "In Progress":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"

      case "Resolved":
        return "bg-green-500/20 text-green-300 border border-green-500/30"

      case "Closed":
        return "bg-slate-500/20 text-slate-300 border border-slate-500/30"

      default:
        return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
    }
  }


  return (

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl mt-8">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-3xl font-bold text-white">

            Live Support Chat

          </h2>

          <p className="text-slate-400">

            Real-time communication system

          </p>

        </div>

        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
          isConnected
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}>

          {
            isConnected
              ? "Online"
              : "Reconnecting..."
          }

        </div>

      </div>

      <div className="bg-slate-950 rounded-3xl h-[500px] overflow-y-auto p-5 space-y-5 border border-slate-800">

        {
          loading ? (

            <p className="text-slate-400">

              Loading chat...

            </p>

          ) : (

            messages.map((msg) => {

              const isOwnMessage =
                msg.sender === fullName

              return (

                <div
                  key={msg.id}
                  className={`flex ${
                    isOwnMessage
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div className={`max-w-[75%] rounded-3xl p-4 border ${
                    isOwnMessage
                      ? "bg-cyan-500/20 border-cyan-500/30"
                      : "bg-slate-800 border-slate-700"
                  }`}>

                    <div className="flex justify-between gap-4 mb-2">

                      <div>

                        <h3 className="font-bold text-cyan-300">

                          {msg.sender}

                        </h3>

                        <p className="text-xs text-slate-400">

                          {msg.email}

                        </p>

                      </div>

                      {
                        role === "admin"

                        ? (

                          <select
                            value={msg.status || "Open"}
                            onChange={(e) =>
                              updateStatus(
                                msg.id,
                                e.target.value
                              )
                            }
                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                          >

                            <option value="Open">
                              Open
                            </option>

                            <option value="In Progress">
                              In Progress
                            </option>

                            <option value="Resolved">
                              Resolved
                            </option>

                            <option value="Closed">
                              Closed
                            </option>

                          </select>

                        ) : (

                          <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                            msg.status
                          )}`}>

                            {msg.status}

                          </span>

                        )
                      }

                    </div>

                    <p className="text-white break-words">

                      {msg.message}

                    </p>

                  </div>

                </div>
              )
            })
          )
        }

        <div ref={messagesEndRef}></div>

      </div>

      {
        typingUser && (

          <p className="text-cyan-400 text-sm mt-3">

            {typingUser} is typing...

          </p>

        )
      }

      <div className="flex gap-3 mt-5">

        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none text-white"
        />

        <button
          onClick={sendMessage}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 text-black"
        >

          <FiSend />

          Send

        </button>

      </div>

    </div>
  )
}

export default LiveChat
