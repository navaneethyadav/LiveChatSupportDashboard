import { FiBell } from "react-icons/fi"

import { getUserName } from "../utils/auth"


function Navbar() {

  const userName = getUserName()

  return (

    <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-900">

      <div>

        <h1 className="text-2xl font-bold text-white">
          Live Support Dashboard
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Welcome back, {userName}
        </p>

      </div>

      <div className="flex items-center gap-4">

        <button className="relative bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition">

          <FiBell className="text-xl text-white" />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

        <div className="w-11 h-11 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-lg">

          {
            userName
              ? userName.charAt(0).toUpperCase()
              : "U"
          }

        </div>

      </div>

    </div>
  )
}

export default Navbar