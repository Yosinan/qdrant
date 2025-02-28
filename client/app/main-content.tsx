"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown, Filter, ListFilter } from "lucide-react"
import { useState } from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface FilterState {
  sources: {
    ehr: boolean
    lab: boolean
    imaging: boolean
    notes: boolean
  }
  timeRange: "24h" | "7d" | "30d" | "all"
  confidence: number
}

interface SearchResult {
  id: number
  title: string
  description: string
  source: string
  confidenceScore: number
  date: string
  relatedData?: {
    patientCount?: number
    trend?: { date: string; value: number }[]
  }
}

export function MainContent() {
  const { toast } = useToast()
  const [view, setView] = useState<"list" | "graph">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    sources: {
      ehr: true,
      lab: true,
      imaging: true,
      notes: true,
    },
    timeRange: "24h",
    confidence: 80,
  })

  // Filter results based on current filters and search query
  const filteredResults = searchResults.filter((result) => {
    // Filter by source
    if (result.source === "Electronic Health Records" && !filters.sources.ehr) return false
    if (result.source === "Lab Results Database" && !filters.sources.lab) return false
    if (result.source === "Imaging Database" && !filters.sources.imaging) return false
    if (result.source === "Clinical Notes" && !filters.sources.notes) return false

    // Filter by confidence score
    if (result.confidenceScore < filters.confidence) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return result.title.toLowerCase().includes(query) || result.description.toLowerCase().includes(query)
    }

    // Filter by time range
    const resultDate = new Date(result.date)
    const now = new Date()
    const hoursDiff = (now.getTime() - resultDate.getTime()) / (1000 * 60 * 60)

    switch (filters.timeRange) {
      case "24h":
        return hoursDiff <= 24
      case "7d":
        return hoursDiff <= 168
      case "30d":
        return hoursDiff <= 720
      case "all":
        return true
      default:
        return true
    }
  })

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (value.length > 2) {
      toast({
        title: "Searching...",
        description: `Found ${filteredResults.length} results for "${value}"`,
      })
    }
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto py-6">
        <div className="mb-8 space-y-4">
          <h1 className="text-2xl font-bold">Intelligent Search</h1>
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Ask me anything about patients, treatments, or guidelines..."
              value={searchQuery}
              onValueChange={handleSearch}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggested Queries">
                <CommandItem onSelect={(value) => handleSearch(value)}>
                  Find patients with similar symptoms to Jane Doe
                </CommandItem>
                <CommandItem onSelect={(value) => handleSearch(value)}>
                  Show all diabetic patients aged 30-40
                </CommandItem>
                <CommandItem onSelect={(value) => handleSearch(value)}>
                  List urgent lab results from last 24 hours
                </CommandItem>
                <CommandItem onSelect={(value) => handleSearch(value)}>
                  Summarize patient treatment progress
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Data Sources</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.sources.ehr}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        sources: { ...prev.sources, ehr: checked },
                      }))
                    }
                  >
                    Electronic Health Records
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.sources.lab}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        sources: { ...prev.sources, lab: checked },
                      }))
                    }
                  >
                    Lab Results
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.sources.imaging}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        sources: { ...prev.sources, imaging: checked },
                      }))
                    }
                  >
                    Imaging
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.sources.notes}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        sources: { ...prev.sources, notes: checked },
                      }))
                    }
                  >
                    Clinical Notes
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.timeRange === "24h"}
                    onCheckedChange={() => setFilters((prev) => ({ ...prev, timeRange: "24h" }))}
                  >
                    Last 24 Hours
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.timeRange === "7d"}
                    onCheckedChange={() => setFilters((prev) => ({ ...prev, timeRange: "7d" }))}
                  >
                    Last 7 Days
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.timeRange === "30d"}
                    onCheckedChange={() => setFilters((prev) => ({ ...prev, timeRange: "30d" }))}
                  >
                    Last 30 Days
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.timeRange === "all"}
                    onCheckedChange={() => setFilters((prev) => ({ ...prev, timeRange: "all" }))}
                  >
                    All Time
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter className="mr-2 h-4 w-4" />
                    View
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuCheckboxItem checked={view === "list"} onCheckedChange={() => setView("list")}>
                    List View
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={view === "graph"} onCheckedChange={() => setView("graph")}>
                    Graph View
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-sm text-muted-foreground">{filteredResults.length} results found</div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {view === "list" ? (
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{result.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                    <div className="mt-4 space-y-4">
                      {result.relatedData?.trend && (
                        <ResponsiveContainer width="100%" height={100}>
                          <LineChart data={result.relatedData.trend}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#0ea5e9" />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                      {result.relatedData?.patientCount && (
                        <ResponsiveContainer width="100%" height={100}>
                          <BarChart data={[{ count: result.relatedData.patientCount }]}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0ea5e9" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Source: {result.source}</span>
                      <span className="text-xs text-muted-foreground">Confidence Score: {result.confidenceScore}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={600}>
                  <BarChart data={filteredResults}>
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="confidenceScore" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </div>
    </main>
  )
}

const searchResults: SearchResult[] = [
  {
    id: 1,
    title: "Patient Match: Similar Symptoms to Jane Doe",
    description:
      "Found 3 patients with matching symptom patterns: fever, fatigue, and joint pain. All cases were diagnosed within the last 30 days.",
    source: "Electronic Health Records",
    confidenceScore: 92,
    date: "2024-02-24T08:00:00",
    relatedData: {
      patientCount: 3,
      trend: [
        { date: "Feb 20", value: 1 },
        { date: "Feb 21", value: 2 },
        { date: "Feb 22", value: 2 },
        { date: "Feb 23", value: 3 },
        { date: "Feb 24", value: 3 },
      ],
    },
  },
  {
    id: 2,
    title: "Related Treatment Protocol",
    description:
      "Standard treatment protocol for similar cases suggests starting with blood tests and rheumatoid factor testing.",
    source: "Clinical Notes",
    confidenceScore: 88,
    date: "2024-02-23T15:30:00",
  },
  {
    id: 3,
    title: "Recent Lab Results",
    description: "Latest blood work shows elevated inflammatory markers, consistent with suspected diagnosis.",
    source: "Lab Results Database",
    confidenceScore: 95,
    date: "2024-02-24T09:15:00",
    relatedData: {
      trend: [
        { date: "Feb 20", value: 30 },
        { date: "Feb 21", value: 35 },
        { date: "Feb 22", value: 40 },
        { date: "Feb 23", value: 45 },
        { date: "Feb 24", value: 50 },
      ],
    },
  },
  {
    id: 4,
    title: "Imaging Analysis",
    description: "Recent chest X-rays show no significant abnormalities in the respiratory system.",
    source: "Imaging Database",
    confidenceScore: 90,
    date: "2024-02-20T14:20:00",
  },
  {
    id: 5,
    title: "Treatment Response Analysis",
    description: "Positive response to current treatment plan. Symptoms showing 60% improvement over 2 weeks.",
    source: "Electronic Health Records",
    confidenceScore: 87,
    date: "2024-02-24T10:30:00",
    relatedData: {
      trend: [
        { date: "Feb 10", value: 20 },
        { date: "Feb 15", value: 40 },
        { date: "Feb 20", value: 60 },
        { date: "Feb 24", value: 80 },
      ],
    },
  },
]

