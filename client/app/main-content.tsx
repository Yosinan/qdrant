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
import axios from "axios";

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
  age: number;
  diagnosis: string;
  gender: string;
  last_visit: string;
  medications: string[];
  score: number;
}

interface ClinicianInfo {
  name: string;
  specialization: string;
  hospital: string;
}

export function MainContent() {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "graph">("list");
  const [searchQuery, setSearchQuery] = useState("");
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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [clinicianInfo, setClinicianInfo] = useState<ClinicianInfo | null>(
    null
  );

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {
      try {
        const response = await axios.post(
          "https://clinical-agent-api-619052101442.us-central1.run.app/search",
          {
            clinician_id: "doctor_001",
            query: value,
            similarity_threshold: 0.5,
          }
        );
        console.log(response.data);
        setSearchResults(response.data.matched_patients);
        setAnswer(response.data.answer);
        setClinicianInfo(response.data.clinician_info);
        toast({
          title: "Searching...",
          description: `Found ${response.data.matched_patients.length} results for "${value}"`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch search results",
        });
      }
    }
  };

  // Filter results based on current filters and search query
  const filteredResults = searchResults.filter((result) => {
    // Filter by source
    if (result.source === "Electronic Health Records" && !filters.sources.ehr)
      return false;
    if (result.source === "Lab Results Database" && !filters.sources.lab)
      return false;
    if (result.source === "Imaging Database" && !filters.sources.imaging)
      return false;
    if (result.source === "Clinical Notes" && !filters.sources.notes)
      return false;

    // Filter by confidence score
    if (result.score * 100 < filters.confidence) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        result.diagnosis.toLowerCase().includes(query) ||
        result.medications.some((med) => med.toLowerCase().includes(query))
      );
    }

    // Filter by time range
    const resultDate = new Date(result.last_visit);
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
              {answer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{answer}</p>
                  </CardContent>
                </Card>
              )}
              {clinicianInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clinician Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Name: {clinicianInfo.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Specialization: {clinicianInfo.specialization}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hospital: {clinicianInfo.hospital}
                    </p>
                  </CardContent>
                </Card>
              )}
              {filteredResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Patient ID: {result.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Age: {result.age}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Gender: {result.gender}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Diagnosis: {result.diagnosis}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last Visit: {result.last_visit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Medications: {result.medications.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Score: {result.score}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={600}>
                  <BarChart data={filteredResults}>
                    <XAxis dataKey="id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#0ea5e9" />
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
