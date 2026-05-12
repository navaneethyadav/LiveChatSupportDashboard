import { useState } from "react"

import toast from "react-hot-toast"

import API from "../services/api"


function FeedbackForm({ ticketId }) {

  const [rating, setRating] = useState(5)

  const [comment, setComment] = useState("")


  const submitFeedback = async () => {

    try {

      await API.post(
        "/feedback",
        {
          ticket_id: ticketId,
          rating: rating,
          comment: comment
        }
      )

      toast.success(
        "Feedback submitted"
      )

      setComment("")

    } catch (error) {

      toast.error(
        "Failed to submit feedback"
      )
    }
  }


  return (

    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mt-4">

      <h3 className="text-lg font-semibold mb-4">
        Submit Feedback
      </h3>


      <div className="mb-4">

        <label className="block mb-2 text-sm text-slate-300">
          Rating
        </label>

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none"
        >

          <option value={5}>
            5 - Excellent
          </option>

          <option value={4}>
            4 - Good
          </option>

          <option value={3}>
            3 - Average
          </option>

          <option value={2}>
            2 - Poor
          </option>

          <option value={1}>
            1 - Bad
          </option>

        </select>

      </div>


      <div className="mb-4">

        <label className="block mb-2 text-sm text-slate-300">
          Comment
        </label>

        <textarea
          rows="4"
          placeholder="Write feedback..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none"
        />

      </div>


      <button
        onClick={submitFeedback}
        className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg font-semibold"
      >
        Submit Feedback
      </button>

    </div>
  )
}

export default FeedbackForm