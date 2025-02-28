import { ChatPopup } from "@/components/chat-popup"
import { HealthcareLayout } from "./healthcare-layout"
import { MainContent } from "./main-content"
import { RightPanel } from "./right-panel"
import { Sidebar } from "./sidebar"

export default function HealthcareUI() {
  return (
    <HealthcareLayout>
      <Sidebar />
      <MainContent />
      <RightPanel />
      <ChatPopup />
    </HealthcareLayout>
  )
}

