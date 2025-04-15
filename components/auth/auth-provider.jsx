"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

// Create auth context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
})

// Auth provider component
export function AuthProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true"
      const userData = localStorage.getItem("user")

      setIsAuthenticated(authStatus)
      setUser(userData ? JSON.parse(userData) : null)
      setIsLoading(false)

      // Redirect if not authenticated and trying to access protected routes
      if (!authStatus && pathname !== "/" && !pathname.includes("/auth")) {
        router.push("/")
      }

      // Redirect to dashboard if already authenticated and on login page
      if (authStatus && pathname === "/") {
        router.push("/dashboard")
      }
    }

    checkAuth()
  }, [pathname, router])

  // Login function
  const login = (userData) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)
