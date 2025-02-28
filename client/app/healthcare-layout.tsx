"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

export function HealthcareLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background">{children}</div>
    </SidebarProvider>
  )
}

