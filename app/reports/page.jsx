import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesReport } from "@/components/reports/sales-report"
import { InventoryReport } from "@/components/reports/inventory-report"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Reports & Analytics</h1>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <SalesReport />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryReport />
        </TabsContent>
        <TabsContent value="performance">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Operational Efficiency</CardTitle>
                <CardDescription>Key performance indicators for business operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", orderFulfillment: 92, inventoryTurnover: 4.2, supplierPerformance: 88 },
                        { month: "Feb", orderFulfillment: 89, inventoryTurnover: 4.5, supplierPerformance: 85 },
                        { month: "Mar", orderFulfillment: 93, inventoryTurnover: 4.8, supplierPerformance: 90 },
                        { month: "Apr", orderFulfillment: 94, inventoryTurnover: 5.0, supplierPerformance: 92 },
                        { month: "May", orderFulfillment: 91, inventoryTurnover: 4.7, supplierPerformance: 89 },
                        { month: "Jun", orderFulfillment: 96, inventoryTurnover: 5.2, supplierPerformance: 94 },
                        { month: "Jul", orderFulfillment: 97, inventoryTurnover: 5.5, supplierPerformance: 95 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="orderFulfillment"
                        name="Order Fulfillment Rate (%)"
                        stroke="#adfa1d"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="inventoryTurnover"
                        name="Inventory Turnover Rate"
                        stroke="#0ea5e9"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="supplierPerformance"
                        name="Supplier Performance (%)"
                        stroke="#f43f5e"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Fulfillment</CardTitle>
                <CardDescription>Order processing and delivery metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Order Accuracy Rate</p>
                      <p className="text-sm font-medium text-primary">98.2%</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[98%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">On-Time Delivery Rate</p>
                      <p className="text-sm font-medium text-primary">94.5%</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[94.5%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Order Processing Time</p>
                      <p className="text-sm font-medium text-primary">1.2 days</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[80%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Return Rate</p>
                      <p className="text-sm font-medium text-destructive">3.8%</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[3.8%] rounded-full bg-destructive" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Performance</CardTitle>
                <CardDescription>Stock management efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Inventory Turnover Rate</p>
                      <p className="text-sm font-medium text-primary">5.5</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[73%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Days Inventory Outstanding</p>
                      <p className="text-sm font-medium text-primary">24 days</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[80%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Stock-to-Sales Ratio</p>
                      <p className="text-sm font-medium text-primary">1.8</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[90%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Stockout Rate</p>
                      <p className="text-sm font-medium text-destructive">2.1%</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[2.1%] rounded-full bg-destructive" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Financial performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Inventory Carrying Cost</p>
                      <p className="text-2xl font-bold">$12,450</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">↓ 8.2%</span> from last month
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Order Processing Cost</p>
                      <p className="text-2xl font-bold">$8.75</p>
                      <p className="text-xs text-muted-foreground">per order</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Shipping Cost</p>
                      <p className="text-2xl font-bold">$15.30</p>
                      <p className="text-xs text-muted-foreground">average per order</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Return Processing Cost</p>
                      <p className="text-2xl font-bold">$22.50</p>
                      <p className="text-xs text-muted-foreground">per return</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium mb-2">Cost Breakdown</p>
                    <div className="h-4 w-full rounded-full overflow-hidden bg-muted flex">
                      <div className="h-full bg-primary" style={{ width: "45%" }} />
                      <div className="h-full bg-blue-500" style={{ width: "25%" }} />
                      <div className="h-full bg-amber-500" style={{ width: "15%" }} />
                      <div className="h-full bg-red-500" style={{ width: "15%" }} />
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span>Inventory (45%)</span>
                      <span>Shipping (25%)</span>
                      <span>Labor (15%)</span>
                      <span>Other (15%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 lg:col-span-3">
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>Supplier reliability and quality metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>On-Time Delivery</TableHead>
                      <TableHead>Quality Rating</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Cost Efficiency</TableHead>
                      <TableHead>Overall Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Tech Supplies Inc.</TableCell>
                      <TableCell>
                        <Badge variant="success">98%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">4.8/5</Badge>
                      </TableCell>
                      <TableCell>3 days</TableCell>
                      <TableCell>
                        <Badge variant="outline">92%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">A+</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Eco Clothing Co.</TableCell>
                      <TableCell>
                        <Badge variant="success">95%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">4.6/5</Badge>
                      </TableCell>
                      <TableCell>5 days</TableCell>
                      <TableCell>
                        <Badge variant="outline">88%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">A</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Green Products Ltd.</TableCell>
                      <TableCell>
                        <Badge variant="warning">87%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">4.5/5</Badge>
                      </TableCell>
                      <TableCell>7 days</TableCell>
                      <TableCell>
                        <Badge variant="outline">94%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="warning">B+</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fashion Accessories Co.</TableCell>
                      <TableCell>
                        <Badge variant="success">93%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="warning">4.2/5</Badge>
                      </TableCell>
                      <TableCell>4 days</TableCell>
                      <TableCell>
                        <Badge variant="outline">85%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">A-</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
