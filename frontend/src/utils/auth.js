// =====================================
// STORAGE KEYS
// =====================================

const TOKEN_KEY = "token"

const ROLE_KEY = "role"

const FULL_NAME_KEY = "full_name"

const EMAIL_KEY = "email"

const USER_ID_KEY = "user_id"

// =====================================
// TOKEN
// =====================================

export const getToken = () => {

return localStorage.getItem(
TOKEN_KEY
)
}

// =====================================
// ROLE
// =====================================

export const getRole = () => {

return localStorage.getItem(
ROLE_KEY
)
}

// =====================================
// USER NAME
// =====================================

export const getUserName = () => {

return localStorage.getItem(
FULL_NAME_KEY
)
}

// =====================================
// EMAIL
// =====================================

export const getEmail = () => {

return localStorage.getItem(
EMAIL_KEY
)
}

// =====================================
// USER ID
// =====================================

export const getUserId = () => {

return localStorage.getItem(
USER_ID_KEY
)
}

// =====================================
// AUTH CHECK
// =====================================

export const isAuthenticated = () => {

return !!getToken()
}

// =====================================
// ROLE CHECKS
// =====================================

export const isAdmin = () => {

return getRole() === "admin"
}

export const isSupport = () => {

return getRole() === "support"
}

export const isUser = () => {

return getRole() === "user"
}

// =====================================
// SAVE AUTH DATA
// =====================================

export const saveAuthData = (data) => {

localStorage.setItem(
TOKEN_KEY,
data.access_token
)

localStorage.setItem(
ROLE_KEY,
data.role
)

localStorage.setItem(
FULL_NAME_KEY,
data.full_name
)

localStorage.setItem(
EMAIL_KEY,
data.email
)

localStorage.setItem(
USER_ID_KEY,
data.user_id
)
}

// =====================================
// CLEAR AUTH
// =====================================

export const clearAuth = () => {

localStorage.removeItem(
TOKEN_KEY
)

localStorage.removeItem(
ROLE_KEY
)

localStorage.removeItem(
FULL_NAME_KEY
)

localStorage.removeItem(
EMAIL_KEY
)

localStorage.removeItem(
USER_ID_KEY
)
}

// =====================================
// LOGOUT
// =====================================

export const logoutUser = () => {

clearAuth()

window.location.replace("/")
}
