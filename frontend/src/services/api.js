import axios from "axios"

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://livechatsupportdashboard.onrender.com"

const API = axios.create({

  baseURL: BASE_URL,

  headers: {

    "Content-Type": "application/json"

  }

})

API.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token")

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config

  },

  (error) => {

    return Promise.reject(error)

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
