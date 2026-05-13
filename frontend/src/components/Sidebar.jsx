import { useState } from "react"

import {
  FiHome,
  FiClipboard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi"

import {
  Link,
  useNavigate
} from "react-router-dom"

import {
  getUserName,
  isAdmin
} from "../utils/auth"


function Sidebar() {

  const [isOpen, setIsOpen] = useState(false)

  const userName = getUserName()

  const role = localStorage.getItem(
    "role"
  )

  const navigate = useNavigate()


  const logout = () => {

    localStorage.clear()

    navigate("/")
  }


  const firstLetter =
    userName?.charAt(0)?.toUpperCase() || "U"


  return (

    <>

      {/* Mobile Top Bar */}

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-4 flex items-center justify-between">

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


      {/* Overlay */}

      {
        isOpen && (

          <div
            onClick={() =>
              setIsOpen(false)
            }
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          ></div>

        )
      }


      {/* Sidebar */}

      <div
        className={`fixed md:static top-0 left-0 z-50 h-full w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transform transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >

        <div>

          {/* Mobile Close */}

          <div className="flex items-center justify-between md:block mb-10">

            <div>

              <h1 className="text-3xl font-bold text-cyan-400">
                SupportHub
              </h1>

              <p className="text-slate-400 mt-2 text-sm">
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


          {/* Navigation */}

          <nav className="space-y-4">

            <Link
              to="/dashboard"
              onClick={() =>
                setIsOpen(false)
              }
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition-all duration-300 p-4 rounded-xl"
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
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition-all duration-300 p-4 rounded-xl"
            >

              <FiClipboard className="text-xl" />

              <span>
                Tickets
              </span>

            </Link>


            {
              isAdmin() && (

                <Link
                  to="/admin"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition-all duration-300 p-4 rounded-xl"
                >

                  <FiSettings className="text-xl" />

                  <span>
                    Admin Panel
                  </span>

                </Link>

              )
            }

          </nav>

        </div>


        {/* Bottom User Card */}

        <div>

          <div className="bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-700">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-lg">

                {firstLetter}

              </div>

              <div>

                <p className="text-sm text-slate-400">
                  Logged in as
                </p>

                <h2 className="text-lg font-semibold">
                  {userName}
                </h2>

                <span
                  className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-semibold ${
                    role === "admin"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-cyan-500/20 text-cyan-300"
                  }`}
                >

                  {
                    role === "admin"
                      ? "Admin"
                      : "User"
                  }

                </span>

              </div>

            </div>

          </div>


          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >

            <FiLogOut />

            Logout

          </button>

        </div>

      </div>

    </>
  )
}

export default Sidebar
