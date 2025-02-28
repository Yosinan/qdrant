import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Heart, MessageCircle, Thermometer } from "lucide-react"

export function RightPanel() {
  return (
    <div className="hidden w-80 border-l lg:block">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Patient Vitals</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-rose-500" />
                  <span className="text-2xl font-bold">72</span>
                  <span className="ml-1 text-sm text-muted-foreground">bpm</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="text-2xl font-bold">120/80</span>
                  <span className="ml-1 text-sm text-muted-foreground">mmHg</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Thermometer className="mr-2 h-4 w-4 text-amber-500" />
                  <span className="text-2xl font-bold">98.6</span>
                  <span className="ml-1 text-sm text-muted-foreground">°F</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
      <div className="fixed bottom-4 right-4">
        <Button size="lg" className="h-14 w-14 rounded-full">
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>
    </div>
  )
}

