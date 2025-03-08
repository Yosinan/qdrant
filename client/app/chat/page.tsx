"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, Send, Settings } from "lucide-react";
import { useState } from "react";

export default function ChatInterface() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(initialMessages);

  const handleSend = async () => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;
    const userMessage = textarea.value; // Get the user's input
    if (!userMessage.trim()) return; // Don't send empty messages

    setLoading(true);

    try {
      // Add the user's message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: userMessage },
      ]);

      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clinician_id: "doctor_001", // Replace with the actual clinician ID
          query: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the server");
      }

      const data = await response.json();
      console.log("Backend Response:", data);

      // Extract clinician data
      const clinicianData = data.context.clinician_data;
      const clinicianInfo = `Clinician: ${clinicianData.name} at ${clinicianData.hospital}, Specialization: ${clinicianData.specialization}, Experience: ${clinicianData.years_of_experience} years`;

      // Extract similar patients
      const similarPatients = data.context.similar_patients;
      const similarPatientsContent = similarPatients
        .map(
          (patient) => `
            Patient ID: ${patient.id}
            Age: ${patient.payload.age}
            Gender: ${patient.payload.gender}
            Diagnosis: ${patient.payload.diagnosis}
            Last Visit: ${patient.payload.last_visit}
            Medications: ${patient.payload.medications.join(", ")}
            Score: ${patient.score.toFixed(4)}
            `
        )
        .join("\n\n");

      // Add the assistant's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data.response, // The detailed response from the AI
        },
        {
          role: "assistant",
          content: similarPatientsContent || "No similar patients found.", // Similar patients' details
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.value = ""; // Clear the input field
      }
    }
  };

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
              <p className="text-sm text-muted-foreground">
                Oncology Specialist Mode
              </p>
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
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === "assistant" && (
                  <Bot className="mt-1 h-4 w-4" />
                )}
                <div className="space-y-2">
                  <p className="text-sm whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="container flex items-center space-x-2">
          <Textarea
            placeholder="Type your message..."
            className="min-h-[2.5rem] flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I'm your AI medical assistant. How can I help you today?",
  },
];
