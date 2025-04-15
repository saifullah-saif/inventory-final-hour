"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()

  // Function to be called from sidebar when collapse state changes
  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed)
  }

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true"
      setIsAuthenticated(authStatus)
    }

    checkAuth()

    // Listen for storage events (for when another tab changes auth status)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  // Don't show sidebar and header on login page
  const isLoginPage = pathname === "/"

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {isLoginPage || !isAuthenticated ? (
              <div className="min-h-screen">{children}</div>
            ) : (
              <div className="flex h-screen overflow-hidden">
                <Sidebar onCollapseChange={handleSidebarCollapse} />
                <div
                  className="flex flex-col flex-1 overflow-hidden transition-all duration-200"
                  style={{
                    marginLeft: isSidebarCollapsed ? "4rem" : "16rem",
                    width: isSidebarCollapsed ? "calc(100% - 4rem)" : "calc(100% - 16rem)",
                  }}
                >
                  <Header />
                  <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
                </div>
              </div>
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
