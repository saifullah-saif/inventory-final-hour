"use client"

import { useState } from "react"
import { Bell, LogOut, User, AlertTriangle, CreditCard, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function Header() {
  const router = useRouter()
  // Update the notifications array to include low stock alerts and payment confirmations
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Wireless Headphones (SKU-001) is below threshold",
      time: "5 minutes ago",
      type: "low-stock",
    },
    {
      id: 2,
      title: "Payment Completed",
      message: "Payment to Tech Supplies Inc. for $2,450.75 has been processed",
      time: "10 minutes ago",
      type: "payment",
    },
    {
      id: 3,
      title: "New order received",
      message: "Order #12345 has been placed",
      time: "15 minutes ago",
      type: "order",
    },
    {
      id: 4,
      title: "Low Stock Alert",
      message: "Bluetooth Speaker (SKU-223) is below threshold",
      time: "1 hour ago",
      type: "low-stock",
    },
    {
      id: 5,
      title: "Payment Completed",
      message: "Payment to Eco Clothing Co. for $1,875.50 has been processed",
      time: "2 hours ago",
      type: "payment",
    },
  ])

  // First, add a new state variable to track read notifications
  // Add this after the notifications state:
  const [readNotifications, setReadNotifications] = useState([])

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")

    // Redirect to login page
    router.push("/")
  }

  // Add a function to mark all notifications as read
  // Add this after the handleLogout function:
  const markAllAsRead = () => {
    // Add all current notification IDs to the read notifications array
    setReadNotifications((prev) => [...prev, ...notifications.map((notification) => notification.id)])

    // Show toast notification
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read.",
    })
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Update the notification count badge to only show unread notifications */}
            {/* Modify the Bell button to use unread notifications count: */}
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.filter((notification) => !readNotifications.includes(notification.id)).length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {notifications.filter((notification) => !readNotifications.includes(notification.id)).length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="cursor-pointer p-0">
                <div className="flex flex-col gap-1 p-2 text-sm w-full">
                  <div className="flex items-center">
                    {notification.type === "low-stock" && <AlertTriangle className="h-4 w-4 text-destructive mr-2" />}
                    {notification.type === "payment" && <CreditCard className="h-4 w-4 text-green-500 mr-2" />}
                    {notification.type === "order" && <ShoppingCart className="h-4 w-4 text-blue-500 mr-2" />}
                    <span className="font-medium">{notification.title}</span>
                  </div>
                  <div className="text-muted-foreground">{notification.message}</div>
                  <div className="text-xs text-muted-foreground">{notification.time}</div>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
            )}
            {/* Add a "Mark all as read" button at the bottom of the notifications dropdown */}
            {/* Add this after the notifications list and before the closing DropdownMenuContent tag: */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={markAllAsRead} className="cursor-pointer justify-center text-primary">
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
