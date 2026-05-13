import {
  FiBell
} from "react-icons/fi"

import {
  getUserName
} from "../utils/auth"


function Navbar() {

  const userName = getUserName()

  const role = localStorage.getItem(
    "role"
  )

  const firstLetter =
    userName?.charAt(0)?.toUpperCase() || "U"


  return (

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-4 md:px-8 py-5 border-b border-slate-800 bg-slate-900">

      <div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Live Support Dashboard
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Welcome back, {userName}
        </p>

      </div>


      <div className="flex items-center justify-between md:justify-end gap-4">

        <button className="relative bg-slate-800 hover:bg-slate-700 transition-all duration-300 p-3 rounded-2xl">

          <FiBell className="text-xl text-white" />

          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>

        </button>


        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700">

          <div className="w-11 h-11 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black text-lg">

            {firstLetter}

          </div>


          <div className="hidden sm:block">

            <h3 className="font-semibold text-white">
              {userName}
            </h3>

            <span
              className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-semibold ${
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

    </div>
  )
}

export default Navbar
