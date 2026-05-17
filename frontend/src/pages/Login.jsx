import { useState } from "react"

import {
  Link,
  useNavigate
} from "react-router-dom"

import {
  FiMail,
  FiLock
} from "react-icons/fi"

import toast, {
  Toaster
} from "react-hot-toast"

import API from "../services/api"

import {
  connectSocket
} from "../services/socket"

function Login() {

  const navigate = useNavigate()

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({

      email: "",

      password: ""

    })

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    })
  }

  // =====================================
  // LOGIN SUBMIT
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    // ===================================
    // PREVENT MULTIPLE REQUESTS
    // ===================================

    if (loading) {

      return
    }

    try {

      setLoading(true)

      const response =
        await API.post(

          "/login",

          formData
        )

      // =================================
      // STORE AUTH DATA
      // =================================

      localStorage.setItem(
        "token",
        response.data.access_token
      )

      localStorage.setItem(
        "role",
        response.data.role
      )

      localStorage.setItem(
        "full_name",
        response.data.full_name
      )

      localStorage.setItem(
        "email",
        response.data.email
      )

      localStorage.setItem(
        "user_id",
        response.data.user_id
      )

      // =================================
      // CONNECT SOCKET IMMEDIATELY
      // =================================

      await connectSocket()

      // =================================
      // SUCCESS
      // =================================

      toast.success(
        "Login successful"
      )

      // =================================
      // REDIRECT
      // =================================

      navigate("/dashboard", {
        replace: true
      })

    } catch (error) {

      console.log(
        "Login Error:",
        error
      )

      toast.error(

        error?.response?.data?.detail ||

        "Login failed"
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-cyan-400 mb-2">

            Welcome Back

          </h1>

          <p className="text-slate-400">

            Login to continue

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* EMAIL */}

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
                autoComplete="email"
                className="w-full bg-transparent outline-none px-3 py-4 text-white"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block mb-2 text-sm text-slate-300">

              Password

            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">

              <FiLock className="text-slate-400" />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full bg-transparent outline-none px-3 py-4 text-white"
              />

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              loading
                ? "bg-cyan-700 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >

            {
              loading
                ? "Logging in..."
                : "Login"
            }

          </button>

        </form>

        {/* FORGOT PASSWORD */}

        <div className="mt-4 text-right">

          <Link
            to="/forgot-password"
            className="text-cyan-400 hover:underline text-sm"
          >

            Forgot Password?

          </Link>

        </div>

        {/* SIGNUP */}

        <p className="text-center text-slate-400 mt-6">

          Don't have an account?

          <Link
            to="/signup"
            className="text-cyan-400 ml-2 hover:underline"
          >

            Signup

          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login
