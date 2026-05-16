import axios from "axios"


// =========================================
// FORCE LOCAL BACKEND
// =========================================

const BASE_URL = "http://127.0.0.1:8000"


// =========================================
// AXIOS INSTANCE
// =========================================

const API = axios.create({

  baseURL: BASE_URL,

  headers: {

    "Content-Type": "application/json"

  }

})


// =========================================
// REQUEST INTERCEPTOR
// =========================================

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
  },

  (error) => {

    return Promise.reject(error)

  }

)


// =========================================
// RESPONSE INTERCEPTOR
// =========================================

API.interceptors.response.use(

  (response) => response,

  (error) => {

    if (

      error.response &&

      error.response.status === 401

    ) {

      localStorage.removeItem(
        "token"
      )

      localStorage.removeItem(
        "role"
      )

      localStorage.removeItem(
        "full_name"
      )

      localStorage.removeItem(
        "email"
      )

      localStorage.removeItem(
        "user_id"
      )

      window.location.href = "/"
    }

    return Promise.reject(error)

  }

)


// =========================================
// EXPORT
// =========================================

export default API
