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

  const reconnectAttemptsRef = useRef(0)

  const fullName = localStorage.getItem(
    "full_name"
  )

  const role = localStorage.getItem(
    "role"
  )

  const email = localStorage.getItem(
    "email"
  )


  // =========================================
  // FETCH OLD MESSAGES
  // =========================================

  const fetchMessages = async () => {

    try {

      const response = await API.get(
        `/chat/messages?email=${email}&role=${role}`
      )

      setMessages(response.data)

    } catch (error) {

      console.log(
        "Fetch Messages Error:",
        error
      )

    } finally {

      setLoading(false)
    }
  }


  // =========================================
  // CONNECT WEBSOCKET
  // =========================================

  const connectWebSocket = () => {

    try {

      const token = localStorage.getItem(
        "token"
      )

      console.log(
        "Current Token:",
        token
      )

      if (!token) {

        console.log(
          "No token found"
        )

        return
      }

      // PREVENT DUPLICATE CONNECTIONS
      if (
        socketRef.current &&
        (
          socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING
        )
      ) {

        console.log(
          "WebSocket already active"
        )

        return
      }

      const WS_BASE_URL =
        import.meta.env.VITE_API_URL
          ?.replace("https://", "wss://")
          ?.replace("http://", "ws://")
          ||
          "wss://livechatsupportdashboard.onrender.com"

      // FIX JWT TOKEN URL ISSUE
      const websocketUrl =
        `${WS_BASE_URL}/ws/chat?token=${encodeURIComponent(token)}`

      console.log(
        "Connecting to:",
        websocketUrl
      )

      const socket = new WebSocket(
        websocketUrl
      )

      socketRef.current = socket


      // =========================================
      // SOCKET OPEN
      // =========================================

      socket.onopen = () => {

        console.log(
          "WebSocket Connected Successfully"
        )

        setIsConnected(true)

        reconnectAttemptsRef.current = 0
      }


      // =========================================
      // SOCKET MESSAGE
      // =========================================

      socket.onmessage = (
        event
      ) => {

        try {

          const parsedMessage = JSON.parse(
            event.data
          )

          // TYPING EVENT
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

            // NORMAL USERS SEE ONLY THEIR MESSAGES
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

        } catch (error) {

          console.log(
            "Message Parse Error:",
            error
          )
        }
      }


      // =========================================
      // SOCKET CLOSE
      // =========================================

      socket.onclose = (
        event
      ) => {

        console.log(
          "WebSocket Closed:",
          event.code
        )

        setIsConnected(false)

        socketRef.current = null

        // AUTH ERROR
        if (
          event.code === 1008
        ) {

          console.log(
            "Authentication failed"
          )

          localStorage.clear()

          return
        }

        // LIMIT RECONNECTS
        if (
          reconnectAttemptsRef.current >= 5
        ) {

          console.log(
            "Reconnect limit reached"
          )

          return
        }

        reconnectAttemptsRef.current += 1

        reconnectTimeoutRef.current =
          setTimeout(() => {

            connectWebSocket()

          }, 3000)
      }


      // =========================================
      // SOCKET ERROR
      // =========================================

      socket.onerror = (
        error
      ) => {

        console.log(
          "WebSocket Error:",
          error
        )
      }

    } catch (error) {

      console.log(
        "WebSocket Connection Error:",
        error
      )
    }
  }


  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {

    fetchMessages()

    const token = localStorage.getItem(
      "token"
    )

    if (token) {

      connectWebSocket()
    }

    return () => {

      clearTimeout(
        reconnectTimeoutRef.current
      )

      clearTimeout(
        typingTimeoutRef.current
      )

      if (socketRef.current) {

        socketRef.current.close()

        socketRef.current = null
      }
    }

  }, [])


  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

      behavior: "smooth"

    })

  }, [messages])


  // =========================================
  // HANDLE TYPING
  // =========================================

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


  // =========================================
  // SEND MESSAGE
  // =========================================

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

        message: input.trim(),

        status: "Open",

        is_typing: false

      })
    )

    setInput("")
  }


  // =========================================
  // ENTER KEY
  // =========================================

  const handleKeyDown = (
    e
  ) => {

    if (
      e.key === "Enter"
    ) {

      sendMessage()
    }
  }


  // =========================================
  // UPDATE STATUS
  // =========================================

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

      console.log(
        "Status Update Error:",
        error
      )
    }
  }


  // =========================================
  // STATUS COLOR
  // =========================================

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
              : "Offline"
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
