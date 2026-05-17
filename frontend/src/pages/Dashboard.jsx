import { useEffect, useRef, useState } from "react"

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

  const hasFetchedRef = useRef(false)

  const role = localStorage.getItem(
    "role"
  )

  const fullName = localStorage.getItem(
    "full_name"
  )


  // =====================================
  // FETCH STATS
  // =====================================

  const fetchStats = async () => {

    try {

      if (role !== "admin") {

        setLoading(false)

        return
      }

      const response = await API.get(
        "/dashboard/stats"
      )

      setStats(response.data)

    } catch (error) {

      console.log(
        "Dashboard Stats Error:",
        error
      )

    } finally {

      setLoading(false)
    }
  }


  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    // PREVENT DOUBLE API CALLS
    if (hasFetchedRef.current) {

      return
    }

    hasFetchedRef.current = true

    fetchStats()

  }, [])


  // =====================================
  // LOADING
  // =====================================

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

    <div className="flex min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* SIDEBAR */}

      <Sidebar />


      {/* MAIN CONTENT */}

      <main className="flex-1 overflow-y-auto">

        <div className="p-4 md:p-8 pt-24 md:pt-8 max-w-[1700px] mx-auto">


          {/* HEADER */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

            <div>

              {
                role === "admin"

                  ? (

                    <>

                      <h1 className="text-4xl font-bold mb-3 tracking-tight">

                        Support Dashboard

                      </h1>

                      <p className="text-slate-400 text-lg">

                        Monitor support operations and real-time activities

                      </p>

                    </>

                  )

                  : (

                    <>

                      <h1 className="text-4xl font-bold mb-3 tracking-tight">

                        My Support Center

                      </h1>

                      <p className="text-slate-400 text-lg">

                        Welcome back, {fullName}

                      </p>

                    </>

                  )
              }

            </div>


            {/* NOTIFICATION */}

            <div className="self-start lg:self-auto">

              <NotificationBell />

            </div>

          </div>


          {/* ADMIN DASHBOARD */}

          {
            role === "admin" && (

              <>

                {/* STATS */}

                <section className="mb-10">

                  <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">

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

                </section>


                {/* CHART + LOGS */}

                <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">

                  <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">

                    <div className="mb-6">

                      <h2 className="text-2xl font-bold mb-2">

                        Ticket Analytics

                      </h2>

                      <p className="text-slate-400">

                        Overview of support ticket performance

                      </p>

                    </div>

                    <TicketsChart stats={stats} />

                  </div>


                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-hidden">

                    <div className="mb-6">

                      <h2 className="text-2xl font-bold mb-2">

                        Activity Logs

                      </h2>

                      <p className="text-slate-400">

                        Latest platform activities

                      </p>

                    </div>

                    <LogsPanel />

                  </div>

                </section>

              </>

            )
          }


          {/* LIVE CHAT */}

          <section className="mb-10">

            <LiveChat />

          </section>

        </div>

      </main>


      {/* AI CHATBOT */}

      <AIChatbot />

    </div>
  )
}

export default Dashboard
