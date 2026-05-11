import { useEffect, useState } from "react"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import StatsCard from "../components/StatsCard"
import TicketsChart from "../components/TicketsChart"

import API from "../services/api"

function Dashboard() {

  const [stats, setStats] = useState({
    total_tickets: 0,
    open_tickets: 0,
    resolved_tickets: 0,
    high_priority: 0
  })

  const fetchStats = async () => {

    try {

      const response = await API.get(
        "/dashboard/stats"
      )

      setStats(response.data)

    } catch (error) {

      console.log(error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <div className="mb-8">

            <h1 className="text-4xl font-bold mb-2">
              Welcome Back 👋
            </h1>

            <p className="text-slate-400">
              Monitor your support operations in real-time.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <StatsCard
              title="Total Tickets"
              value={stats.total_tickets}
              color="text-cyan-400"
            />

            <StatsCard
              title="Open Tickets"
              value={stats.open_tickets}
              color="text-yellow-400"
            />

            <StatsCard
              title="Resolved"
              value={stats.resolved_tickets}
              color="text-green-400"
            />

            <StatsCard
              title="High Priority"
              value={stats.high_priority}
              color="text-red-400"
            />

          </div>

          <TicketsChart stats={stats} />

        </div>

      </div>

    </div>
  )
}

export default Dashboard