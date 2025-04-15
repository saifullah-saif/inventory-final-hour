"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function SystemSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Inventory Management System",
    supportEmail: "support@inventoryms.com",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  })

  const [inventorySettings, setInventorySettings] = useState({
    lowStockThreshold: 10,
    enableAutoReorder: true,
    defaultSupplier: "Tech Supplies Inc.",
    barcodeFormat: "CODE128",
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@inventoryms.com",
    smtpPassword: "••••••••••••",
    senderName: "Inventory MS",
    senderEmail: "notifications@inventoryms.com",
    enableSsl: true,
  })

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleInventoryChange = (e) => {
    const { name, value } = e.target
    setInventorySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailChange = (e) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (section, field, value) => {
    if (section === "general") {
      setGeneralSettings((prev) => ({ ...prev, [field]: value }))
    } else if (section === "inventory") {
      setInventorySettings((prev) => ({ ...prev, [field]: value }))
    } else if (section === "email") {
      setEmailSettings((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSwitchChange = (section, field, checked) => {
    if (section === "inventory") {
      setInventorySettings((prev) => ({ ...prev, [field]: checked }))
    } else if (section === "email") {
      setEmailSettings((prev) => ({ ...prev, [field]: checked }))
    }
  }

  const handleSubmit = async (e, section) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, update settings in the database
      // For demo, we'll just show a success message
      toast({
        title: "Settings updated",
        description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure basic system settings</CardDescription>
        </CardHeader>
        <form onSubmit={(e) => handleSubmit(e, "general")}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={generalSettings.companyName}
                onChange={handleGeneralChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                name="supportEmail"
                type="email"
                value={generalSettings.supportEmail}
                onChange={handleGeneralChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={generalSettings.timezone}
                  onValueChange={(value) => handleSelectChange("general", "timezone", value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={generalSettings.dateFormat}
                  onValueChange={(value) => handleSelectChange("general", "dateFormat", value)}
                >
                  <SelectTrigger id="dateFormat">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={generalSettings.currency}
                onValueChange={(value) => handleSelectChange("general", "currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                  <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                  <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save General Settings"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Settings</CardTitle>
          <CardDescription>Configure inventory management settings</CardDescription>
        </CardHeader>
        <form onSubmit={(e) => handleSubmit(e, "inventory")}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  type="number"
                  min="1"
                  value={inventorySettings.lowStockThreshold}
                  onChange={handleInventoryChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcodeFormat">Barcode Format</Label>
                <Select
                  value={inventorySettings.barcodeFormat}
                  onValueChange={(value) => handleSelectChange("inventory", "barcodeFormat", value)}
                >
                  <SelectTrigger id="barcodeFormat">
                    <SelectValue placeholder="Select barcode format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CODE128">CODE128</SelectItem>
                    <SelectItem value="CODE39">CODE39</SelectItem>
                    <SelectItem value="EAN13">EAN-13</SelectItem>
                    <SelectItem value="UPC">UPC</SelectItem>
                    <SelectItem value="QR">QR Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultSupplier">Default Supplier</Label>
              <Input
                id="defaultSupplier"
                name="defaultSupplier"
                value={inventorySettings.defaultSupplier}
                onChange={handleInventoryChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableAutoReorder">Enable Auto Reorder</Label>
                <p className="text-sm text-muted-foreground">Automatically create purchase orders when stock is low</p>
              </div>
              <Switch
                id="enableAutoReorder"
                checked={inventorySettings.enableAutoReorder}
                onCheckedChange={(checked) => handleSwitchChange("inventory", "enableAutoReorder", checked)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Inventory Settings"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>Configure email notification settings</CardDescription>
        </CardHeader>
        <form onSubmit={(e) => handleSubmit(e, "email")}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpServer">SMTP Server</Label>
                <Input
                  id="smtpServer"
                  name="smtpServer"
                  value={emailSettings.smtpServer}
                  onChange={handleEmailChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input id="smtpPort" name="smtpPort" value={emailSettings.smtpPort} onChange={handleEmailChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  name="smtpUsername"
                  value={emailSettings.smtpUsername}
                  onChange={handleEmailChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  name="smtpPassword"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  name="senderName"
                  value={emailSettings.senderName}
                  onChange={handleEmailChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  value={emailSettings.senderEmail}
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableSsl">Enable SSL/TLS</Label>
                <p className="text-sm text-muted-foreground">Use secure connection for sending emails</p>
              </div>
              <Switch
                id="enableSsl"
                checked={emailSettings.enableSsl}
                onCheckedChange={(checked) => handleSwitchChange("email", "enableSsl", checked)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Email Settings"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
