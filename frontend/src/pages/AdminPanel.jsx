import { useEffect, useState } from "react"

import Sidebar from "../components/Sidebar"

import API from "../services/api"

import toast from "react-hot-toast"


function AdminPanel() {

  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  const loggedInEmail = localStorage.getItem("email")


  const fetchUsers = async () => {

    try {

      setLoading(true)

      const response = await API.get(
        "/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setUsers(response.data)

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to load users"
      )

    } finally {

      setLoading(false)
    }
  }


  const updateRole = async (
    userId,
    role,
    email
  ) => {

    if (email === loggedInEmail) {

      toast.error(
        "You cannot change your own role"
      )

      return
    }

    const confirmAction = window.confirm(
      `Are you sure you want to change this user role to ${role}?`
    )

    if (!confirmAction) {

      return
    }

    try {

      await API.put(
        `/users/${userId}/role?role=${role}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success(
        "Role updated successfully"
      )

      fetchUsers()

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to update role"
      )
    }
  }


  const exportUsers = async () => {

    try {

      const response = await API.get(
        "/export/users",
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const blob = new Blob(
        [response.data],
        {
          type: "text/csv"
        }
      )

      const url =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement("a")

      link.href = url

      link.download =
        "users_report.csv"

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)

      toast.success(
        "Users CSV exported successfully"
      )

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to export users"
      )
    }
  }


  const getRoleStyle = (role) => {

    if (role === "admin") {

      return "bg-red-500/20 text-red-400"
    }

    if (role === "support") {

      return "bg-yellow-500/20 text-yellow-400"
    }

    return "bg-cyan-500/20 text-cyan-400"
  }


  useEffect(() => {

  let mounted = true

  const loadUsers = async () => {

    if (mounted) {

      await fetchUsers()
    }
  }

  loadUsers()

  return () => {

    mounted = false
  }

}, [])


  return (

    <div className="flex bg-slate-950 min-h-screen text-white">

      <Sidebar />

      <div className="flex-1 p-8">

        <div className="mb-8">

          <h1 className="text-4xl font-bold mb-2">

            Admin Management Panel

          </h1>

          <p className="text-slate-400">

            Manage users, tickets, chats, feedback and analytics

          </p>

        </div>


        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">

              Users Management

            </h2>


            <button
              onClick={exportUsers}
              className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl font-semibold"
            >

              Export Users CSV

            </button>

          </div>


          {
            loading ? (

              <div className="text-center py-10 text-slate-400">

                Loading users...

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-slate-700 text-left">

                      <th className="py-4">

                        ID

                      </th>

                      <th className="py-4">

                        Full Name

                      </th>

                      <th className="py-4">

                        Email

                      </th>

                      <th className="py-4">

                        Role

                      </th>

                      <th className="py-4">

                        Actions

                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {
                      users.map((user) => (

                        <tr
                          key={user.id}
                          className="border-b border-slate-800"
                        >

                          <td className="py-4">

                            {user.id}

                          </td>

                          <td className="py-4 font-semibold">

                            {user.full_name}

                          </td>

                          <td className="py-4 text-slate-300">

                            {user.email}

                          </td>

                          <td className="py-4">

                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleStyle(user.role)}`}>

                              {user.role}

                            </span>

                          </td>


                          <td className="py-4">

                            <div className="flex gap-2 flex-wrap">

                              <button
                                onClick={() =>
                                  updateRole(
                                    user.id,
                                    "admin",
                                    user.email
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
                              >

                                Make Admin

                              </button>


                              <button
                                onClick={() =>
                                  updateRole(
                                    user.id,
                                    "support",
                                    user.email
                                  )
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-sm text-black"
                              >

                                Make Support

                              </button>


                              <button
                                onClick={() =>
                                  updateRole(
                                    user.id,
                                    "user",
                                    user.email
                                  )
                                }
                                className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm"
                              >

                                Make User

                              </button>

                            </div>

                          </td>

                        </tr>
                      ))
                    }

                  </tbody>

                </table>

              </div>
            )
          }

        </div>

      </div>

    </div>
  )
}

export default AdminPanel
