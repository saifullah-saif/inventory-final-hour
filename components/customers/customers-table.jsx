"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Edit, MoreHorizontal, Search, Trash2, ShoppingBag, Mail, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CustomersTable() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [selectedType, setSelectedType] = useState("All Types")
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewOrdersDialogOpen, setIsViewOrdersDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers')
        if (!response.ok) throw new Error('Failed to fetch customers')
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        console.error('Error fetching customers:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch customers. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [toast])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      console.log("Searching customers:", value)
    }, 300)

    setSearchTimeout(timeout)
  }

  const filteredCustomers = customers.filter((customer) => {
    const searchValue = searchTerm.toLowerCase()
    const matchesSearch =
      customer.name.toLowerCase().includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue) ||
      customer.phone.toLowerCase().includes(searchValue) ||
      customer.address.toLowerCase().includes(searchValue)

    const matchesType = selectedType === "All Types" || customer.type === selectedType

    return matchesSearch && matchesType
  })

  const handleTypeSelect = (type) => {
    setSelectedType(type)
  }

  const confirmDelete = (customer) => {
    setCustomerToDelete(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!customerToDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/customers?id=${customerToDelete.customer_id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete customer')

      setCustomers(customers.filter((customer) => customer.customer_id !== customerToDelete.customer_id))

      toast({
        title: "Customer deleted",
        description: `${customerToDelete.name} has been removed successfully.`,
      })
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete customer. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setCustomerToDelete(null)
    }
  }

  const openViewOrdersDialog = (customer) => {
    setSelectedCustomer(customer)
    setIsViewOrdersDialogOpen(true)
  }

  const openEmailDialog = (customer) => {
    setSelectedCustomer(customer)
    setEmailSubject("")
    setEmailMessage("")
    setIsEmailDialogOpen(true)
  }

  const handleSendEmail = async () => {
    if (!selectedCustomer || !emailSubject || !emailMessage) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields.",
      })
      return
    }

    setIsSendingEmail(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email sent",
        description: `Email has been sent to ${selectedCustomer.name}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email. Please try again.",
      })
    } finally {
      setIsSendingEmail(false)
      setIsEmailDialogOpen(false)
      setSelectedCustomer(null)
    }
  }

  const getStatusBadge = (status) => {
    return status === "Active" ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case "Business":
        return (
          <Badge variant="outline" className="bg-blue-50">
            Business
          </Badge>
        )
      case "Wholesale":
        return (
          <Badge variant="outline" className="bg-purple-50">
            Wholesale
          </Badge>
        )
      default:
        return <Badge variant="outline">Individual</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedType}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleTypeSelect("All Types")}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTypeSelect("Individual")}>Individual</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTypeSelect("Business")}>Business</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTypeSelect("Wholesale")}>Wholesale</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.customer_id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{customer.email}</span>
                      <span className="text-xs text-muted-foreground">{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(customer.type || "Individual")}</TableCell>
                  <TableCell>{customer.total_orders || 0}</TableCell>
                  <TableCell>${Number(customer.total_spent || 0).toFixed(2)}</TableCell>
                  <TableCell>{customer.last_order || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(customer.status || "Active")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/customers/${customer.customer_id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openViewOrdersDialog(customer)}>
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          View Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEmailDialog(customer)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(customer)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer <span className="font-medium">{customerToDelete?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Orders Dialog */}
      <Dialog open={isViewOrdersDialogOpen} onOpenChange={setIsViewOrdersDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Customer Orders</DialogTitle>
            <DialogDescription>Order history for {selectedCustomer?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{selectedCustomer?.total_orders || 0}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${Number(selectedCustomer?.total_spent || 0).toFixed(2)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Last Order</p>
                <p className="text-2xl font-bold">{selectedCustomer?.last_order || "N/A"}</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCustomer?.orders?.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-medium">ORD-{order.order_id}</TableCell>
                    <TableCell>{order.order_date}</TableCell>
                    <TableCell>{order.items_count}</TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="success">{order.status}</Badge>
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedCustomer?.name} ({selectedCustomer?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email-subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email-message" className="text-sm font-medium">
                Message
              </label>
              <Input
                id="email-message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Enter your message"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSendEmail} disabled={isSendingEmail}>
              {isSendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
