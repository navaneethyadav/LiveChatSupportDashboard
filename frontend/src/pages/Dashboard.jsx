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

    <div className="flex bg-slate-950 min-h-screen text-white overflow-visible">

      <Sidebar />

      <div className="flex-1 p-8 overflow-visible">

        <div className="flex items-center justify-between mb-8 overflow-visible">

          <div>

            <h1 className="text-4xl font-bold mb-2">
              Dashboard
            </h1>

            <p className="text-slate-400">
              Monitor support operations
            </p>

          </div>

          <NotificationBell />

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

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


        <TicketsChart stats={stats} />

        <LogsPanel />

        <LiveChat />

      </div>

    </div>
  )
}

export default Dashboard