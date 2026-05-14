import { useState } from "react"

import { Link } from "react-router-dom"

import toast, { Toaster } from "react-hot-toast"

import { FiMail } from "react-icons/fi"

import API from "../services/api"


function ForgotPassword() {

  const [email, setEmail] = useState("")

  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      const response = await API.post(
        "/forgot-password",
        { email }
      )

      toast.success(
        response.data.message
      )

      setEmail("")

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to send reset email"
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
            Forgot Password
          </h1>

          <p className="text-slate-400">
            Enter your email to reset password
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Email
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">

              <FiMail className="text-slate-400" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                ? "Sending Reset Link..."
                : "Send Reset Link"
            }

          </button>

        </form>


        <p className="text-center text-slate-400 mt-6">

          Back to Login

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

export default ForgotPassword
