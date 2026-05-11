import {
    FiHome,
    FiClipboard,
    FiLogOut
  } from "react-icons/fi"
  
  import { Link, useNavigate } from "react-router-dom"
  
  function Sidebar() {
  
    const navigate = useNavigate()
  
    const logout = () => {
  
      localStorage.removeItem("token")
  
      navigate("/")
    }
  
    return (
      <div className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6">
  
        <h1 className="text-2xl font-bold text-cyan-400 mb-10">
          SupportDesk
        </h1>
  
        <nav className="space-y-4">
  
          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
          >
            <FiHome />
            Dashboard
          </Link>
  
          <Link
            to="/tickets"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition"
          >
            <FiClipboard />
            Tickets
          </Link>
  
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/20 text-red-400 transition"
          >
            <FiLogOut />
            Logout
          </button>
  
        </nav>
  
      </div>
    )
  }
  
  export default Sidebar