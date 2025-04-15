import ClientLayout from "./ClientLayout"

export const metadata = {
  title: "Inventory Management System",
  description: "E-commerce inventory management system",
}

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>
}
