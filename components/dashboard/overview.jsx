"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1500,
  },
  {
    name: "Feb",
    total: 2300,
  },
  {
    name: "Mar",
    total: 3200,
  },
  {
    name: "Apr",
    total: 4500,
  },
  {
    name: "May",
    total: 3200,
  },
  {
    name: "Jun",
    total: 5400,
  },
  {
    name: "Jul",
    total: 6800,
  },
  {
    name: "Aug",
    total: 7300,
  },
  {
    name: "Sep",
    total: 6500,
  },
  {
    name: "Oct",
    total: 8200,
  },
  {
    name: "Nov",
    total: 9100,
  },
  {
    name: "Dec",
    total: 10500,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} labelFormatter={(label) => `Month: ${label}`} />
        <Bar dataKey="total" fill="#088730" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
