import {
  FiHome,
  FiClipboard,
  FiSettings
} from "react-icons/fi"

import { Link } from "react-router-dom"

import {
  getUserName,
  isAdmin
} from "../utils/auth"


function Sidebar() {

  const userName = getUserName()


  return (

    <div className="w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">

      <div>

        <div className="mb-10">

          <h1 className="text-3xl font-bold text-cyan-400">
            SupportHub
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Enterprise Support Dashboard
          </p>

        </div>


        <nav className="space-y-4">

          <Link
            to="/dashboard"
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl"
          >

            <FiHome className="text-xl" />

            <span>
              Dashboard
            </span>

          </Link>


          <Link
            to="/tickets"
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl"
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
                className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl"
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


      <div className="bg-slate-800 p-4 rounded-xl">

        <p className="text-sm text-slate-400">
          Logged in as
        </p>

        <h2 className="text-lg font-semibold mt-1">
          {userName}
        </h2>

      </div>

    </div>
  )
}

export default Sidebar