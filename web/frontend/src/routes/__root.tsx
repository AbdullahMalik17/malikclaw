import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { useEffect } from "react"

import { AppLayout } from "@/components/app-layout"
import { initializeChatStore } from "@/lib/pico-chat-controller"
import { PerformanceMonitor } from "@/components/desktop/PerformanceMonitor"
import { WhatsAppQRModal } from "@/components/desktop/WhatsAppQRModal"

const RootLayout = () => {
  useEffect(() => {
    initializeChatStore()
  }, [])

  return (
    <AppLayout>
      <Outlet />
      <PerformanceMonitor />
      <WhatsAppQRModal />
      <TanStackRouterDevtools />
    </AppLayout>
  )
}

export const Route = createRootRoute({ component: RootLayout })
