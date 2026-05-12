import { useState } from "react"

import { FiBell } from "react-icons/fi"

import {
  useNotifications
} from "../context/NotificationContext"


function NotificationBell() {

  const [open, setOpen] = useState(false)

  const { notifications } = useNotifications()


  return (

    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="relative p-3 bg-slate-800 rounded-xl"
      >

        <FiBell className="text-2xl text-cyan-400" />

        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
          {notifications.length}
        </span>

      </button>


      {
        open && (

          <div className="absolute right-0 top-16 w-80 bg-black border border-cyan-500 rounded-xl p-4 z-[9999]">

            <h2 className="text-white text-lg font-bold mb-4">
              Notifications
            </h2>


            {
              notifications.length === 0 ? (

                <p className="text-slate-400">
                  No notifications
                </p>

              ) : (

                notifications.map((item) => (

                  <div
                    key={item.id}
                    className="bg-slate-900 p-3 rounded-lg mb-2"
                  >

                    <p className="text-white text-sm">
                      {item.message}
                    </p>

                  </div>
                ))
              )
            }

          </div>
        )
      }

    </div>
  )
}

export default NotificationBell