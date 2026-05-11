import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
  } from "recharts"
  
  function TicketsChart({ stats }) {
  
    const data = [
      {
        name: "Open",
        value: stats.open_tickets
      },
      {
        name: "Resolved",
        value: stats.resolved_tickets
      },
      {
        name: "High Priority",
        value: stats.high_priority
      }
    ]
  
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
  
        <h2 className="text-2xl font-bold mb-6">
          Ticket Analytics
        </h2>
  
        <div className="h-80">
  
          <ResponsiveContainer width="100%" height="100%">
  
            <BarChart data={data}>
  
              <XAxis dataKey="name" />
  
              <YAxis />
  
              <Tooltip />
  
              <Bar
                dataKey="value"
                fill="#06b6d4"
                radius={[10, 10, 0, 0]}
              />
  
            </BarChart>
  
          </ResponsiveContainer>
  
        </div>
  
      </div>
    )
  }
  
  export default TicketsChart
  