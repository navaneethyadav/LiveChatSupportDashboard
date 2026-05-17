import { useEffect, useState } from "react"

import Sidebar from "../components/Sidebar"

import Navbar from "../components/Navbar"

import API from "../services/api"

import toast from "react-hot-toast"


function Feedbacks() {

  const [feedbacks, setFeedbacks] = useState([])

  const [loading, setLoading] = useState(true)


  const fetchFeedbacks = async () => {

    try {

      const response = await API.get(
        "/feedback"
      )

      setFeedbacks(response.data)

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to load feedbacks"
      )

    } finally {

      setLoading(false)
    }
  }


  useEffect(() => {

    fetchFeedbacks()

  }, [])


  const getRatingColor = (rating) => {

    if (rating >= 4) {

      return "text-green-400"
    }

    if (rating === 3) {

      return "text-yellow-400"
    }

    return "text-red-400"
  }


  return (

    <div className="flex bg-slate-950 text-white min-h-screen">

      <Sidebar />

      <div className="flex-1 overflow-hidden">

        <Navbar />

        <div className="p-4 md:p-8">

          <div className="mb-8">

            <h1 className="text-3xl md:text-4xl font-bold mb-2">

              Customer Feedbacks

            </h1>

            <p className="text-slate-400">

              Track customer satisfaction and service quality

            </p>

          </div>


          {
            loading ? (

              <div className="flex items-center justify-center py-20">

                <div className="text-center">

                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                  <p className="text-slate-400">

                    Loading feedbacks...

                  </p>

                </div>

              </div>

            ) : (

              feedbacks.length === 0 ? (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

                  <h2 className="text-2xl font-bold mb-3">

                    No Feedbacks Yet

                  </h2>

                  <p className="text-slate-400">

                    Customer feedback will appear here.

                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {
                    feedbacks.map((feedback) => (

                      <div
                        key={feedback.id}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
                      >

                        <div className="flex items-center justify-between mb-4">

                          <div>

                            <p className="text-slate-500 text-sm mb-1">

                              Ticket ID

                            </p>

                            <h2 className="text-xl font-bold">

                              #{feedback.ticket_id}

                            </h2>

                          </div>

                          <div>

                            <span className={`text-2xl font-bold ${getRatingColor(feedback.rating)}`}>

                              {feedback.rating}/5

                            </span>

                          </div>

                        </div>


                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">

                          <p className="text-slate-300 leading-relaxed">

                            {feedback.comment}

                          </p>

                        </div>

                      </div>

                    ))
                  }

                </div>

              )

            )
          }

        </div>

      </div>

    </div>
  )
}

export default Feedbacks
