import { useState } from "react"

import { FiMessageCircle, FiSend, FiX } from "react-icons/fi"

import API from "../services/api"


function AIChatbot() {

  const [open, setOpen] = useState(false)

  const [message, setMessage] = useState("")

  const [messages, setMessages] = useState([

    {
      sender: "bot",
      text: "Hello 👋 How can I help you?"
    }

  ])

  const sendMessage = async () => {

    if (!message.trim()) return

    const userMessage = {
      sender: "user",
      text: message
    }

    setMessages((prev) => [
      ...prev,
      userMessage
    ])

    try {

      const response = await API.get(
        `/chatbot?message=${message}`
      )

      const botMessage = {
        sender: "bot",
        text: response.data.reply
      }

      setMessages((prev) => [
        ...prev,
        botMessage
      ])

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Error connecting to chatbot."
        }
      ])

    }

    setMessage("")
  }


  return (

    <>

      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-2xl z-50"
      >

        {
          open
            ? <FiX size={24} />
            : <FiMessageCircle size={24} />
        }

      </button>


      {/* Chat Window */}

      {
        open && (

          <div className="fixed bottom-24 right-6 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">

            <div className="bg-cyan-500 p-4 font-bold text-white">
              AI Support Assistant
            </div>


            <div className="h-80 overflow-y-auto p-4 space-y-3">

              {
                messages.map((msg, index) => (

                  <div
                    key={index}
                    className={`p-3 rounded-xl max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-cyan-500 ml-auto text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >

                    {msg.text}

                  </div>

                ))
              }

            </div>


            <div className="flex border-t border-slate-700">

              <input
                type="text"
                placeholder="Type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {

                  if (e.key === "Enter") {

                    sendMessage()
                  }

                }}
                className="flex-1 bg-slate-950 text-white px-4 py-3 outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-cyan-500 hover:bg-cyan-600 px-4 text-white"
              >

                <FiSend />

              </button>

            </div>

          </div>

        )
      }

    </>

  )
}

export default AIChatbot
