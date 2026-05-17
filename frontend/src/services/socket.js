let socket = null

let reconnectTimeout = null

let reconnectAttempts = 0

let manuallyDisconnected = false

const MAX_RECONNECTS = 10

const messageQueue = []


// =========================================
// EVENT LISTENERS
// =========================================

const messageListeners = new Set()

const typingListeners = new Set()

const connectionListeners = new Set()

const ticketListeners = new Set()

const notificationListeners = new Set()

const dashboardListeners = new Set()

const statusListeners = new Set()


// =========================================
// GET WS URL
// =========================================

const getWebSocketUrl = () => {

  const API_URL =

    import.meta.env.VITE_API_URL ||

    "http://127.0.0.1:8000"

  return API_URL
    .replace("https://", "wss://")
    .replace("http://", "ws://")
}


// =========================================
// NOTIFY CONNECTION STATUS
// =========================================

const notifyConnection = (status) => {

  connectionListeners.forEach((callback) => {

    callback(status)

  })
}


// =========================================
// HANDLE SOCKET EVENTS
// =========================================

const handleSocketEvent = (payload) => {

  const {
    type,
    data
  } = payload

  switch (type) {

    // =====================================
    // CHAT MESSAGE
    // =====================================

    case "chat_message":

      messageListeners.forEach((callback) => {

        callback(data)

      })

      break

    // =====================================
    // TYPING
    // =====================================

    case "typing":

      typingListeners.forEach((callback) => {

        callback(data)

      })

      break

    // =====================================
    // CHAT STATUS UPDATE
    // =====================================

    case "chat_status_updated":

      statusListeners.forEach((callback) => {

        callback(data)

      })

      break

    // =====================================
    // TICKET UPDATE
    // =====================================

    case "ticket_update":

      ticketListeners.forEach((callback) => {

        callback(data)

      })

      break

    // =====================================
    // NOTIFICATION
    // =====================================

    case "notification":

      notificationListeners.forEach((callback) => {

        callback(data)

      })

      break

    // =====================================
    // DASHBOARD UPDATE
    // =====================================

    case "dashboard_update":

      dashboardListeners.forEach((callback) => {

        callback(data)

      })

      break

    default:

      console.log(
        "Unknown socket event:",
        type
      )
  }
}


// =========================================
// FLUSH QUEUE
// =========================================

const flushQueue = () => {

  while (

    messageQueue.length > 0 &&

    socket &&

    socket.readyState === WebSocket.OPEN

  ) {

    const queuedMessage =

      messageQueue.shift()

    socket.send(

      JSON.stringify(
        queuedMessage
      )
    )
  }
}


// =========================================
// CONNECT SOCKET
// =========================================

export const connectSocket = async () => {

  try {

    clearTimeout(
      reconnectTimeout
    )

    // =====================================
    // PREVENT DUPLICATE CONNECTIONS
    // =====================================

    if (

      socket &&

      (
        socket.readyState === WebSocket.OPEN ||

        socket.readyState === WebSocket.CONNECTING
      )

    ) {

      return socket
    }

    manuallyDisconnected = false

    const token = localStorage.getItem(
      "token"
    )

    if (!token) {

      console.log(
        "No token found"
      )

      return null
    }

    const wsUrl =

      `${getWebSocketUrl()}/ws/chat?token=${encodeURIComponent(token)}`

    console.log(
      "Connecting WebSocket..."
    )

    socket = new WebSocket(
      wsUrl
    )

    // =====================================
    // OPEN
    // =====================================

    socket.onopen = () => {

      console.log(
        "WebSocket Connected"
      )

      reconnectAttempts = 0

      notifyConnection(true)

      // ===================================
      // SEND PENDING MESSAGES
      // ===================================

      flushQueue()
    }

    // =====================================
    // MESSAGE
    // =====================================

    socket.onmessage = (event) => {

      try {

        const payload = JSON.parse(
          event.data
        )

        handleSocketEvent(
          payload
        )

      } catch (error) {

        console.log(
          "Socket Parse Error:",
          error
        )
      }
    }

    // =====================================
    // CLOSE
    // =====================================

    socket.onclose = (event) => {

      console.log(
        "WebSocket Closed:",
        event.code
      )

      notifyConnection(false)

      socket = null

      // ===================================
      // MANUAL DISCONNECT
      // ===================================

      if (manuallyDisconnected) {

        console.log(
          "Manual disconnect"
        )

        return
      }

      // ===================================
      // AUTH ERROR
      // ===================================

      if (event.code === 1008) {

        console.log(
          "Authentication failed"
        )

        localStorage.clear()

        window.location.href = "/"

        return
      }

      // ===================================
      // MAX RECONNECTS
      // ===================================

      if (
        reconnectAttempts >=
        MAX_RECONNECTS
      ) {

        console.log(
          "Max reconnect attempts reached"
        )

        return
      }

      reconnectAttempts += 1

      console.log(
        `Reconnect attempt: ${reconnectAttempts}`
      )

      reconnectTimeout = setTimeout(() => {

        connectSocket()

      }, 1500)
    }

    // =====================================
    // ERROR
    // =====================================

    socket.onerror = (error) => {

      console.log(
        "WebSocket Error:",
        error
      )
    }

    return socket

  } catch (error) {

    console.log(
      "Socket Connection Error:",
      error
    )

    return null
  }
}


// =========================================
// DISCONNECT
// =========================================

export const disconnectSocket = () => {

  manuallyDisconnected = true

  clearTimeout(
    reconnectTimeout
  )

  if (socket) {

    socket.close()

    socket = null
  }
}


// =========================================
// SEND MESSAGE
// =========================================

export const sendSocketMessage = (data) => {

  // =====================================
  // SEND DIRECTLY
  // =====================================

  if (

    socket &&

    socket.readyState === WebSocket.OPEN

  ) {

    socket.send(
      JSON.stringify(data)
    )

    return
  }

  // =====================================
  // QUEUE MESSAGE
  // =====================================

  console.log(
    "Socket not ready. Queued message."
  )

  messageQueue.push(data)

  // =====================================
  // RECONNECT
  // =====================================

  connectSocket()
}


// =========================================
// SUBSCRIBE CHAT MESSAGES
// =========================================

export const subscribeMessages = (callback) => {

  messageListeners.add(callback)

  return () => {

    messageListeners.delete(callback)
  }
}


// =========================================
// SUBSCRIBE TYPING
// =========================================

export const subscribeTyping = (callback) => {

  typingListeners.add(callback)

  return () => {

    typingListeners.delete(callback)
  }
}


// =========================================
// SUBSCRIBE CONNECTION
// =========================================

export const subscribeConnection = (callback) => {

  connectionListeners.add(callback)

  return () => {

    connectionListeners.delete(callback)
  }
}


// =========================================
// SUBSCRIBE TICKET EVENTS
// =========================================

export const subscribeTickets = (callback) => {

  ticketListeners.add(callback)

  return () => {

    ticketListeners.delete(callback)
  }
}


// =========================================
// SUBSCRIBE NOTIFICATIONS
// =========================================

export const subscribeNotifications = (callback) => {

  notificationListeners.add(callback)

  return () => {

    notificationListeners.delete(callback)
  }
}


// =========================================
// SUBSCRIBE DASHBOARD
// =========================================

export const subscribeDashboard = (callback) => {

  dashboardListeners.add(callback)

  return () => {

    dashboardListeners.delete(callback)
  }
}


// =========================================
// SUBSCRIBE STATUS EVENTS
// =========================================

export const subscribeStatusUpdates = (callback) => {

  statusListeners.add(callback)

  return () => {

    statusListeners.delete(callback)
  }
}
