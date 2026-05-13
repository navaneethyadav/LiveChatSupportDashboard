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

  const socketRef = useRef(null)

  const typingTimeoutRef = useRef(null)

  const messagesEndRef = useRef(null)

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


  useEffect(() => {

    fetchMessages()

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat?token=${token}`
    )

    socketRef.current = socket


    socket.onopen = () => {

      console.log(
        "WebSocket connected"
      )
    }


    socket.onmessage = (event) => {

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

        const exists = prev.some(
          (msg) =>
            msg.id === parsedMessage.id
        )

        if (exists) {

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
        "WebSocket disconnected"
      )
    }


    socket.onerror = (error) => {

      console.log(
        "WebSocket error:",
        error
      )
    }


    return () => {

      socket.close()
    }

  }, [])


  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })

  }, [messages])


  const fetchMessages = async () => {

    try {

      const response = await API.get(
        `/chat/messages?email=${email}&role=${role}`
      )

      setMessages(
        response.data
      )

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
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


  const handleTyping = (
    e
  ) => {

    setInput(
      e.target.value
    )

    if (
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {

      return
    }

    const typingData = {

      status: "Open",

      message: "",

      is_typing: true

    }

    socketRef.current.send(
      JSON.stringify(
        typingData
      )
    )
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

      status: "Open",

      message: input,

      is_typing: false

    }

    socketRef.current.send(
      JSON.stringify(
        messageData
      )
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>

          <h2 className="text-2xl md:text-3xl font-bold text-white">

            Live Support Chat

          </h2>

          <p className="text-slate-400 text-sm mt-1">

            Real-time communication system

          </p>

        </div>


        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full w-fit">

          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

          <span className="text-green-400 text-sm font-medium">

            Online

          </span>

        </div>

      </div>


      <div className="bg-slate-950 rounded-3xl h-[500px] overflow-y-auto p-4 md:p-5 space-y-5 border border-slate-800">

        {
          loading ? (

            <div className="flex items-center justify-center h-full">

              <div className="text-center">

                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                <p className="text-slate-400">
                  Loading chat...
                </p>

              </div>

            </div>

          ) : messages.length === 0 ? (

            <div className="flex items-center justify-center h-full">

              <div className="text-center">

                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-5">

                  💬

                </div>

                <h3 className="text-2xl font-bold mb-2 text-white">

                  No Messages Yet

                </h3>

                <p className="text-slate-400">

                  Start the conversation now.

                </p>

              </div>

            </div>

          ) : (

            messages.map((msg, index) => {

              const isOwnMessage =
                msg.sender === fullName

              const firstLetter =
                msg.sender?.charAt(0)?.toUpperCase() || "U"

              return (

                <div
                  key={msg.id || index}
                  className={`flex ${
                    isOwnMessage
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div className="flex gap-3 max-w-[90%] md:max-w-[75%]">

                    {
                      !isOwnMessage && (

                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          msg.role === "admin"
                            ? "bg-purple-500 text-white"
                            : "bg-slate-700 text-white"
                        }`}>

                          {firstLetter}

                        </div>

                      )
                    }


                    <div
                      className={`rounded-3xl p-4 border shadow-lg ${
                        isOwnMessage
                          ? "bg-cyan-500/20 border-cyan-500/30"
                          : msg.role === "admin"
                          ? "bg-purple-500/20 border-purple-500/30"
                          : "bg-slate-800 border-slate-700"
                      }`}
                    >

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">

                        <div>

                          <h3
                            className={`font-bold text-base ${
                              msg.role === "admin"
                                ? "text-purple-300"
                                : "text-cyan-300"
                            }`}
                          >

                            {msg.sender}

                          </h3>

                          {
                            msg.email && (

                              <p className="text-xs text-slate-400 mt-1 break-all">

                                {msg.email}

                              </p>

                            )
                          }

                        </div>


                        <div className="flex flex-col items-start sm:items-end gap-2">

                          {
                            role === "admin" ? (

                              <select
                                value={msg.status || "Open"}
                                onChange={(e) =>
                                  updateStatus(
                                    msg.id,
                                    e.target.value
                                  )
                                }
                                className="text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
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

                              <span
                                className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(
                                  msg.status
                                )}`}
                              >

                                {msg.status || "Open"}

                              </span>

                            )
                          }

                          <p className="text-xs text-slate-500">

                            {
                              msg.timestamp
                                ? msg.timestamp
                                : ""
                            }

                          </p>

                        </div>

                      </div>


                      <p className="text-slate-100 leading-relaxed break-words">

                        {msg.message}

                      </p>

                    </div>

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

          <div className="mt-4 text-sm text-cyan-400 flex items-center gap-2 animate-pulse">

            <div className="flex gap-1">

              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>

              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>

              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>

            </div>

            {typingUser} is typing...

          </div>

        )
      }


      <div className="flex flex-col sm:flex-row gap-3 mt-5">

        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none text-white focus:border-cyan-500"
        />

        <button
          onClick={sendMessage}
          className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 text-black"
        >

          <FiSend />

          Send

        </button>

      </div>

    </div>
  )
}

export default LiveChat