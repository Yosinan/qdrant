"use client"

import { AddPatientDialog } from "@/components/add-patient-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Patient {
  id: string
  name: string
  email: string
  initials: string
  avatar: string
  status: "Active" | "Inactive"
  lastVisit: string
  condition: string
}

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // Filter patients based on search query and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && patient.status === "Active") ||
      (statusFilter === "inactive" && patient.status === "Inactive")

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-muted-foreground">Manage and view patient records</p>
        </div>
        <AddPatientDialog />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Patients</CardTitle>
          <CardDescription>Find patients by name, ID, or condition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>
            Showing {filteredPatients.length} of {patients.length} patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Primary Condition</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        patient.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {patient.status}
                    </div>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <Button variant="ghost" asChild>
                      <Link href={`/patients/${patient.id}`}>View Details</Link>
                    </Button>
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

const patients: Patient[] = [
  {
    id: "P-001",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    initials: "JD",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Active",
    lastVisit: "2024-02-20",
    condition: "Type 2 Diabetes",
  },
  {
    id: "P-002",
    name: "John Smith",
    email: "john.smith@example.com",
    initials: "JS",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Inactive",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
  },
  {
    id: "P-003",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    initials: "SJ",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Active",
    lastVisit: "2024-02-22",
    condition: "Asthma",
  },
  {
    id: "P-004",
    name: "Michael Brown",
    email: "m.brown@example.com",
    initials: "MB",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Active",
    lastVisit: "2024-02-21",
    condition: "Arthritis",
  },
  {
    id: "P-005",
    name: "Emily Wilson",
    email: "e.wilson@example.com",
    initials: "EW",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Inactive",
    lastVisit: "2024-01-30",
    condition: "Migraine",
  },
]

