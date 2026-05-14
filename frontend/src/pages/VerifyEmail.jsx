import { useEffect, useState } from "react"

import { useParams, useNavigate } from "react-router-dom"

import toast, { Toaster } from "react-hot-toast"

import API from "../services/api"


function VerifyEmail() {

  const { token } = useParams()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

  const [verified, setVerified] = useState(false)


  useEffect(() => {

    verifyEmail()

  }, [])


  const verifyEmail = async () => {

    try {

      const response = await API.post(
        "/verify-email",
        {
          token
        }
      )

      toast.success(
        response.data.message
      )

      setVerified(true)

      setTimeout(() => {

        navigate("/")

      }, 3000)

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Email verification failed"
      )

    } finally {

      setLoading(false)
    }
  }


  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">

        {
          loading ? (

            <>

              <h1 className="text-3xl font-bold text-cyan-400 mb-4">
                Verifying Email...
              </h1>

              <p className="text-slate-400">
                Please wait
              </p>

            </>

          ) : verified ? (

            <>

              <h1 className="text-3xl font-bold text-green-400 mb-4">
                Email Verified
              </h1>

              <p className="text-slate-300">
                Your email has been verified successfully.
              </p>

              <p className="text-slate-500 mt-3">
                Redirecting to login...
              </p>

            </>

          ) : (

            <>

              <h1 className="text-3xl font-bold text-red-400 mb-4">
                Verification Failed
              </h1>

              <p className="text-slate-300">
                Invalid or expired verification link.
              </p>

            </>

          )
        }

      </div>

    </div>
  )
}

export default VerifyEmail
