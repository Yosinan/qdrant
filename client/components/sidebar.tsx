"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Activity, Calendar, Home, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader className="flex h-14 items-center border-b px-6">
        <SidebarTrigger />
        <Link href="/" className="ml-2 flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">HealthAI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href="/" className={pathname === "/" ? "text-primary" : ""}>
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Patients">
                  <Link href="/patients" className={pathname.startsWith("/patients") ? "text-primary" : ""}>
                    <Users className="h-4 w-4" />
                    <span>Patients</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Chat">
                  <Link href="/chat" className={pathname === "/chat" ? "text-primary" : ""}>
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Schedule">
                  <Link href="/schedule" className={pathname === "/schedule" ? "text-primary" : ""}>
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Analytics">
                  <Link href="/analytics" className={pathname === "/analytics" ? "text-primary" : ""}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Recent Patients</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentPatients.map((patient) => (
                <SidebarMenuItem key={patient.id}>
                  <SidebarMenuButton asChild tooltip={patient.name}>
                    <Link href={`/patients/${patient.id}`}>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.initials}</AvatarFallback>
                      </Avatar>
                      <span>{patient.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto border-t p-4">
        <Button variant="ghost" className="w-full justify-between" asChild>
          <Link href="/settings">
            <div className="flex items-center">
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <span>Dr. Smith</span>
            </div>
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SidebarComponent>
  )
}

const recentPatients = [
  {
    id: 1,
    name: "Jane Doe",
    initials: "JD",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "John Smith",
    initials: "JS",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    initials: "SJ",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

