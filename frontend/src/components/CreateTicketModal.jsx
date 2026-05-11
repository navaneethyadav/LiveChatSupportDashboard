import { useState } from "react"
import toast from "react-hot-toast"

import API from "../services/api"

function CreateTicketModal({
  closeModal,
  refreshTickets
}) {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium"
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      await API.post(
        "/tickets",
        formData
      )

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          Create Ticket
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 outline-none"
            />

          </div>

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 outline-none"
            />

          </div>

          <div>

            <label className="block mb-2 text-sm text-slate-300">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 outline-none"
            >

              <option>Low</option>
              <option>Medium</option>
              <option>High</option>

            </select>

          </div>

          <div className="flex gap-4">

            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-slate-700 hover:bg-slate-600 transition py-4 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 transition py-4 rounded-xl font-semibold"
            >

              {
                loading
                  ? "Creating..."
                  : "Create Ticket"
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default CreateTicketModal