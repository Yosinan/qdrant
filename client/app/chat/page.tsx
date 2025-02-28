"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Loader2, Send, Settings } from "lucide-react"
import { useState } from "react"

export default function ChatInterface() {
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState(initialMessages)

  const handleSend = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setMessages([
        ...messages,
        {
          role: "assistant",
          content:
            "I've analyzed the patient's symptoms and medical history. Based on the available data, I recommend scheduling a follow-up appointment and ordering additional blood tests to confirm the diagnosis.",
          actions: [
            { label: "Schedule Follow-up", action: "schedule" },
            { label: "Order Blood Tests", action: "order_tests" },
          ],
        },
      ])
    }, 2000)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Dr. AI Assistant</h2>
              <p className="text-sm text-muted-foreground">Oncology Specialist Mode</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Assistant Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Personality: Formal</DropdownMenuItem>
              <DropdownMenuItem>Priority: Accuracy</DropdownMenuItem>
              <DropdownMenuItem>Notifications: Critical Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="container space-y-4">
          {messages.map((message, index) => (
            <Card
              key={index}
              className={`flex max-w-[80%] flex-col space-y-2 p-4 ${
                message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : ""
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === "assistant" && <Bot className="mt-1 h-4 w-4" />}
                <div className="space-y-2">
                  <p className="text-sm">{message.content}</p>
                  {message.actions && (
                    <div className="flex flex-wrap gap-2">
                      {message.actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={message.role === "assistant" ? "secondary" : "outline"}
                          size="sm"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  {message.source && <p className="text-xs text-muted-foreground">Source: {message.source}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="container flex items-center space-x-2">
          <Textarea placeholder="Type your message..." className="min-h-[2.5rem] flex-1 resize-none" />
          <Button onClick={handleSend} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I'm your AI medical assistant. How can I help you today?",
  },
  {
    role: "user",
    content: "Can you analyze the latest lab results for patient Jane Doe?",
  },
  {
    role: "assistant",
    content: "I'll analyze Jane Doe's recent lab results and medical history for you.",
    source: "Patient Records #123",
  },
]

