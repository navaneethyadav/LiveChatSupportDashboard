import { useEffect, useState } from "react"

import API from "../services/api"


function LogsPanel() {

  const [logs, setLogs] = useState([])

  const fetchLogs = async () => {

    try {

      const response = await API.get(
        "/logs"
      )

      setLogs(response.data)

    } catch (error) {

      console.log(error)
    }
  }

  useEffect(() => {

    fetchLogs()

  }, [])

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Activity Logs
      </h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">

        {
          logs.map((log) => (

            <div
              key={log.id}
              className="bg-slate-800 rounded-xl p-4 border border-slate-700"
            >

              <p className="text-slate-200">
                {log.action}
              </p>

            </div>
          ))
        }

      </div>

    </div>
  )
}

export default LogsPanel