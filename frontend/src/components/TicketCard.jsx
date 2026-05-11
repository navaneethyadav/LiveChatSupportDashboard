import toast from "react-hot-toast"

import API from "../services/api"

function TicketCard({
  ticket,
  refreshTickets
}) {

  const getStatusColor = (status) => {

    if (status === "Open") {
      return "bg-yellow-500/20 text-yellow-400"
    }

    if (status === "Resolved") {
      return "bg-green-500/20 text-green-400"
    }

    return "bg-slate-700 text-slate-300"
  }

  const getPriorityColor = (priority) => {

    if (priority === "High") {
      return "text-red-400"
    }

    if (priority === "Medium") {
      return "text-yellow-400"
    }

    return "text-green-400"
  }

  const resolveTicket = async () => {

    try {

      await API.put(
        `/tickets/${ticket.id}?status=Resolved`
      )

      toast.success(
        "Ticket resolved"
      )

      refreshTickets()

    } catch (error) {

      toast.error(
        "Failed to update ticket"
      )
    }
  }

  const deleteTicket = async () => {

    try {

      await API.delete(
        `/tickets/${ticket.id}`
      )

      toast.success(
        "Ticket deleted"
      )

      refreshTickets()

    } catch (error) {

      toast.error(
        "Failed to delete ticket"
      )
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

      <div className="flex items-start justify-between mb-4">

        <div>

          <h2 className="text-xl font-semibold mb-2">
            {ticket.title}
          </h2>

          <p className="text-slate-400 text-sm">
            {ticket.description}
          </p>

        </div>

        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.status)}`}>
          {ticket.status}
        </span>

      </div>

      <div className="flex items-center justify-between mt-6">

        <p className={`font-semibold ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority} Priority
        </p>

        <p className="text-slate-500 text-sm">
          Ticket #{ticket.id}
        </p>

      </div>

      <div className="flex gap-3 mt-6">

        {
          ticket.status !== "Resolved" && (
            <button
              onClick={resolveTicket}
              className="flex-1 bg-green-500 hover:bg-green-600 transition py-3 rounded-xl font-semibold"
            >
              Resolve
            </button>
          )
        }

        <button
          onClick={deleteTicket}
          className="flex-1 bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-semibold"
        >
          Delete
        </button>

      </div>

    </div>
  )
}

export default TicketCard