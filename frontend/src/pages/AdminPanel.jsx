import { useEffect, useState } from "react"

import Sidebar from "../components/Sidebar"

import API from "../services/api"

import toast from "react-hot-toast"


function AdminPanel() {

  const [users, setUsers] = useState([])

  const token = localStorage.getItem(
    "token"
  )


  const fetchUsers = async () => {

    try {

      const response = await API.get(
        "/users"
      )

      setUsers(
        response.data
      )

    } catch (error) {

      console.log(error)
    }
  }


  const updateRole = async (
    userId,
    role
  ) => {

    try {

      await API.put(
        `/users/${userId}/role?role=${role}`
      )

      toast.success(
        "Role updated successfully"
      )

      fetchUsers()

    } catch (error) {

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


  useEffect(() => {

    fetchUsers()

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

                      <td className="py-4">

                        {user.full_name}

                      </td>

                      <td className="py-4">

                        {user.email}

                      </td>

                      <td className="py-4">

                        <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm">

                          {user.role}

                        </span>

                      </td>


                      <td className="py-4">

                        <div className="flex gap-2 flex-wrap">

                          <button
                            onClick={() =>
                              updateRole(
                                user.id,
                                "admin"
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
                                "support"
                              )
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-sm"
                          >

                            Make Support

                          </button>


                          <button
                            onClick={() =>
                              updateRole(
                                user.id,
                                "user"
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

        </div>

      </div>

    </div>
  )
}

export default AdminPanel
