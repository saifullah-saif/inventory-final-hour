"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Truck,
  CreditCard,
  Settings,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function Sidebar({ onCollapseChange = () => {} }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState)
    }
  }

  const routes = [
    {
      href: "/",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/products",
      icon: Package,
      title: "Products",
    },
    // Remove the inventory route from here
    {
      href: "/orders",
      icon: ShoppingCart,
      title: "Orders",
    },
    {
      href: "/suppliers",
      icon: Truck,
      title: "Suppliers",
    },
    {
      href: "/customers",
      icon: Users,
      title: "Customers",
    },
    {
      href: "/payments",
      icon: CreditCard,
      title: "Payments",
    },
    {
      href: "/reports",
      icon: BarChart3,
      title: "Reports",
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      <div
        className={cn(
          "fixed md:absolute inset-y-0 left-0 z-30 bg-background border-r transform transition-all duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-14 items-center justify-between border-b px-4 relative">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              {!isCollapsed && <span>Inventory MS</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-6 w-6 absolute right-0 top-4"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className={cn("grid items-start px-2 text-sm font-medium", isCollapsed && "justify-items-center")}>
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground",
                    isCollapsed && "justify-center w-10 h-10 p-0",
                  )}
                  title={isCollapsed ? route.title : ""}
                >
                  <route.icon className="h-4 w-4" />
                  {!isCollapsed && route.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
