"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { addDays, format } from "date-fns"
import { Download, Filter } from "lucide-react"
import { useState } from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface FilterState {
  activityTypes: {
    ai: boolean
    patient: boolean
    admin: boolean
  }
  dateRange: {
    from: Date
    to: Date
  }
}

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [filters, setFilters] = useState<FilterState>({
    activityTypes: {
      ai: true,
      patient: true,
      admin: true,
    },
    dateRange: {
      from: addDays(new Date(), -30),
      to: new Date(),
    },
  })

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Your analytics report is being generated and will download shortly.",
    })
  }

  // Filter activities based on current filters
  const filteredActivities = recentActivities.filter((activity) => {
    if (activity.type === "AI Interaction" && !filters.activityTypes.ai) return false
    if (activity.type === "Patient Care" && !filters.activityTypes.patient) return false
    if (activity.type === "Administrative" && !filters.activityTypes.admin) return false
    return true
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed analysis and insights</p>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Activity Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.activityTypes.ai}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    activityTypes: { ...prev.activityTypes, ai: checked },
                  }))
                }
              >
                AI Interactions
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.activityTypes.patient}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    activityTypes: { ...prev.activityTypes, patient: checked },
                  }))
                }
              >
                Patient Care
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.activityTypes.admin}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({
                    ...prev,
                    activityTypes: { ...prev.activityTypes, admin: checked },
                  }))
                }
              >
                Administrative
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Date Range</DropdownMenuLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mt-2 w-full justify-start text-left font-normal">
                    <div className="text-sm">
                      {format(filters.dateRange.from, "PPP")} - {format(filters.dateRange.to, "PPP")}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange.from}
                    selected={{
                      from: filters.dateRange.from,
                      to: filters.dateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setFilters((prev) => ({
                          ...prev,
                          dateRange: { from: range.from, to: range.to },
                        }))
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Analytics</DialogTitle>
                <DialogDescription>
                  Your report is being generated and will download automatically when ready.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Patient Visits</CardTitle>
            <CardDescription>Total visits over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={visitData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#0ea5e9" strokeWidth={2} dot={{ strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnosis Distribution</CardTitle>
            <CardDescription>Most common diagnoses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={diagnosisData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistance</CardTitle>
            <CardDescription>AI usage metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={aiUsageData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="queries" stroke="#0ea5e9" strokeWidth={2} dot={{ strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Detailed view of system activities</CardDescription>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="ai">AI Interactions</SelectItem>
                <SelectItem value="patient">Patient Care</SelectItem>
                <SelectItem value="admin">Administrative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>{activity.time}</TableCell>
                  <TableCell>{activity.activity}</TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        activity.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

const visitData = [
  { name: "Jan", visits: 400 },
  { name: "Feb", visits: 300 },
  { name: "Mar", visits: 500 },
  { name: "Apr", visits: 450 },
  { name: "May", visits: 470 },
  { name: "Jun", visits: 600 },
  { name: "Jul", visits: 550 },
  { name: "Aug", visits: 700 },
  { name: "Sep", visits: 650 },
  { name: "Oct", visits: 800 },
  { name: "Nov", visits: 750 },
  { name: "Dec", visits: 900 },
]

const diagnosisData = [
  { name: "Diabetes", count: 200 },
  { name: "Hypertension", count: 150 },
  { name: "Asthma", count: 100 },
  { name: "Arthritis", count: 80 },
  { name: "Anxiety", count: 60 },
  { name: "Depression", count: 50 },
  { name: "COPD", count: 40 },
  { name: "Heart Disease", count: 35 },
]

const aiUsageData = [
  { name: "Mon", queries: 50 },
  { name: "Tue", queries: 80 },
  { name: "Wed", queries: 70 },
  { name: "Thu", queries: 90 },
  { name: "Fri", queries: 85 },
  { name: "Sat", queries: 40 },
  { name: "Sun", queries: 30 },
]

const recentActivities = [
  {
    time: "09:45 AM",
    activity: "Patient consultation completed",
    type: "Patient Care",
    status: "Completed",
  },
  {
    time: "09:30 AM",
    activity: "AI analysis of lab results",
    type: "AI Interaction",
    status: "Processing",
  },
  {
    time: "09:15 AM",
    activity: "Appointment scheduled",
    type: "Administrative",
    status: "Completed",
  },
  {
    time: "09:00 AM",
    activity: "Medical record updated",
    type: "Administrative",
    status: "Completed",
  },
  {
    time: "08:45 AM",
    activity: "AI symptom analysis",
    type: "AI Interaction",
    status: "Completed",
  },
  {
    time: "08:30 AM",
    activity: "Prescription renewed",
    type: "Patient Care",
    status: "Completed",
  },
  {
    time: "08:15 AM",
    activity: "Lab results reviewed",
    type: "Patient Care",
    status: "Completed",
  },
  {
    time: "08:00 AM",
    activity: "Daily system backup",
    type: "Administrative",
    status: "Completed",
  },
]

