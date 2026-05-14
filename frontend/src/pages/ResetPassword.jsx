import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

import toast, { Toaster } from "react-hot-toast"

import { FiLock } from "react-icons/fi"

import API from "../services/api"


function ResetPassword() {

  const navigate = useNavigate()

  const { token } = useParams()

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: ""
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

    if (
      formData.new_password !==
      formData.confirm_password
    ) {

      toast.error(
        "Passwords do not match"
      )

      return
    }

    try {

      setLoading(true)

      const response = await API.post(
        "/reset-password",
        {
          token,
          new_password: formData.new_password
        }
      )

      toast.success(
        response.data.message
      )

      setTimeout(() => {
        navigate("/")
      }, 2000)

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Password reset failed"
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
            Reset Password
          </h1>

          <p className="text-slate-400">
            Create a new secure password
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              New Password
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">

              <FiLock className="text-slate-400" />

              <input
                type="password"
                name="new_password"
                placeholder="Enter new password"
                value={formData.new_password}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none px-3 py-4 text-white"
              />

            </div>

          </div>


          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Confirm Password
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">

              <FiLock className="text-slate-400" />

              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm password"
                value={formData.confirm_password}
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
                ? "Resetting Password..."
                : "Reset Password"
            }

          </button>

        </form>

      </div>

    </div>
  )
}

export default ResetPassword
