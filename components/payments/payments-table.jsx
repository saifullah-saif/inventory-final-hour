"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Eye, MoreHorizontal, Search, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from 'date-fns'

export function PaymentsTable() {
  const { toast } = useToast()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false)
  const [isProcessAgainDialogOpen, setIsProcessAgainDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payments')
      if (!response.ok) throw new Error('Failed to fetch payments')
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      console.log("Searching payments:", value)
    }, 300)

    setSearchTimeout(timeout)
  }

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      const payment = payments.find(p => p.id === paymentId)
      const response = await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: paymentId.replace(/^(PAY-|SUP-)/, ''),
          status: newStatus,
          type: payment.type
        })
      })

      if (!response.ok) throw new Error('Failed to update payment status')
      
      setPayments(payments.map(p => 
        p.id === paymentId ? { ...p, status: newStatus } : p
      ))
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      })
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      })
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const searchValue = searchTerm.toLowerCase()
    const matchesSearch =
      payment.id.toLowerCase().includes(searchValue) ||
      payment.recipient.toLowerCase().includes(searchValue) ||
      payment.type.toLowerCase().includes(searchValue) ||
      payment.amount.toString().includes(searchValue) ||
      payment.date.includes(searchValue) ||
      payment.status.toLowerCase().includes(searchValue) ||
      payment.method.toLowerCase().includes(searchValue)

    const matchesType = selectedType === "All Types" || payment.type === selectedType
    const matchesStatus = selectedStatus === "All Statuses" || payment.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleTypeSelect = (type) => {
    setSelectedType(type)
  }

  const handleStatusSelect = (status) => {
    setSelectedStatus(status)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge variant="success">Completed</Badge>
      case "Pending":
        return <Badge variant="warning">Pending</Badge>
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const viewPaymentDetails = (payment) => {
    setSelectedPayment(payment)
    setIsViewDetailsDialogOpen(true)
  }

  const processPaymentAgain = (payment) => {
    setSelectedPayment(payment)
    setIsProcessAgainDialogOpen(true)
  }

  const handleProcessAgain = async () => {
    if (!selectedPayment) return

    setIsProcessing(true)

    try {
      await handleStatusUpdate(selectedPayment.id, "Completed")
    } finally {
      setIsProcessing(false)
      setIsProcessAgainDialogOpen(false)
      setSelectedPayment(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search payments..."
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
              <DropdownMenuItem onClick={() => handleTypeSelect("Supplier")}>Supplier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeSelect("Refund")}>Refund</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeSelect("Expense")}>Expense</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedStatus}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusSelect("All Statuses")}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusSelect("Completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusSelect("Pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusSelect("Failed")}>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.recipient}</TableCell>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>${Number(payment.amount).toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(payment.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
                        <DropdownMenuItem onClick={() => viewPaymentDetails(payment)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => processPaymentAgain(payment)}
                          disabled={payment.status === "Completed"}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Process Again
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

      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Details for payment {selectedPayment?.id}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                  <p className="font-medium">{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(selectedPayment.date), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recipient</p>
                <p className="font-medium">{selectedPayment.recipient}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="font-medium">${Number(selectedPayment.amount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Method</p>
                  <p className="font-medium">{selectedPayment.method}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="font-medium">{getStatusBadge(selectedPayment.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reference</p>
                <p className="font-medium">
                  INV-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, "0")}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProcessAgainDialogOpen} onOpenChange={setIsProcessAgainDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment Again</DialogTitle>
            <DialogDescription>Retry processing payment {selectedPayment?.id}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4 space-y-4">
              <div>
                <p className="text-sm font-medium">Payment Details</p>
                <p>Recipient: {selectedPayment.recipient}</p>
                <p>Amount: ${Number(selectedPayment.amount).toFixed(2)}</p>
                <p>Method: {selectedPayment.method}</p>
              </div>
              <div className="rounded-md border p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Reason for reprocessing</p>
                <p className="text-sm text-muted-foreground">
                  The previous payment attempt was {selectedPayment.status.toLowerCase()}. Reprocessing this payment
                  will attempt to charge the payment method again.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleProcessAgain} disabled={isProcessing}>
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
    </div>
  )
}
