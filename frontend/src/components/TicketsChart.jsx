import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
  } from "recharts"
  
  
  function TicketsChart({ stats = {} }) {
  
    const data = [
      {
        name: "Open",
        tickets: stats?.open_tickets || 0
      },
      {
        name: "Resolved",
        tickets: stats?.resolved_tickets || 0
      },
      {
        name: "High Priority",
        tickets: stats?.high_priority || 0
      },
      {
        name: "Total",
        tickets: stats?.total_tickets || 0
      }
    ]
  
    return (
  
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg mt-8">
  
        <h2 className="text-2xl font-bold mb-6 text-white">
          Ticket Analytics
        </h2>
  
        <div className="h-[350px]">
  
          <ResponsiveContainer width="100%" height="100%">
  
            <BarChart data={data}>
  
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
              />
  
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
              />
  
              <YAxis
                stroke="#94a3b8"
              />
  
              <Tooltip />
  
              <Bar
                dataKey="tickets"
                fill="#06b6d4"
                radius={[8, 8, 0, 0]}
              />
  
            </BarChart>
  
          </ResponsiveContainer>
  
        </div>
  
      </div>
    )
  }
  
  export default TicketsChart