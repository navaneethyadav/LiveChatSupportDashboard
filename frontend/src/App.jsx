import { Routes, Route } from "react-router-dom"

import Login from "./pages/Login"

import Signup from "./pages/Signup"

import Dashboard from "./pages/Dashboard"

import Tickets from "./pages/Tickets"

import AdminPanel from "./pages/AdminPanel"

import Feedbacks from "./pages/Feedbacks"

import ForgotPassword from "./pages/ForgotPassword"

import ResetPassword from "./pages/ResetPassword"

import VerifyEmail from "./pages/VerifyEmail"

import ProtectedRoute from "./components/ProtectedRoute"


function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />


      <Route
        path="/signup"
        element={<Signup />}
      />


      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />


      <Route
        path="/verify-email/:token"
        element={<VerifyEmail />}
      />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        }
      />


      <Route
        path="/feedbacks"
        element={
          <ProtectedRoute adminOnly={true}>
            <Feedbacks />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App
