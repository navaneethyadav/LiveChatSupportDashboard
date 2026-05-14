import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"

import {
  FiUser,
  FiMail,
  FiLock
} from "react-icons/fi"

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

  const [verificationSent, setVerificationSent] = useState(false)

  const [resending, setResending] = useState(false)


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

      const response = await API.post(
        "/signup",
        formData
      )

      toast.success(
        response.data.message ||
        "Account created successfully"
      )

      setVerificationSent(true)

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Signup failed"
      )

    } finally {

      setLoading(false)
    }
  }


  const resendVerification = async () => {

    try {

      setResending(true)

      const response = await API.post(
        "/resend-verification",
        {
          email: formData.email
        }
      )

      toast.success(
        response.data.message
      )

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to resend verification email"
      )

    } finally {

      setResending(false)
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


        {
          verificationSent ? (

            <div className="space-y-6">

              <div className="bg-slate-800 border border-cyan-500 rounded-xl p-5">

                <h2 className="text-2xl font-bold text-cyan-400 mb-3">
                  Verification Email Sent
                </h2>

                <p className="text-slate-300 leading-7">
                  Please check your inbox and verify your email
                  before logging in.
                </p>

                <p className="text-slate-400 mt-4 break-all">
                  {formData.email}
                </p>

              </div>


              <button
                onClick={resendVerification}
                disabled={resending}
                className="w-full bg-slate-800 hover:bg-slate-700 transition-all duration-300 py-4 rounded-xl font-semibold text-white border border-slate-700"
              >

                {
                  resending
                    ? "Resending..."
                    : "Resend Verification Email"
                }

              </button>


              <button
                onClick={() => navigate("/")}
                className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 py-4 rounded-xl font-semibold text-lg"
              >
                Go To Login
              </button>

            </div>

          ) : (

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


              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">

                <p className="text-sm text-slate-300 mb-2">
                  Password Requirements:
                </p>

                <ul className="text-xs text-slate-400 space-y-1">

                  <li>
                    • Minimum 8 characters
                  </li>

                  <li>
                    • One uppercase letter
                  </li>

                  <li>
                    • One lowercase letter
                  </li>

                  <li>
                    • One number
                  </li>

                  <li>
                    • One special character
                  </li>

                </ul>

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

          )
        }


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
