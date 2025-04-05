"use client"

import { Toaster as SonnerToaster } from "sonner"

export function SonnerProvider() {
  return <SonnerToaster position="top-right" theme="dark" closeButton richColors />
}

