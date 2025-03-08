"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, Filter, ListFilter } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FilterState {
  sources: {
    ehr: boolean;
    lab: boolean;
    imaging: boolean;
    notes: boolean;
  };
  timeRange: "24h" | "7d" | "30d" | "all";
  confidence: number;
}

interface SearchResult {
  id: number;
  title: string;
  description: string;
  source: string;
  confidenceScore: number;
  date: string;
  relatedData?: {
    patientCount?: number;
    trend?: { date: string; value: number }[];
  };
}

export function MainContent() {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "graph">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    sources: {
      ehr: true,
      lab: true,
      imaging: true,
      notes: true,
    },
    timeRange: "24h",
    confidence: 80,
  });

  const handleSearch = async (value: string) => {
    setSearchQuery(value);

    if (value.length > 2) {
      try {
        const response = await fetch("http://127.0.0.1:5000/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: value }),
        });

        console.log("Backend Response:", response);
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();

        // Extract the answer and matched patients
        const answer = data.answer;
        const matchedPatients = data.matched_patients;

        // Update the searchResults state with the response
        setSearchResults([
          {
            id: 0, // Use a unique ID for the answer
            title: "Answer",
            description: answer,
            source: "Gemini AI",
            confidenceScore: 100, // Confidence score for the answer
            date: new Date().toISOString(), // Current date
          },
          ...matchedPatients.map((patient: any) => ({
            id: patient.id,
            title: `Patient ID: ${patient.id}`,
            description: `Age: ${patient.payload.age}\nGender: ${
              patient.payload.gender
            }\nDiagnosis: ${patient.payload.diagnosis}\nLast Visit: ${
              patient.payload.last_visit
            }\nMedications: ${patient.payload.medications.join(", ")}`,
            source: "Electronic Health Records",
            confidenceScore: Math.round(patient.score * 100),
            date: patient.payload.last_visit,
            relatedData: {
              patientCount: 1,
              trend: [
                { date: "2025-01-10", value: 0.3 },
                { date: "2025-01-15", value: 0.48 },
              ],
            },
          })),
        ]);

        toast({
          title: "Search Complete",
          description: `Found ${matchedPatients.length} results for "${value}"`,
        });
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch search results. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredResults = searchResults.filter((result) => {
    if (result.source === "Electronic Health Records" && !filters.sources.ehr)
      return false;
    if (result.source === "Lab Results Database" && !filters.sources.lab)
      return false;
    if (result.source === "Imaging Database" && !filters.sources.imaging)
      return false;
    if (result.source === "Clinical Notes" && !filters.sources.notes)
      return false;

    if (result.confidenceScore < filters.confidence) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        result.title.toLowerCase().includes(query) ||
        result.description.toLowerCase().includes(query)
      );
    }

    const resultDate = new Date(result.date);
    const now = new Date();
    const hoursDiff = (now.getTime() - resultDate.getTime()) / (1000 * 60 * 60);

    switch (filters.timeRange) {
      case "24h":
        return hoursDiff <= 24;
      case "7d":
        return hoursDiff <= 168;
      case "30d":
        return hoursDiff <= 720;
      case "all":
        return true;
      default:
        return true;
    }
  });

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
                    onCheckedChange={() =>
                      setFilters((prev) => ({ ...prev, timeRange: "24h" }))
                    }
                  >
                    Last 24 Hours
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.timeRange === "7d"}
                    onCheckedChange={() =>
                      setFilters((prev) => ({ ...prev, timeRange: "7d" }))
                    }
                  >
                    Last 7 Days
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.timeRange === "30d"}
                    onCheckedChange={() =>
                      setFilters((prev) => ({ ...prev, timeRange: "30d" }))
                    }
                  >
                    Last 30 Days
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.timeRange === "all"}
                    onCheckedChange={() =>
                      setFilters((prev) => ({ ...prev, timeRange: "all" }))
                    }
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
                  <DropdownMenuCheckboxItem
                    checked={view === "list"}
                    onCheckedChange={() => setView("list")}
                  >
                    List View
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={view === "graph"}
                    onCheckedChange={() => setView("graph")}
                  >
                    Graph View
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredResults.length} results found
            </div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {view === "list" ? (
            <div className="space-y-4">
              {/* Render the answer */}
              {filteredResults
                .filter((result) => result.source === "Gemini AI")
                .map((result) => (
                  <Card key={result.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {result.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Source: {result.source}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Confidence Score: {result.confidenceScore}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* Render matched patients */}
              {filteredResults
                .filter((result) => result.source !== "Gemini AI")
                .map((result) => (
                  <Card key={result.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {result.description}
                      </p>
                      <div className="mt-4 space-y-4">
                        {result.relatedData?.trend && (
                          <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={result.relatedData.trend}>
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#0ea5e9"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                        {result.relatedData?.patientCount && (
                          <ResponsiveContainer width="100%" height={100}>
                            <BarChart
                              data={[
                                { count: result.relatedData.patientCount },
                              ]}
                            >
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#0ea5e9" />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Source: {result.source}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Confidence Score: {result.confidenceScore}%
                        </span>
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
  );
}
