import {
createContext,
useContext,
useEffect,
useState
} from "react"

const NotificationContext = createContext()

export function NotificationProvider({
children
}) {

// =====================================
// STATE
// =====================================

const [notifications, setNotifications] = useState([])

// =====================================
// LOAD FROM STORAGE
// =====================================

useEffect(() => {

const storedNotifications =
  localStorage.getItem(
    "notifications"
  )

if (storedNotifications) {

  setNotifications(
    JSON.parse(
      storedNotifications
    )
  )
}

}, [])

// =====================================
// SAVE TO STORAGE
// =====================================

useEffect(() => {

localStorage.setItem(
  "notifications",
  JSON.stringify(
    notifications
  )
)

}, [notifications])

// =====================================
// ADD NOTIFICATION
// =====================================

const addNotification = (
message
) => {

const newNotification = {

  id: Date.now(),

  message,

  read: false,

  created_at: new Date().toISOString()
}

setNotifications((prev) => [

  newNotification,

  ...prev

])

}

// =====================================
// MARK AS READ
// =====================================

const markAsRead = (
notificationId
) => {

setNotifications((prev) =>

  prev.map((notification) =>

    notification.id === notificationId

      ? {
          ...notification,
          read: true
        }

      : notification
  )
)

}

// =====================================
// MARK ALL AS READ
// =====================================

const markAllAsRead = () => {

setNotifications((prev) =>

  prev.map((notification) => ({

    ...notification,

    read: true

  }))
)

}

// =====================================
// DELETE NOTIFICATION
// =====================================

const deleteNotification = (
notificationId
) => {

setNotifications((prev) =>

  prev.filter(
    (notification) =>

      notification.id !== notificationId
  )
)

}

// =====================================
// CLEAR ALL
// =====================================

const clearAllNotifications = () => {

setNotifications([])

}

// =====================================
// UNREAD COUNT
// =====================================

const unreadCount = notifications.filter(
(notification) => !notification.read
).length

return (

<NotificationContext.Provider
  value={{

    notifications,

    unreadCount,

    addNotification,

    markAsRead,

    markAllAsRead,

    deleteNotification,

    clearAllNotifications

  }}
>

  {children}

</NotificationContext.Provider>

)
}

export function useNotifications() {

return useContext(
NotificationContext
)
}
