import { useState } from "react"

import {
FiHome,
FiClipboard,
FiSettings,
FiLogOut,
FiMenu,
FiX,
FiStar
} from "react-icons/fi"

import {
Link,
useLocation
} from "react-router-dom"

import {
getUserName,
getRole,
isAdmin,
logoutUser
} from "../utils/auth"

function Sidebar() {

const [isOpen, setIsOpen] = useState(false)

const location = useLocation()

const userName = getUserName()

const role = getRole()

// =====================================
// LOGOUT
// =====================================

const handleLogout = () => {

const confirmLogout = window.confirm(
  "Are you sure you want to logout?"
)

if (confirmLogout) {

  logoutUser()
}

}

// =====================================
// USER INITIAL
// =====================================

const firstLetter =

userName?.charAt(0)?.toUpperCase()

|| "U"

// =====================================
// ACTIVE NAV STYLE
// =====================================

const navClass = (path) => {

const isActive =
  location.pathname === path

return `
  flex items-center gap-3 p-4 rounded-xl
  transition-all duration-200
  border
  ${
    isActive
      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
      : "bg-slate-800 border-slate-800 hover:bg-slate-700 hover:border-slate-700 text-white"
  }
`

}

return (

<>

  {/* MOBILE TOP BAR */}

  <div className="md:hidden fixed top-0 left-0 right-0 z-[60] bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-4 flex items-center justify-between">

    <h1 className="text-xl font-bold text-cyan-400">

      SupportHub

    </h1>

    <button
      onClick={() =>
        setIsOpen(true)
      }
      className="text-white text-2xl"
    >

      <FiMenu />

    </button>

  </div>


  {/* OVERLAY */}

  {
    isOpen && (

      <div
        onClick={() =>
          setIsOpen(false)
        }
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
      ></div>

    )
  }


  {/* SIDEBAR */}

  <aside
    className={`
      fixed md:static top-0 left-0 z-50
      h-screen w-[85%] max-w-[290px] md:w-72
      bg-slate-900 border-r border-slate-800
      p-6 flex flex-col justify-between
      transform transition-transform duration-300 ease-in-out
      overflow-y-auto
      ${
        isOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      }
    `}
  >

    <div>

      {/* MOBILE CLOSE */}

      <div className="flex items-center justify-between md:block mb-10">

        <div>

          <h1 className="text-3xl font-bold text-cyan-400">

            SupportHub

          </h1>

          <p className="text-slate-400 mt-2 text-sm leading-relaxed">

            Enterprise Support Dashboard

          </p>

        </div>

        <button
          onClick={() =>
            setIsOpen(false)
          }
          className="md:hidden text-2xl text-white"
        >

          <FiX />

        </button>

      </div>


      {/* NAVIGATION */}

      <nav className="space-y-4">

        <Link
          to="/dashboard"
          onClick={() =>
            setIsOpen(false)
          }
          className={navClass("/dashboard")}
        >

          <FiHome className="text-xl" />

          <span>

            Dashboard

          </span>

        </Link>


        <Link
          to="/tickets"
          onClick={() =>
            setIsOpen(false)
          }
          className={navClass("/tickets")}
        >

          <FiClipboard className="text-xl" />

          <span>

            Tickets

          </span>

        </Link>


        {
          isAdmin() && (

            <>

              <Link
                to="/feedbacks"
                onClick={() =>
                  setIsOpen(false)
                }
                className={navClass("/feedbacks")}
              >

                <FiStar className="text-xl" />

                <span>

                  Feedbacks

                </span>

              </Link>


              <Link
                to="/admin"
                onClick={() =>
                  setIsOpen(false)
                }
                className={navClass("/admin")}
              >

                <FiSettings className="text-xl" />

                <span>

                  Admin Panel

                </span>

              </Link>

            </>

          )
        }

      </nav>

    </div>


    {/* USER CARD */}

    <div className="mt-8">

      <div className="bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-700 shadow-lg">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-lg shrink-0">

            {firstLetter}

          </div>

          <div className="min-w-0">

            <p className="text-sm text-slate-400">

              Logged in as

            </p>

            <h2 className="text-lg font-semibold truncate">

              {userName}

            </h2>

            <span
              className={`
                inline-block mt-2 text-xs px-3 py-1
                rounded-full font-semibold
                ${
                  role === "admin"
                    ? "bg-purple-500/20 text-purple-300"
                    : role === "support"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-green-500/20 text-green-300"
                }
              `}
            >

              {
                role === "admin"
                  ? "Admin"
                  : role === "support"
                  ? "Support"
                  : "User"
              }

            </span>

          </div>

        </div>

      </div>


      {/* LOGOUT */}

      <button
        onClick={handleLogout}
        className="
          w-full bg-red-500 hover:bg-red-600
          transition-all duration-200
          py-3 rounded-xl font-semibold
          flex items-center justify-center gap-2
          shadow-lg
        "
      >

        <FiLogOut />

        Logout

      </button>

    </div>

  </aside>

</>

)
}

export default Sidebar
