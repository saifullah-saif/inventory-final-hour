"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Plus, Trash2, Star, Loader2 } from "lucide-react"

export function PaymentMethodsManager() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "credit_card",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "credit_card",
      brand: "Mastercard",
      last4: "5555",
      expMonth: 8,
      expYear: 2024,
      isDefault: false,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvc: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setNewCard((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5)

      setNewCard((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    // Limit CVC to 3-4 digits
    if (name === "cvc") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 4)
      setNewCard((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    setNewCard((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCard = async (e) => {
    if (e) e.preventDefault()

    // Basic validation
    if (!newCard.cardNumber || newCard.cardNumber.replace(/\s/g, "").length < 16) {
      toast({
        variant: "destructive",
        title: "Invalid card number",
        description: "Please enter a valid card number",
      })
      return
    }

    if (!newCard.cardholderName) {
      toast({
        variant: "destructive",
        title: "Missing cardholder name",
        description: "Please enter the cardholder name",
      })
      return
    }

    if (!newCard.expiryDate || !newCard.expiryDate.includes("/")) {
      toast({
        variant: "destructive",
        title: "Invalid expiry date",
        description: "Please enter a valid expiry date (MM/YY)",
      })
      return
    }

    if (!newCard.cvc || newCard.cvc.length < 3) {
      toast({
        variant: "destructive",
        title: "Invalid CVC",
        description: "Please enter a valid CVC code",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Extract month and year from expiry date
      const [expMonth, expYear] = newCard.expiryDate.split("/").map((part) => Number.parseInt(part, 10))

      // Determine card brand based on first digit
      const firstDigit = newCard.cardNumber.replace(/\s/g, "")[0]
      let brand = "Unknown"
      if (firstDigit === "4") brand = "Visa"
      else if (firstDigit === "5") brand = "Mastercard"
      else if (firstDigit === "3") brand = "American Express"
      else if (firstDigit === "6") brand = "Discover"

      // Add new card to state
      const newPaymentMethod = {
        id: paymentMethods.length + 1,
        type: "credit_card",
        brand,
        last4: newCard.cardNumber.replace(/\s/g, "").slice(-4),
        expMonth,
        expYear: 2000 + expYear,
        isDefault: paymentMethods.length === 0, // Make default if it's the first card
      }

      setPaymentMethods([...paymentMethods, newPaymentMethod])

      // Reset form
      setNewCard({
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        cvc: "",
      })

      // Show success toast
      toast({
        title: "Card added",
        description: `${brand} card ending in ${newPaymentMethod.last4} has been added.`,
      })

      // Close dialog
      setIsAddDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add card. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeleteMethod = (method) => {
    setSelectedMethod(method)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteMethod = async () => {
    if (!selectedMethod) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove payment method from state
      setPaymentMethods(paymentMethods.filter((method) => method.id !== selectedMethod.id))

      // If we deleted the default method, make another one default
      if (selectedMethod.isDefault && paymentMethods.length > 1) {
        const remainingMethods = paymentMethods.filter((method) => method.id !== selectedMethod.id)
        setPaymentMethods(
          remainingMethods.map((method, index) => (index === 0 ? { ...method, isDefault: true } : method)),
        )
      }

      // Show success toast
      toast({
        title: "Payment method removed",
        description: `${selectedMethod.brand} card ending in ${selectedMethod.last4} has been removed.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove payment method. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setSelectedMethod(null)
    }
  }

  const setDefaultMethod = async (methodId) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update payment methods in state
      setPaymentMethods(
        paymentMethods.map((method) => ({
          ...method,
          isDefault: method.id === methodId,
        })),
      )

      // Find the method we just made default
      const method = paymentMethods.find((m) => m.id === methodId)

      // Show success toast
      toast({
        title: "Default payment method updated",
        description: `${method.brand} card ending in ${method.last4} is now your default payment method.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update default payment method. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods</CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No payment methods found.
                </TableCell>
              </TableRow>
            ) : (
              paymentMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">{method.brand}</span>
                      <span className="text-muted-foreground">•••• {method.last4}</span>
                      {method.isDefault && (
                        <Badge variant="outline" className="ml-2">
                          Default
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {method.expMonth}/{method.expYear}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultMethod(method.id)}
                          disabled={isLoading}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeleteMethod(method)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Add a new credit or debit card</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  className="pl-10"
                  value={newCard.cardNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                placeholder="John Smith"
                value={newCard.cardholderName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={newCard.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" name="cvc" placeholder="123" value={newCard.cvc} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleAddCard} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Card"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Method Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMethod}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
