import { useState } from "react"

import toast from "react-hot-toast"

import API from "../services/api"

import { isAdmin } from "../utils/auth"

import FeedbackForm from "./FeedbackForm"

import {
  useNotifications
} from "../context/NotificationContext"

import {
  FiUser,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiPaperclip,
  FiDownload
} from "react-icons/fi"


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

      return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
    }

    if (status === "Resolved") {

      return "bg-green-500/20 text-green-300 border border-green-500/30"
    }

    if (status === "In Progress") {

      return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
    }

    return "bg-slate-700 text-slate-300 border border-slate-600"
  }


  const getPriorityColor = (priority) => {

    if (priority === "High") {

      return "bg-red-500/20 text-red-300 border border-red-500/30"
    }

    if (priority === "Medium") {

      return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
    }

    return "bg-green-500/20 text-green-300 border border-green-500/30"
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

    if (!assignedTo.trim()) {

      return toast.error(
        "Enter engineer name"
      )
    }

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

    <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 rounded-3xl p-5 md:p-6 shadow-xl">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">

        <div className="flex-1">

          <h2 className="text-2xl font-bold text-white mb-3 break-words leading-tight">

            {ticket.title}

          </h2>

          <p className="text-slate-400 leading-relaxed break-words text-sm md:text-base">

            {ticket.description}

          </p>

        </div>


        <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">

          <span
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap ${getStatusColor(ticket.status)}`}
          >

            {ticket.status}

          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap ${getPriorityColor(ticket.priority)}`}
          >

            {ticket.priority} Priority

          </span>

        </div>

      </div>


      {/* Ticket Info */}

      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">

        <div className="flex items-center gap-2 text-slate-500 text-sm">

          <FiClock />

          <span>
            Ticket #{ticket.id}
          </span>

        </div>

      </div>


      {/* Attachment */}

      {
        ticket.attachment && (

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-5">

            <div className="flex items-center gap-3 mb-3">

              <FiPaperclip className="text-cyan-400" />

              <p className="text-white font-medium">
                Attachment
              </p>

            </div>

            <a
              href={`http://127.0.0.1:8000/${ticket.attachment}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-4 py-3 rounded-xl text-black font-semibold"
            >

              <FiDownload />

              Open Attachment

            </a>

          </div>

        )
      }


      {/* Assigned Engineer */}

      {
        ticket.assigned_to && (

          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 mb-5">

            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">

              <FiUser className="text-cyan-400" />

            </div>

            <div>

              <p className="text-xs text-slate-500 mb-1">

                Assigned Engineer

              </p>

              <p className="text-cyan-400 font-semibold">

                {ticket.assigned_to}

              </p>

            </div>

          </div>

        )
      }


      {/* Admin Assignment */}

      {
        isAdmin() && (

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-5">

            <p className="text-sm text-slate-400 mb-3">

              Assign Support Engineer

            </p>

            <div className="flex flex-col md:flex-row gap-3">

              <input
                type="text"
                placeholder="Engineer name"
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(e.target.value)
                }
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white focus:border-cyan-500 transition-all"
              />

              <button
                onClick={assignTicket}
                className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-5 py-3 rounded-xl font-semibold text-black whitespace-nowrap"
              >

                Assign

              </button>

            </div>

          </div>

        )
      }


      {/* Actions */}

      <div className="flex flex-col sm:flex-row gap-3">

        {
          ticket.status !== "Resolved" && (

            <button
              onClick={resolveTicket}
              className="flex-1 bg-green-500 hover:bg-green-600 transition-all duration-300 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >

              <FiCheckCircle />

              Resolve

            </button>

          )
        }


        {
          isAdmin() && (

            <button
              onClick={deleteTicket}
              className="flex-1 bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >

              <FiTrash2 />

              Delete

            </button>

          )
        }

      </div>


      {/* Feedback */}

      {
        ticket.status === "Resolved" && (

          <div className="mt-6 border-t border-slate-800 pt-5">

            <FeedbackForm
              ticketId={ticket.id}
            />

          </div>

        )
      }

    </div>
  )
}

export default TicketCard
