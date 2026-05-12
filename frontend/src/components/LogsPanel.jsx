import { useEffect, useState } from "react"

import API from "../services/api"


function LogsPanel() {

  const [logs, setLogs] = useState([])

  const [loading, setLoading] = useState(true)


  const fetchLogs = async () => {

    try {

      const response = await API.get(
        "/logs"
      )

      setLogs(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
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


      {
        loading ? (

          <div className="flex items-center justify-center py-10">

            <div className="text-center">

              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

              <p className="text-slate-400">
                Loading logs...
              </p>

            </div>

          </div>

        ) : logs.length === 0 ? (

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">

            <h3 className="text-xl font-semibold mb-2">
              No Activity Logs
            </h3>

            <p className="text-slate-400">
              System activity will appear here.
            </p>

          </div>

        ) : (

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

        )
      }

    </div>
  )
}

export default LogsPanel