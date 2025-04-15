"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { UserManagement } from "@/components/settings/user-management"
import { SecuritySettings } from "@/components/settings/security-settings"
import { SystemSettings } from "@/components/settings/system-settings"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch user data from API or session
    // For demo, we'll simulate fetching user data
    const fetchUser = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Get user from localStorage (set during login)
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          // Default to admin for demo purposes
          setUser({ name: "Admin User", email: "admin@example.com", role: "admin" })
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <div className="flex justify-center my-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="profile" className="px-3">
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="px-3">
              Security
            </TabsTrigger>
            {user?.role === "admin" && (
              <TabsTrigger value="users" className="px-3">
                User Management
              </TabsTrigger>
            )}
            {user?.role === "admin" && (
              <TabsTrigger value="system" className="px-3">
                System Settings
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="profile">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings user={user} />
        </TabsContent>

        {user?.role === "admin" && (
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        )}

        {user?.role === "admin" && (
          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
