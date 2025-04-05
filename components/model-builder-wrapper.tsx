"use client"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ModelBuilder } from "@/components/model-builder"

export function ModelBuilderWrapper() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ModelBuilder />
    </DndProvider>
  )
}

