import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Calendar, FileText, MessageSquare, PillIcon as Pills, PlusCircle } from "lucide-react"

export default function PatientProfile({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Jane Doe</h1>
            <p className="text-muted-foreground">Patient ID: {params.id}</p>
            <div className="mt-2 flex space-x-2">
              <Button size="sm" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </div>
          </div>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Mar 15</div>
                <p className="text-xs text-muted-foreground">Dr. Smith - Follow-up</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
                <Pills className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Last updated 2 days ago</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Vitals</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Normal</div>
                <p className="text-xs text-muted-foreground">Last checked 1 hour ago</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Notes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">In the last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <activity.icon className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalHistory.map((entry, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium">{entry.condition}</h3>
                    <p className="text-sm text-muted-foreground">{entry.details}</p>
                    <p className="text-xs text-muted-foreground">Diagnosed: {entry.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const recentActivity = [
  {
    icon: Calendar,
    title: "Appointment Scheduled",
    description: "Follow-up appointment with Dr. Smith",
    timestamp: "2 hours ago",
  },
  {
    icon: Pills,
    title: "Medication Updated",
    description: "Dosage adjusted for Medication A",
    timestamp: "1 day ago",
  },
  {
    icon: FileText,
    title: "Note Added",
    description: "Progress note from last visit",
    timestamp: "2 days ago",
  },
]

const medicalHistory = [
  {
    condition: "Type 2 Diabetes",
    details: "Well-controlled with medication and diet",
    date: "Jan 2020",
  },
  {
    condition: "Hypertension",
    details: "Managed with lifestyle modifications and medication",
    date: "Mar 2019",
  },
  {
    condition: "Knee Surgery",
    details: "Arthroscopic procedure on right knee",
    date: "Sep 2018",
  },
]

