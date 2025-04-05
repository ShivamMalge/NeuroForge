"use client"

import { Layers, Grid, Sliders } from "lucide-react"
import { motion } from "framer-motion"

interface MobileNavigationProps {
  activePanel: "layers" | "canvas" | "properties"
  setActivePanel: (panel: "layers" | "canvas" | "properties") => void
  hasSelectedLayer: boolean
}

export function MobileNavigation({ activePanel, setActivePanel, hasSelectedLayer }: MobileNavigationProps) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around p-2 z-10"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className={`flex flex-col items-center justify-center p-2 rounded-md ${
          activePanel === "layers" ? "text-primary bg-primary/10" : "text-muted-foreground"
        }`}
        onClick={() => setActivePanel("layers")}
        data-panel="layers"
      >
        <Layers className="w-6 h-6" />
        <span className="text-xs mt-1">Layers</span>
      </button>

      <button
        className={`flex flex-col items-center justify-center p-2 rounded-md ${
          activePanel === "canvas" ? "text-primary bg-primary/10" : "text-muted-foreground"
        }`}
        onClick={() => setActivePanel("canvas")}
        data-panel="canvas"
      >
        <Grid className="w-6 h-6" />
        <span className="text-xs mt-1">Model</span>
      </button>

      <button
        className={`flex flex-col items-center justify-center p-2 rounded-md ${
          activePanel === "properties" ? "text-primary bg-primary/10" : "text-muted-foreground"
        } ${!hasSelectedLayer ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => hasSelectedLayer && setActivePanel("properties")}
        disabled={!hasSelectedLayer}
        data-panel="properties"
      >
        <Sliders className="w-6 h-6" />
        <span className="text-xs mt-1">Properties</span>
      </button>
    </motion.div>
  )
}

