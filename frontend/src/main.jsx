import ReactDOM from "react-dom/client"

import { BrowserRouter } from "react-router-dom"

import App from "./App"

import "./index.css"

import {
  NotificationProvider
} from "./context/NotificationContext"

import {
  SocketProvider
} from "./context/SocketContext"


ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>

    <SocketProvider>

      <NotificationProvider>

        <App />

      </NotificationProvider>

    </SocketProvider>

  </BrowserRouter>
)
