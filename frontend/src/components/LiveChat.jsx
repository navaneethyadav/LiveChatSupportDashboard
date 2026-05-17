import {
  useEffect,
  useRef,
  useState,
  useCallback
} from "react"

import API from "../services/api"

import {
  FiSend
} from "react-icons/fi"

import {
  sendSocketMessage,
  subscribeMessages,
  subscribeTyping,
  subscribeStatusUpdates
} from "../services/socket"

import {
  useSocket
} from "../context/SocketContext"

function LiveChat() {

  const [messages, setMessages] =
    useState([])

  const [input, setInput] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  const [typingUser, setTypingUser] =
    useState("")

  const typingTimeoutRef =
    useRef(null)

  const messagesEndRef =
    useRef(null)

  const fetchedRef =
    useRef(false)

  const {
    isConnected
  } = useSocket()

  const fullName =
    localStorage.getItem(
      "full_name"
    )

  const role =
    localStorage.getItem(
      "role"
    )

  const email =
    localStorage.getItem(
      "email"
    )

  // =====================================
  // FORMAT TIME
  // =====================================

  const formatTimestamp = (
    timestamp
  ) => {

    if (!timestamp) {

      return ""
    }

    try {

      return new Date(
        timestamp
      ).toLocaleString("en-IN", {

        year: "numeric",

        month: "short",

        day: "numeric",

        hour: "2-digit",

        minute: "2-digit",

        hour12: true
      })

    } catch {

      return ""
    }
  }

  // =====================================
  // FETCH MESSAGES
  // =====================================

  const fetchMessages =
    useCallback(async () => {

      try {

        setLoading(true)

        const response =
          await API.get(

            `/chat/messages?email=${email}&role=${role}`
          )

        const sortedMessages =
          (response.data || []).sort(
            (a, b) => a.id - b.id
          )

        setMessages(
          sortedMessages
        )

      } catch (error) {

        console.log(
          "Fetch Messages Error:",
          error
        )

      } finally {

        setLoading(false)
      }

    }, [email, role])

  // =====================================
  // INITIAL FETCH
  // =====================================

  useEffect(() => {

    if (fetchedRef.current) {

      return
    }

    fetchedRef.current = true

    fetchMessages()

  }, [fetchMessages])

  // =====================================
  // SOCKET EVENTS
  // =====================================

  useEffect(() => {

    // ===================================
    // NEW MESSAGE
    // ===================================

    const unsubscribeMessages =
      subscribeMessages((message) => {

        setMessages((prevMessages) => {

          // =============================
          // INVALID MESSAGE
          // =============================

          if (!message?.id) {

            return prevMessages
          }

          // =============================
          // DUPLICATE CHECK
          // =============================

          const alreadyExists =
            prevMessages.some(
              (msg) => msg.id === message.id
            )

          if (alreadyExists) {

            return prevMessages
          }

          // =============================
          // USER FILTER
          // =============================

          if (role !== "admin") {

            const isOwnMessage =
              message.email === email

            const isAdminMessage =
              message.role === "admin"

            if (
              !isOwnMessage &&
              !isAdminMessage
            ) {

              return prevMessages
            }
          }

          // =============================
          // ADD + SORT
          // =============================

          const updatedMessages = [
            ...prevMessages,
            message
          ]

          updatedMessages.sort(
            (a, b) => a.id - b.id
          )

          return updatedMessages
        })
      })

    // ===================================
    // TYPING EVENTS
    // ===================================

    const unsubscribeTyping =
      subscribeTyping((typingData) => {

        if (
          !typingData?.sender
        ) {

          return
        }

        if (
          typingData.sender === fullName
        ) {

          return
        }

        setTypingUser(
          typingData.sender
        )

        clearTimeout(
          typingTimeoutRef.current
        )

        typingTimeoutRef.current =
          setTimeout(() => {

            setTypingUser("")

          }, 1500)
      })

    // ===================================
    // STATUS UPDATES
    // ===================================

    const unsubscribeStatus =
      subscribeStatusUpdates((statusData) => {

        if (!statusData?.id) {

          return
        }

        setMessages((prevMessages) =>

          prevMessages.map((msg) =>

            msg.id === statusData.id

              ? {
                  ...msg,
                  status:
                    statusData.status
                }

              : msg
          )
        )
      })

    // ===================================
    // CLEANUP
    // ===================================

    return () => {

      unsubscribeMessages()

      unsubscribeTyping()

      unsubscribeStatus()

      clearTimeout(
        typingTimeoutRef.current
      )
    }

  }, [
    email,
    role,
    fullName
  ])

  // =====================================
  // AUTO SCROLL
  // =====================================

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({

        behavior: "smooth"
      })

  }, [messages])

  // =====================================
  // HANDLE TYPING
  // =====================================

  const handleTyping = (e) => {

    const value =
      e.target.value

    setInput(value)

    if (!value.trim()) {

      return
    }

    sendSocketMessage({

      message: "",

      status: "Open",

      is_typing: true
    })
  }

  // =====================================
  // SEND MESSAGE
  // =====================================

  const sendMessage = () => {

    const trimmedMessage =
      input.trim()

    if (!trimmedMessage) {

      return
    }

    if (!isConnected) {

      return
    }

    sendSocketMessage({

      message: trimmedMessage,

      status: "Open",

      is_typing: false
    })

    setInput("")
  }

  // =====================================
  // ENTER KEY
  // =====================================

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault()

      sendMessage()
    }
  }

  // =====================================
  // UPDATE STATUS
  // =====================================

  const updateStatus = async (
    messageId,
    newStatus
  ) => {

    try {

      await API.put(

        `/chat/status/${messageId}?status=${newStatus}`
      )

    } catch (error) {

      console.log(
        "Status Update Error:",
        error
      )
    }
  }

  // =====================================
  // STATUS COLORS
  // =====================================

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

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-3xl font-bold text-white">

            Live Support Chat

          </h2>

          <p className="text-slate-400">

            Real-time communication system

          </p>

        </div>

        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isConnected
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >

          {
            isConnected
              ? "Online"
              : "Offline"
          }

        </div>

      </div>

      {/* CHAT BOX */}

      <div className="bg-slate-950 rounded-3xl h-[500px] overflow-y-auto p-5 space-y-5 border border-slate-800">

        {
          loading ? (

            <p className="text-slate-400">

              Loading chat...

            </p>

          ) : messages.length === 0 ? (

            <p className="text-slate-500 text-center">

              No messages yet

            </p>

          ) : (

            messages.map((msg) => {

              const isOwnMessage =

                msg.email === email

              return (

                <div
                  key={msg.id}
                  className={`flex ${
                    isOwnMessage
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[75%] rounded-3xl p-4 border ${
                      isOwnMessage
                        ? "bg-cyan-500/20 border-cyan-500/30"
                        : "bg-slate-800 border-slate-700"
                    }`}
                  >

                    <div className="flex justify-between gap-4 mb-3">

                      <div>

                        <h3 className="font-bold text-cyan-300">

                          {msg.sender}

                        </h3>

                        <p className="text-xs text-slate-400">

                          {msg.email}

                        </p>

                        <p className="text-xs text-slate-500 mt-1">

                          {
                            formatTimestamp(
                              msg.created_at ||
                              msg.timestamp
                            )
                          }

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
                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
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
                            className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                              msg.status
                            )}`}
                          >

                            {msg.status}

                          </span>
                        )
                      }

                    </div>

                    <p className="text-white whitespace-pre-wrap break-words leading-relaxed">

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

      {/* TYPING */}

      {
        typingUser && (

          <p className="text-cyan-400 text-sm mt-3">

            {typingUser} is typing...

          </p>
        )
      }

      {/* INPUT */}

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
          disabled={!isConnected}
          className={`px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 ${
            isConnected
              ? "bg-cyan-500 hover:bg-cyan-600 text-black"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
        >

          <FiSend />

          Send

        </button>

      </div>

    </div>
  )
}

export default LiveChat
