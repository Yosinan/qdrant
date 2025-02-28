"use client"

import { AddEventDialog } from "@/components/add-event-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Filter } from "lucide-react"
import { useState } from "react"

interface Event {
  id: string
  time: string
  duration: string
  title: string
  description: string
  type: "appointment" | "lab_test" | "follow_up" | "procedure" | "other"
}

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [eventType, setEventType] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("today")

  // Filter events based on type and time range
  const filteredEvents = scheduledEvents.filter((event) => {
    const matchesType = eventType === "all" || event.type === eventType
    // In a real app, you would filter by actual date/time
    return matchesType
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Manage appointments and automated tasks</p>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEventType("all")}>All Tasks</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEventType("appointment")}>Appointments</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEventType("lab_test")}>Lab Tests</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEventType("follow_up")}>Follow-ups</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEventType("procedure")}>Procedures</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AddEventDialog />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Events</CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {filteredEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="min-w-[100px] text-sm">
                        <div className="font-medium">{event.time}</div>
                        <div className="text-muted-foreground">{event.duration}</div>
                      </div>
                      <Card className="flex-1">
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{event.title}</CardTitle>
                              <CardDescription>{event.description}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const scheduledEvents: Event[] = [
  {
    id: "E-001",
    time: "9:00 AM",
    duration: "30 min",
    title: "Patient Consultation",
    description: "Follow-up with Jane Doe",
    type: "appointment",
  },
  {
    id: "E-002",
    time: "10:00 AM",
    duration: "1 hour",
    title: "Lab Results Review",
    description: "Automated analysis of overnight test results",
    type: "lab_test",
  },
  {
    id: "E-003",
    time: "11:30 AM",
    duration: "45 min",
    title: "Team Meeting",
    description: "Weekly case review with Dr. Smith and Dr. Johnson",
    type: "other",
  },
  {
    id: "E-004",
    time: "2:00 PM",
    duration: "1 hour",
    title: "New Patient Intake",
    description: "Initial consultation with John Smith",
    type: "appointment",
  },
  {
    id: "E-005",
    time: "3:30 PM",
    duration: "30 min",
    title: "Follow-up Consultation",
    description: "Post-operation check with Sarah Johnson",
    type: "follow_up",
  },
]

