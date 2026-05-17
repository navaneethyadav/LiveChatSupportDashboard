import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from "react"

import {
  connectSocket,
  subscribeConnection
} from "../services/socket"

const SocketContext = createContext()

export const SocketProvider = ({
  children
}) => {

  const [isConnected, setIsConnected] =
    useState(false)

  const initializedRef =
    useRef(false)

  // =====================================
  // CONNECT SOCKET ONLY ONCE
  // =====================================

  useEffect(() => {

    // ================================
    // PREVENT MULTIPLE CONNECTIONS
    // ================================

    if (initializedRef.current) {

      return
    }

    initializedRef.current = true

    const initSocket = async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          )

        if (!token) {

          return
        }

        await connectSocket()

      } catch (error) {

        console.log(
          "Socket Init Error:",
          error
        )
      }
    }

    initSocket()

    // ================================
    // CONNECTION STATUS
    // ================================

    const unsubscribe =
      subscribeConnection((status) => {

        setIsConnected(status)
      })

    return () => {

      unsubscribe()

      // IMPORTANT:
      // DO NOT disconnect socket here
      // React rerender/unmount causing issue
    }

  }, [])

  return (

    <SocketContext.Provider
      value={{
        isConnected
      }}
    >

      {children}

    </SocketContext.Provider>
  )
}

export const useSocket = () => {

  return useContext(SocketContext)
}
