"use client"

import dynamic from "next/dynamic"

// Use dynamic import with SSR disabled to prevent hydration issues
const ModelBuilderWithNoSSR = dynamic(
  () => import("@/components/model-builder-wrapper").then((mod) => mod.ModelBuilderWrapper),
  { ssr: false },
)

export function ModelBuilderClient() {
  return <ModelBuilderWithNoSSR />
}

