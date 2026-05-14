import { useEffect, useState } from "react"

import LogsPanel from "../components/LogsPanel"

import NotificationBell from "../components/NotificationBell"

import {
  FiClipboard,
  FiCheckCircle,
  FiAlertTriangle,
  FiLayers
} from "react-icons/fi"

import API from "../services/api"

import Sidebar from "../components/Sidebar"

import StatsCard from "../components/StatsCard"

import TicketsChart from "../components/TicketsChart"

import LiveChat from "../components/LiveChat"

import AIChatbot from "../components/AIChatbot"


function Dashboard() {

  const [stats, setStats] = useState({

    total_tickets: 0,

    open_tickets: 0,

    resolved_tickets: 0,

    high_priority: 0

  })

  const [loading, setLoading] = useState(true)

  const role = localStorage.getItem(
    "role"
  )

  const fullName = localStorage.getItem(
    "full_name"
  )


  const fetchStats = async () => {

    try {

      if (role === "admin") {

        const response = await API.get(
          "/dashboard/stats"
        )

        setStats(response.data)
      }

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }


  useEffect(() => {

    fetchStats()

  }, [])


  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-2xl font-bold mb-2">
            Loading Dashboard
          </h2>

          <p className="text-slate-400">
            Fetching latest support data...
          </p>

        </div>

      </div>
    )
  }


  return (

    <div className="flex bg-slate-950 min-h-screen text-white">

      <Sidebar />


      <div className="flex-1 w-full overflow-hidden">

        <div className="p-4 md:p-8 pt-24 md:pt-8">

          {/* Header */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              {
                role === "admin" ? (

                  <>

                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      Dashboard
                    </h1>

                    <p className="text-slate-400">
                      Monitor support operations
                    </p>

                  </>

                ) : (

                  <>

                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      My Support Center
                    </h1>

                    <p className="text-slate-400">
                      Welcome back, {fullName}
                    </p>

                  </>

                )
              }

            </div>


            <div className="self-start md:self-auto">

              <NotificationBell />

            </div>

          </div>


          {/* Admin Analytics */}

          {
            role === "admin" && (

              <>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                  <StatsCard
                    title="Total Tickets"
                    value={stats.total_tickets}
                    icon={<FiLayers />}
                    color="bg-cyan-500/20 text-cyan-400"
                  />

                  <StatsCard
                    title="Open Tickets"
                    value={stats.open_tickets}
                    icon={<FiClipboard />}
                    color="bg-yellow-500/20 text-yellow-400"
                  />

                  <StatsCard
                    title="Resolved Tickets"
                    value={stats.resolved_tickets}
                    icon={<FiCheckCircle />}
                    color="bg-green-500/20 text-green-400"
                  />

                  <StatsCard
                    title="High Priority"
                    value={stats.high_priority}
                    icon={<FiAlertTriangle />}
                    color="bg-red-500/20 text-red-400"
                  />

                </div>


                <div className="mb-8">

                  <TicketsChart stats={stats} />

                </div>


                <div className="mb-8">

                  <LogsPanel />

                </div>

              </>

            )
          }


          {/* Live Chat */}

          <LiveChat />


          {/* AI Chatbot */}

          <AIChatbot />

        </div>

      </div>

    </div>
  )
}

export default Dashboard
