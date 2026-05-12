export const getRole = () => {

    return localStorage.getItem("role")
  }
  
  
  export const getUserName = () => {
  
    return localStorage.getItem("full_name")
  }
  
  
  export const isAdmin = () => {
  
    return getRole() === "admin"
  }
  
  
  export const isSupport = () => {
  
    return getRole() === "support"
  }