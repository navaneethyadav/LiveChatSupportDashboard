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
  FiDownload,
  FiSend,
  FiChevronDown,
  FiChevronUp,
  FiMessageSquare
} from "react-icons/fi"


function TicketCard({
  ticket,
  refreshTickets,
  supportUsers = []
}) {

  const [assignedTo, setAssignedTo] = useState("")

  const [replies, setReplies] = useState([])

  const [replyMessage, setReplyMessage] = useState("")

  const [loadingReplies, setLoadingReplies] = useState(false)

  const [conversationOpen, setConversationOpen] = useState(false)

  const [repliesLoaded, setRepliesLoaded] = useState(false)

  const [sendingReply, setSendingReply] = useState(false)

  const {
    addNotification
  } = useNotifications()


  // =========================================
  // FORMAT TIMESTAMP
  // =========================================

  const formatReplyTime = (timestamp) => {

    if (!timestamp) {

      return "Unknown time"
    }

    try {

      const date = new Date(timestamp)

      return date.toLocaleString([], {

        year: "numeric",

        month: "short",

        day: "numeric",

        hour: "2-digit",

        minute: "2-digit"

      })

    } catch (error) {

      return "Invalid date"
    }
  }


  // =========================================
  // FETCH REPLIES
  // =========================================

  const fetchReplies = async () => {

    try {

      setLoadingReplies(true)

      const response = await API.get(
        `/tickets/${ticket.id}/replies`
      )

      setReplies(response.data)

      setRepliesLoaded(true)

    } catch (error) {

      console.log(
        "Replies Fetch Error:",
        error
      )

    } finally {

      setLoadingReplies(false)
    }
  }


  // =========================================
  // TOGGLE CONVERSATION
  // =========================================

  const toggleConversation = async () => {

    const newState = !conversationOpen

    setConversationOpen(newState)

    if (
      newState &&
      !repliesLoaded
    ) {

      await fetchReplies()
    }
  }


  // =========================================
  // SEND REPLY
  // =========================================

  const sendReply = async () => {

    if (!replyMessage.trim()) {

      return toast.error(
        "Reply message required"
      )
    }

    try {

      setSendingReply(true)

      await API.post(
        `/tickets/${ticket.id}/replies`,
        {
          message: replyMessage.trim()
        }
      )

      toast.success(
        "Reply sent successfully"
      )

      setReplyMessage("")

      await fetchReplies()

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to send reply"
      )

    } finally {

      setSendingReply(false)
    }
  }


  // =========================================
  // RESOLVE TICKET
  // =========================================

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

      console.log(error)

      toast.error(
        "Failed to update ticket"
      )
    }
  }


  // =========================================
  // DELETE TICKET
  // =========================================

  const deleteTicket = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    )

    if (!confirmDelete) {

      return
    }

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

      console.log(error)

      toast.error(
        "Failed to delete ticket"
      )
    }
  }


  // =========================================
  // ASSIGN TICKET
  // =========================================

  const assignTicket = async () => {

    if (!assignedTo) {

      return toast.error(
        "Select support engineer"
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

      console.log(error)

      toast.error(
        "Failed to assign ticket"
      )
    }
  }


  // =========================================
  // STATUS COLORS
  // =========================================

  const getStatusColor = (status) => {

    switch (status) {

      case "Open":

        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"

      case "Resolved":

        return "bg-green-500/20 text-green-300 border border-green-500/30"

      case "In Progress":

        return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"

      default:

        return "bg-slate-700 text-slate-300 border border-slate-600"
    }
  }


  // =========================================
  // PRIORITY COLORS
  // =========================================

  const getPriorityColor = (priority) => {

    switch (priority) {

      case "High":

        return "bg-red-500/20 text-red-300 border border-red-500/30"

      case "Medium":

        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"

      default:

        return "bg-green-500/20 text-green-300 border border-green-500/30"
    }
  }


  // =========================================
  // ATTACHMENT URL
  // =========================================

  const attachmentUrl =
    ticket.attachment
      ? `${import.meta.env.VITE_API_URL}/${ticket.attachment}`
      : null


  return (

    <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 rounded-3xl p-5 md:p-6 shadow-xl">

      {/* HEADER */}

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


      {/* TICKET INFO */}

      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">

        <div className="flex items-center gap-2 text-slate-500 text-sm">

          <FiClock />

          <span>

            Ticket #{ticket.id}

          </span>

        </div>

      </div>


      {/* ATTACHMENT */}

      {
        attachmentUrl && (

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-5">

            <div className="flex items-center gap-3 mb-3">

              <FiPaperclip className="text-cyan-400" />

              <p className="text-white font-medium">

                Attachment

              </p>

            </div>

            <a
              href={attachmentUrl}
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


      {/* ASSIGNED ENGINEER */}

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


      {/* CONVERSATION TOGGLE */}

      <button
        onClick={toggleConversation}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-2xl px-5 py-4 transition-all duration-300 mb-5"
      >

        <div className="flex items-center gap-3">

          <FiMessageSquare className="text-cyan-400" />

          <span className="font-semibold text-white">

            Ticket Conversation

          </span>

        </div>

        {
          conversationOpen
            ? <FiChevronUp />
            : <FiChevronDown />
        }

      </button>


      {/* CONVERSATION */}

      {
        conversationOpen && (

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-5">

            <div className="space-y-4 max-h-80 overflow-y-auto mb-5 pr-1">

              {
                loadingReplies ? (

                  <p className="text-slate-400 text-sm">

                    Loading replies...

                  </p>

                ) : replies.length === 0 ? (

                  <div className="text-center py-8">

                    <p className="text-slate-500 text-sm">

                      No replies yet

                    </p>

                  </div>

                ) : (

                  replies.map((reply) => (

                    <div
                      key={reply.id}
                      className="bg-slate-900 border border-slate-700 rounded-2xl p-4"
                    >

                      <div className="flex items-start justify-between gap-4 mb-3">

                        <div>

                          <h3 className="font-semibold text-cyan-400 text-sm md:text-base">

                            {reply.sender_name}

                          </h3>

                          <p className="text-xs text-slate-500 mt-1">

                            {formatReplyTime(reply.created_at)}

                          </p>

                        </div>

                        <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-300 whitespace-nowrap">

                          {reply.sender_role}

                        </span>

                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">

                        {reply.message}

                      </p>

                    </div>

                  ))
                )
              }

            </div>

            <div className="flex flex-col md:flex-row gap-3">

              <textarea
                rows="3"
                placeholder="Write reply..."
                value={replyMessage}
                onChange={(e) =>
                  setReplyMessage(e.target.value)
                }
                className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 outline-none text-white focus:border-cyan-500 resize-none"
              />

              <button
                onClick={sendReply}
                disabled={sendingReply}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 px-5 py-3 rounded-2xl font-semibold text-black flex items-center justify-center gap-2 min-w-[140px]"
              >

                <FiSend />

                {
                  sendingReply
                    ? "Sending..."
                    : "Reply"
                }

              </button>

            </div>

          </div>

        )
      }


      {/* ADMIN ASSIGNMENT */}

      {
        isAdmin() && (

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-5">

            <p className="text-sm text-slate-400 mb-3">

              Assign Support Engineer

            </p>

            <div className="flex flex-col md:flex-row gap-3">

              <select
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(e.target.value)
                }
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none text-white focus:border-cyan-500"
              >

                <option value="">

                  Select Engineer

                </option>

                {
                  supportUsers.map((user) => (

                    <option
                      key={user.id}
                      value={user.full_name}
                    >

                      {user.full_name} ({user.role})

                    </option>

                  ))
                }

              </select>

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


      {/* ACTIONS */}

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


      {/* FEEDBACK */}

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
