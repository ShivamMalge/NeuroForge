import type { Metadata } from "next"
import { SonnerProvider } from "@/components/sonner-provider"
import { ModelBuilderClient } from "@/components/model-builder-client"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "NeuroForge - Visual AI Model Builder",
  description: "Build, configure, and train neural networks in your browser",
}

export default function HomePage() {
  return (
    <>
      <SonnerProvider />
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <ModelBuilderClient />
        </div>
        <Footer />
      </div>
    </>
  )
}

