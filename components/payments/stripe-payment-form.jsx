"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, Calendar, Lock } from "lucide-react"

export function StripePaymentForm({ amount, recipient, onSuccess, onCancel }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({
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

      setCardDetails((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5)

      setCardDetails((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    // Limit CVC to 3-4 digits
    if (name === "cvc") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 4)
      setCardDetails((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    // Basic validation
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
      toast({
        variant: "destructive",
        title: "Invalid card number",
        description: "Please enter a valid card number",
      })
      return false
    }

    if (!cardDetails.cardholderName) {
      toast({
        variant: "destructive",
        title: "Missing cardholder name",
        description: "Please enter the cardholder name",
      })
      return false
    }

    if (!cardDetails.expiryDate || !cardDetails.expiryDate.includes("/")) {
      toast({
        variant: "destructive",
        title: "Invalid expiry date",
        description: "Please enter a valid expiry date (MM/YY)",
      })
      return false
    }

    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      toast({
        variant: "destructive",
        title: "Invalid CVC",
        description: "Please enter a valid CVC code",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // In a real app, you would use Stripe.js to create a payment method
      // const { paymentMethod } = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: elements.getElement(CardElement),
      // });

      // For demo purposes, we'll simulate creating a payment method
      const mockPaymentMethodId = `pm_${Math.random().toString(36).substring(2, 15)}`

      // Process payment with our API
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          description: `Payment to ${recipient}`,
          paymentMethodId: mockPaymentMethodId,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Payment failed")
      }

      // Show success message
      toast({
        title: "Payment successful",
        description: `Payment of ${amount.toFixed(2)} to ${recipient} has been processed.`,
      })

      // Call success callback
      if (onSuccess) {
        onSuccess(result)
      } else {
        // Default behavior: redirect to payments page
        router.push("/payments")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message || "An error occurred while processing your payment.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your payment to {recipient}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
            <Input id="amount" value={amount.toFixed(2)} className="pl-7" disabled />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              className="pl-10"
              value={cardDetails.cardNumber}
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
            value={cardDetails.cardholderName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                className="pl-10"
                value={cardDetails.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="cvc"
                name="cvc"
                placeholder="123"
                className="pl-10"
                value={cardDetails.cvc}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Test Card Details:</p>
          <p>Card Number: 4242 4242 4242 4242</p>
          <p>Expiry Date: Any future date</p>
          <p>CVC: Any 3 digits</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${amount.toFixed(2)}`
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
