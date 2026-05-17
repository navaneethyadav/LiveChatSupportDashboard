import { Navigate } from "react-router-dom"

function ProtectedRoute({
  children,
  adminOnly = false
}) {

  const token = localStorage.getItem("token")

  const role = localStorage.getItem("role")


  // =====================================
  // NO TOKEN
  // =====================================

  if (!token) {

    return <Navigate to="/" replace />
  }


  // =====================================
  // ADMIN ROUTE PROTECTION
  // =====================================

  if (
    adminOnly &&
    role !== "admin"
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }


  // =====================================
  // ALLOW ACCESS
  // =====================================

  return children
}

export default ProtectedRoute
