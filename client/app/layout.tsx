import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatPopup } from "@/components/chat-popup"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HealthAI Dashboard",
  description: "AI-powered healthcare management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
          <ChatPopup />
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'