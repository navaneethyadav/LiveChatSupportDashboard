import axios from "axios"


const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://livechatsupportdashboard.onrender.com"


const API = axios.create({

  baseURL: BASE_URL

})


API.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem(
      "token"
    )

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  }

)


API.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response &&
      error.response.status === 401
    ) {

      localStorage.removeItem("token")

      localStorage.removeItem("role")

      localStorage.removeItem("full_name")

      localStorage.removeItem("email")

      localStorage.removeItem("user_id")

      window.location.href = "/"
    }

    return Promise.reject(error)
  }

)


export default API
