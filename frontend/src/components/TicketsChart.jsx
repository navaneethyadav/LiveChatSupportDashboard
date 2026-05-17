import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"


function TicketsChart({
  stats = {}
}) {

  // =====================================
  // CHART DATA
  // =====================================

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


  // =====================================
  // CUSTOM TOOLTIP
  // =====================================

  const CustomTooltip = ({
    active,
    payload,
    label
  }) => {

    if (
      active &&
      payload &&
      payload.length
    ) {

      return (

        <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 shadow-2xl">

          <p className="text-slate-300 text-sm mb-1">

            {label}

          </p>

          <p className="text-cyan-400 font-bold text-base">

            {payload[0].value} Tickets

          </p>

        </div>
      )
    }

    return null
  }


  return (

    <div className="w-full h-[350px] min-h-[350px]">

      <ResponsiveContainer
        width="100%"
        height={350}
        debounce={50}
      >

        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 5
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 12
            }}
          />

          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{
              fontSize: 12
            }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "rgba(6, 182, 212, 0.08)"
            }}
          />

          <Bar
            dataKey="tickets"
            fill="#06b6d4"
            radius={[12, 12, 0, 0]}
            maxBarSize={70}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  )
}

export default TicketsChart
