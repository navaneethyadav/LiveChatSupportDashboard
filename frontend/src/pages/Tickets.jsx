import { useEffect, useState } from "react"

import toast, { Toaster } from "react-hot-toast"

import Sidebar from "../components/Sidebar"

import Navbar from "../components/Navbar"

import TicketCard from "../components/TicketCard"

import CreateTicketModal from "../components/CreateTicketModal"

import API from "../services/api"


function Tickets() {

  const [tickets, setTickets] = useState([])

  const [supportUsers, setSupportUsers] = useState([])

  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)

  const [search, setSearch] = useState("")

  const [priorityFilter, setPriorityFilter] = useState("")


  // =========================================
  // FETCH TICKETS
  // =========================================

  const fetchTickets = async () => {

    try {

      const response = await API.get(
        "/tickets"
      )

      setTickets(response.data)

    } catch (error) {

      toast.error(
        "Failed to fetch tickets"
      )

    } finally {

      setLoading(false)
    }
  }


  // =========================================
  // FETCH SUPPORT USERS
  // =========================================

  const fetchSupportUsers = async () => {

    try {

      const response = await API.get(
        "/users"
      )

      const filteredUsers =
        response.data.filter((user) =>

          user.role === "admin" ||
          user.role === "support"
        )

      setSupportUsers(filteredUsers)

    } catch (error) {

      console.log(error)
    }
  }


  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {

    let mounted = true

    const loadData = async () => {

      if (!mounted) {

        return
      }

      await Promise.all([

        fetchTickets(),

        fetchSupportUsers()

      ])
    }

    loadData()

    return () => {

      mounted = false
    }

  }, [])


  // =========================================
  // FILTER TICKETS
  // =========================================

  const filteredTickets = tickets.filter((ticket) => {

    const matchesSearch =
      ticket.title.toLowerCase().includes(
        search.toLowerCase()
      )

    const matchesPriority =
      priorityFilter === "" ||
      ticket.priority === priorityFilter

    return (
      matchesSearch &&
      matchesPriority
    )
  })


  return (

    <div className="flex bg-slate-950 text-white min-h-screen">

      <Toaster position="top-right" />

      <Sidebar />

      <div className="flex-1 overflow-hidden">

        <Navbar />

        <div className="p-4 md:p-8">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">

                Tickets

              </h1>

              <p className="text-slate-400">

                Manage customer support tickets

              </p>

            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-xl font-semibold"
            >

              + Create Ticket

            </button>

          </div>


          {/* FILTERS */}

          <div className="flex flex-col md:flex-row gap-4 mb-8">

            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none"
            />


            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none"
            >

              <option value="">
                All Priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>

            </select>

          </div>


          {/* CONTENT */}

          {
            loading ? (

              <div className="flex items-center justify-center py-20">

                <div className="text-center">

                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                  <p className="text-slate-400">

                    Loading tickets...

                  </p>

                </div>

              </div>

            ) : (

              filteredTickets.length === 0 ? (

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

                  <h2 className="text-2xl font-bold mb-3">

                    No Tickets Found

                  </h2>

                  <p className="text-slate-400">

                    Try adjusting your search or create a new ticket.

                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                  {
                    filteredTickets.map((ticket) => (

                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        refreshTickets={fetchTickets}
                        supportUsers={supportUsers}
                      />

                    ))
                  }

                </div>

              )

            )
          }

        </div>

      </div>


      {/* CREATE MODAL */}

      {
        showModal && (

          <CreateTicketModal
            closeModal={() => setShowModal(false)}
            refreshTickets={fetchTickets}
          />

        )
      }

    </div>
  )
}

export default Tickets
