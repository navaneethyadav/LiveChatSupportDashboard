import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiUser, FiMail, FiLock } from "react-icons/fi"
import toast, { Toaster } from "react-hot-toast"

import API from "../services/api"

function Signup() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      await API.post(
        "/signup",
        formData
      )

      toast.success(
        "Account created successfully"
      )

      setTimeout(() => {
        navigate("/")
      }, 1500)

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Signup failed"
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-cyan-400 mb-2">
            Create Account
          </h1>

          <p className="text-slate-400">
            Signup to continue
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Full Name
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">

              <FiUser className="text-slate-400" />

              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none px-3 py-4 text-white"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Email
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">

              <FiMail className="text-slate-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none px-3 py-4 text-white"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Password
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">

              <FiLock className="text-slate-400" />

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none px-3 py-4 text-white"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 py-4 rounded-xl font-semibold text-lg"
          >

            {
              loading
                ? "Creating Account..."
                : "Signup"
            }

          </button>

        </form>

        <p className="text-center text-slate-400 mt-6">

          Already have an account?

          <Link
            to="/"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Signup