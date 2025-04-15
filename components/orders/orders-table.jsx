"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, Eye, MoreHorizontal, Search, Printer, CreditCard, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function OrdersTable() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("customer")
  const [suppliers, setSuppliers] = useState([])
  const [customerOrders, setCustomerOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch customer orders from API
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (!response.ok) {
          throw new Error('Failed to fetch customer orders')
        }
        const data = await response.json()
        setCustomerOrders(data)
      } catch (error) {
        console.error('Error fetching customer orders:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch customer orders. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerOrders()
  }, [toast])

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers')
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers')
        }
        const data = await response.json()
        setSuppliers(data)
      } catch (error) {
        console.error('Error fetching suppliers:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch suppliers. Please try again.",
        })
      }
    }

    fetchSuppliers()
  }, [toast])

  // Transform suppliers data to match the table format
  const supplierOrders = suppliers.map(supplier => ({
    id: `SUP-${supplier.supplier_id}`,
    supplier: supplier.name,
    date: new Date(supplier.created_at).toLocaleDateString(),
    total: 0, // This would be calculated from purchase orders in a real implementation
    status: "Active",
    payment: "N/A",
    items: 0, // This would be calculated from products in a real implementation
    initiatedBy: "System",
    contact: supplier.contact_person,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address
  }))

  // Customer orders state
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [customerSearchTimeout, setCustomerSearchTimeout] = useState(null)
  const [customerSelectedStatus, setCustomerSelectedStatus] = useState("All Statuses")

  // Supplier orders state
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [supplierSearchTimeout, setSupplierSearchTimeout] = useState(null)
  const [supplierSelectedStatus, setSupplierSelectedStatus] = useState("All Statuses")

  // Shared state
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false)
  const [isProcessPaymentDialogOpen, setIsProcessPaymentDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [viewOrderDetails, setViewOrderDetails] = useState(null)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

  // Filter customer orders based on search term and status
  const handleCustomerSearchChange = (e) => {
    const value = e.target.value
    setCustomerSearchTerm(value)

    if (customerSearchTimeout) {
      clearTimeout(customerSearchTimeout)
    }

    const timeout = setTimeout(() => {
      console.log("Searching for customer orders:", value)
    }, 300)

    setCustomerSearchTimeout(timeout)
  }

  // Filter supplier orders based on search term and status
  const handleSupplierSearchChange = (e) => {
    const value = e.target.value
    setSupplierSearchTerm(value)

    if (supplierSearchTimeout) {
      clearTimeout(supplierSearchTimeout)
    }

    const timeout = setTimeout(() => {
      console.log("Searching for supplier orders:", value)
    }, 300)

    setSupplierSearchTimeout(timeout)
  }

  // Filter customer orders
  const filteredCustomerOrders = customerOrders.filter((order) => {
    const searchValue = customerSearchTerm.toLowerCase()
    const matchesSearch =
      order.order_id.toString().toLowerCase().includes(searchValue) ||
      order.customer_name.toLowerCase().includes(searchValue) ||
      order.order_date.includes(searchValue) ||
      order.status.toLowerCase().includes(searchValue) ||
      order.payment_status.toLowerCase().includes(searchValue) ||
      order.total_amount.toString().includes(searchValue)

    const matchesStatus = customerSelectedStatus === "All Statuses" || order.status === customerSelectedStatus

    return matchesSearch && matchesStatus
  })

  // Filter supplier orders
  const filteredSupplierOrders = supplierOrders.filter((order) => {
    const searchValue = supplierSearchTerm.toLowerCase()
    const matchesSearch =
      order.id.toLowerCase().includes(searchValue) ||
      order.supplier.toLowerCase().includes(searchValue) ||
      order.date.includes(searchValue) ||
      order.status.toLowerCase().includes(searchValue) ||
      order.payment.toLowerCase().includes(searchValue) ||
      order.total.toString().includes(searchValue) ||
      (order.initiatedBy && order.initiatedBy.toLowerCase().includes(searchValue))

    const matchesStatus = supplierSelectedStatus === "All Statuses" || order.status === supplierSelectedStatus

    return matchesSearch && matchesStatus
  })

  const handleCustomerStatusSelect = (status) => {
    setCustomerSelectedStatus(status)
  }

  const handleSupplierStatusSelect = (status) => {
    setSupplierSelectedStatus(status)
  }

  const openUpdateStatusDialog = (order, isSupplier = false) => {
    setSelectedOrder({ ...order, isSupplier })
    setNewStatus(order.status)
    setIsUpdateStatusDialogOpen(true)
  }

  const openProcessPaymentDialog = (order, isSupplier = false) => {
    setSelectedOrder({ ...order, isSupplier })
    setIsProcessPaymentDialogOpen(true)
  }

  const viewOrderDetail = (order, isSupplier = false) => {
    setViewOrderDetails({ ...order, isSupplier })
    setIsViewDetailsOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/orders?id=${selectedOrder.order_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order status')

      // Update the order in the state
      setCustomerOrders(customerOrders.map(order => 
        order.order_id === selectedOrder.order_id 
          ? { ...order, status: newStatus }
          : order
      ))

      toast({
        title: "Status updated",
        description: `Order ${selectedOrder.order_id} status changed to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      })
    } finally {
      setIsUpdating(false)
      setIsUpdateStatusDialogOpen(false)
      setSelectedOrder(null)
    }
  }

  const handleProcessPayment = async () => {
    if (!selectedOrder) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/orders/${selectedOrder.order_id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedOrder.total_amount,
          payment_method: 'credit-card',
        }),
      })

      if (!response.ok) throw new Error('Failed to process payment')

      // Update the order in the state
      setCustomerOrders(customerOrders.map(order => 
        order.order_id === selectedOrder.order_id 
          ? { ...order, payment_status: 'Paid' }
          : order
      ))

      toast({
        title: "Payment processed",
        description: `Payment for order ${selectedOrder.order_id} has been processed successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again.",
      })
    } finally {
      setIsProcessing(false)
      setIsProcessPaymentDialogOpen(false)
      setSelectedOrder(null)
    }
  }

  const handlePrintInvoice = (order) => {
    toast({
      title: "Printing invoice",
      description: `Invoice for order ${order.order_id} is being prepared for printing.`,
    })

    // In a real app, this would generate and print a PDF
    setTimeout(() => {
      toast({
        title: "Invoice ready",
        description: "The invoice has been sent to your printer.",
      })
    }, 2000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success"
      case "Shipped":
        return "info"
      case "Processing":
        return "warning"
      case "Pending":
        return "secondary"
      case "Canceled":
        return "destructive"
      case "Received":
        return "success"
      default:
        return "default"
    }
  }

  const getPaymentColor = (payment) => {
    switch (payment) {
      case "Paid":
        return "success"
      case "Pending":
        return "warning"
      case "Refunded":
        return "destructive"
      default:
        return "default"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="customer" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer">Customer Orders</TabsTrigger>
          <TabsTrigger value="supplier">Supplier Orders</TabsTrigger>
        </TabsList>

        {/* Customer Orders Tab */}
        <TabsContent value="customer" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customer orders..."
                className="pl-8"
                value={customerSearchTerm}
                onChange={handleCustomerSearchChange}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {customerSelectedStatus}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleCustomerStatusSelect("All Statuses")}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCustomerStatusSelect("Pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCustomerStatusSelect("Processing")}>Processing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCustomerStatusSelect("Shipped")}>Shipped</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCustomerStatusSelect("Delivered")}>Delivered</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCustomerStatusSelect("Canceled")}>Canceled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomerOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No customer orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomerOrders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-medium">ORD-{order.order_id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items_count || 0}</TableCell>
                      <TableCell>${Number(order.total_amount || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentColor(order.payment_status)}>{order.payment_status}</Badge>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => viewOrderDetail(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openUpdateStatusDialog(order)}>
                              <ChevronDown className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            {order.payment_status === "Pending" && (
                              <DropdownMenuItem onClick={() => openProcessPaymentDialog(order)}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Process Payment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                              <Printer className="mr-2 h-4 w-4" />
                              Print Invoice
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
        </TabsContent>

        {/* Supplier Orders Tab */}
        <TabsContent value="supplier" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search suppliers..."
                className="pl-8"
                value={supplierSearchTerm}
                onChange={handleSupplierSearchChange}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {supplierSelectedStatus}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSupplierStatusSelect("All Statuses")}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSupplierStatusSelect("Active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSupplierStatusSelect("Inactive")}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading suppliers...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSupplierOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No suppliers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSupplierOrders.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.id}</TableCell>
                      <TableCell>{supplier.supplier}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(supplier.status)}>{supplier.status}</Badge>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => viewOrderDetail(supplier, true)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openUpdateStatusDialog(supplier, true)}>
                              <ChevronDown className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrintInvoice(supplier)}>
                              <Printer className="mr-2 h-4 w-4" />
                              Print Details
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
        </TabsContent>
      </Tabs>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status for order {selectedOrder?.order_id}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                {selectedOrder?.isSupplier ? (
                  <SelectItem value="Received">Received</SelectItem>
                ) : (
                  <SelectItem value="Delivered">Delivered</SelectItem>
                )}
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Payment Dialog */}
      <Dialog open={isProcessPaymentDialogOpen} onOpenChange={setIsProcessPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Process payment for {selectedOrder?.isSupplier ? "supplier" : "customer"} order {selectedOrder?.order_id}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <p className="font-medium">Order Details</p>
              <p className="text-sm text-muted-foreground">
                {selectedOrder?.isSupplier ? "Supplier" : "Customer"}:{" "}
                {selectedOrder?.supplier || selectedOrder?.customer_name}
              </p>
              <p className="text-sm text-muted-foreground">Total Amount: ${Number(selectedOrder?.total_amount || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Payment Method</p>
              <Select defaultValue="credit-card">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleProcessPayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {viewOrderDetails?.isSupplier ? "Supplier Purchase Order" : "Customer Order"} Details
            </DialogTitle>
            <DialogDescription>Complete information for order {viewOrderDetails?.order_id}.</DialogDescription>
          </DialogHeader>
          {viewOrderDetails && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Information</h3>
                  <p className="font-medium">{viewOrderDetails.order_id}</p>
                  <p>Date: {new Date(viewOrderDetails.order_date).toLocaleDateString()}</p>
                  <p>
                    Status: <Badge variant={getStatusColor(viewOrderDetails.status)}>{viewOrderDetails.status}</Badge>
                  </p>
                  <p>
                    Payment:{" "}
                    <Badge variant={getPaymentColor(viewOrderDetails.payment_status)}>{viewOrderDetails.payment_status}</Badge>
                  </p>
                  {viewOrderDetails.isSupplier && viewOrderDetails.initiatedBy && (
                    <p>Initiated By: {viewOrderDetails.initiatedBy}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {viewOrderDetails.isSupplier ? "Supplier" : "Customer"} Information
                  </h3>
                  <p className="font-medium">{viewOrderDetails.supplier || viewOrderDetails.customer_name}</p>
                  <p>
                    Email: {(viewOrderDetails.supplier || viewOrderDetails.customer_name).toLowerCase().replace(" ", ".")}
                    @example.com
                  </p>
                  <p>Phone: (555) 123-4567</p>
                </div>
              </div>

              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Mock order items */}
                  {Array.from({ length: viewOrderDetails.items }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {viewOrderDetails.isSupplier ? "Inventory Item" : "Product"} {index + 1}
                      </TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>${(Number(viewOrderDetails.total_amount || 0) / (viewOrderDetails.items || 1)).toFixed(2)}</TableCell>
                      <TableCell>${(Number(viewOrderDetails.total_amount || 0) / (viewOrderDetails.items || 1)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell>${(Number(viewOrderDetails.total_amount || 0) * 0.9).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Tax
                    </TableCell>
                    <TableCell>${(Number(viewOrderDetails.total_amount || 0) * 0.1).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="font-bold">${Number(viewOrderDetails.total_amount || 0).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => handlePrintInvoice(viewOrderDetails)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Invoice
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
