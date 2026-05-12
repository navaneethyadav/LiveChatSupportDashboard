import { useState } from "react"

import toast from "react-hot-toast"

import API from "../services/api"

import { isAdmin } from "../utils/auth"

import FeedbackForm from "./FeedbackForm"

import {
  useNotifications
} from "../context/NotificationContext"


function TicketCard({
  ticket,
  refreshTickets
}) {

  const [assignedTo, setAssignedTo] = useState("")


  const {
    addNotification
  } = useNotifications()


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

      addNotification(
        `Ticket #${ticket.id} resolved`
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

      addNotification(
        `Ticket #${ticket.id} deleted`
      )

      refreshTickets()

    } catch (error) {

      toast.error(
        "Failed to delete ticket"
      )
    }
  }


  const assignTicket = async () => {

    try {

      await API.put(
        `/tickets/${ticket.id}/assign`,
        {
          assigned_to: assignedTo
        }
      )

      toast.success(
        "Ticket assigned successfully"
      )

      addNotification(
        `Ticket #${ticket.id} assigned to ${assignedTo}`
      )

      refreshTickets()

      setAssignedTo("")

    } catch (error) {

      toast.error(
        "Failed to assign ticket"
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


      {
        ticket.assigned_to && (

          <div className="mt-4">

            <p className="text-sm text-cyan-400">

              Assigned To:
              {" "}
              <span className="font-semibold">
                {ticket.assigned_to}
              </span>

            </p>

          </div>
        )
      }


      {
        isAdmin() && (

          <div className="mt-4">

            <p className="text-sm text-slate-400 mb-2">
              Assign Support Engineer
            </p>

            <div className="flex gap-2">

              <input
                type="text"
                placeholder="Engineer name"
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(e.target.value)
                }
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 outline-none"
              />

              <button
                onClick={assignTicket}
                className="bg-cyan-500 hover:bg-cyan-600 px-4 rounded-lg font-semibold"
              >
                Assign
              </button>

            </div>

          </div>
        )
      }


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


        {
          isAdmin() && (

            <button
              onClick={deleteTicket}
              className="flex-1 bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-semibold"
            >
              Delete
            </button>

          )
        }

      </div>


      {
        ticket.status === "Resolved" && (

          <FeedbackForm
            ticketId={ticket.id}
          />
        )
      }

    </div>
  )
}

export default TicketCard