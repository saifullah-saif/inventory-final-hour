"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const stockLevelData = [
  { name: "Wireless Headphones", stock: 45, threshold: 10 },
  { name: "Organic Cotton T-Shirt", stock: 78, threshold: 15 },
  { name: "Stainless Steel Water Bottle", stock: 112, threshold: 20 },
  { name: "Bluetooth Speaker", stock: 32, threshold: 8 },
  { name: "Leather Wallet", stock: 65, threshold: 15 },
]

const stockStatusData = [
  { name: "Healthy Stock", value: 75 },
  { name: "Low Stock", value: 15 },
  { name: "Out of Stock", value: 10 },
]

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"]

export function InventoryReport() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Stock Levels by Product</CardTitle>
          <CardDescription>Current stock levels compared to threshold limits</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={stockLevelData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#adfa1d" name="Current Stock" />
              <Bar dataKey="threshold" fill="#ff4d4f" name="Threshold" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Overall inventory health status</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Metrics</CardTitle>
          <CardDescription>Key inventory performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">2,350</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">$125,430</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg. Turnover Rate</p>
                <p className="text-2xl font-bold">24 days</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Stockout Events</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
