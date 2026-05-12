import axios from "axios"

const API = axios.create({
  baseURL: "https://livechatsupportdashboard.onrender.com"
})

export default API