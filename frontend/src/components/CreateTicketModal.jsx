import { useEffect, useState } from "react"

import toast from "react-hot-toast"

import API from "../services/api"


function CreateTicketModal({
  closeModal,
  refreshTickets
}) {

  const [title, setTitle] = useState("")

  const [description, setDescription] = useState("")

  const [priority, setPriority] = useState("Medium")

  const [categoryId, setCategoryId] = useState("")

  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(false)


  const fetchCategories = async () => {

    try {

      const response = await API.get(
        "/categories"
      )

      setCategories(response.data)

    } catch (error) {

      toast.error(
        "Failed to load categories"
      )
    }
  }


  useEffect(() => {

    fetchCategories()

  }, [])


  const handleCreateTicket = async (e) => {

    e.preventDefault()

    if (
      !title ||
      !description ||
      !categoryId
    ) {

      return toast.error(
        "Please fill all fields"
      )
    }

    try {

      setLoading(true)

      const userId = localStorage.getItem(
        "user_id"
      )

      await API.post("/tickets", {

        title,

        description,

        priority,

        category_id: Number(categoryId),

        created_by: Number(userId)

      })

      toast.success(
        "Ticket created successfully"
      )

      refreshTickets()

      closeModal()

    } catch (error) {

      toast.error(
        "Failed to create ticket"
      )

    } finally {

      setLoading(false)
    }
  }


  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">

      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-8">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Create Ticket
            </h2>

            <p className="text-slate-400 mt-1">
              Submit a new support request
            </p>

          </div>

          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleCreateTicket}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Ticket Title
            </label>

            <input
              type="text"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            />

          </div>

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block mb-2 text-sm text-slate-300">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2 text-sm text-slate-300">
                Category
              </label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              >

                <option value="">
                  Select Category
                </option>

                {
                  categories.map((category) => (

                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>

                  ))
                }

              </select>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 transition rounded-xl py-3 font-semibold text-black"
          >

            {
              loading
                ? "Creating..."
                : "Create Ticket"
            }

          </button>

        </form>

      </div>

    </div>
  )
}

export default CreateTicketModal
