import LoginPage from "@/components/auth/login-page"

export default function Home() {
  // In a real app, you would check server-side session here
  // For demo purposes, we'll just render the login page
  return <LoginPage />
}
