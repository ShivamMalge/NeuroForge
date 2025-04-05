"use client"

import type React from "react"

import { type Layer, LayerType } from "@/lib/types"
import { Layers, Box, Grid3X3, Droplets, Repeat, Maximize, Minimize, LayoutGrid, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

interface LayerItemProps {
  layer: Layer
  onAddLayer: (layer: Layer) => void
}

function LayerItem({ layer, onAddLayer }: LayerItemProps) {
  const isMobile = useMobile()

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddLayer(layer)
  }

  return (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer"
      onClick={() => onAddLayer(layer)}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--accent), 0.2)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-2 rounded-md bg-primary/10">{layer.icon}</div>
      <div className="flex-1">
        <h3 className="font-medium">{layer.name}</h3>
        <p className="text-xs text-muted-foreground">{layer.description}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 rounded-full hover:bg-primary/20"
        onClick={handleAddClick}
      >
        <span className="sr-only">Add</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </Button>
    </motion.div>
  )
}

interface SimpleLayerPanelProps {
  onAddLayer: (layer: Layer) => void
}

export function SimpleLayerPanel({ onAddLayer }: SimpleLayerPanelProps) {
  const isMobile = useMobile()

  // Update the layer descriptions to be more helpful
  const layerGroups = {
    core: [
      {
        type: LayerType.INPUT,
        name: "Input",
        description: "First layer - defines input shape",
        icon: <Box className="w-5 h-5 text-blue-500" />,
        params: {
          shape: [28, 28, 1],
        },
      },
      {
        type: LayerType.DENSE,
        name: "Dense",
        description: "Fully connected layer (use for output)",
        icon: <Grid3X3 className="w-5 h-5 text-green-500" />,
        params: {
          units: 128,
          activation: "relu",
        },
      },
      {
        type: LayerType.DROPOUT,
        name: "Dropout",
        description: "Prevents overfitting",
        icon: <Droplets className="w-5 h-5 text-red-500" />,
        params: {
          rate: 0.2,
        },
      },
      {
        type: LayerType.ACTIVATION,
        name: "Activation",
        description: "Standalone activation function",
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        params: {
          activation: "relu",
        },
      },
    ],
    convolutional: [
      {
        type: LayerType.CONV2D,
        name: "Conv2D",
        description: "2D convolutional layer (for images)",
        icon: <LayoutGrid className="w-5 h-5 text-purple-500" />,
        params: {
          filters: 32,
          kernelSize: [3, 3],
          activation: "relu",
          padding: "same",
        },
      },
      {
        type: LayerType.MAXPOOLING2D,
        name: "MaxPooling2D",
        description: "Reduces spatial dimensions",
        icon: <Maximize className="w-5 h-5 text-yellow-500" />,
        params: {
          poolSize: [2, 2],
        },
      },
      {
        type: LayerType.FLATTEN,
        name: "Flatten",
        description: "Flattens input to 1D (after Conv2D)",
        icon: <Minimize className="w-5 h-5 text-orange-500" />,
        params: {},
      },
    ],
    recurrent: [
      {
        type: LayerType.LSTM,
        name: "LSTM",
        description: "Long Short-Term Memory (for sequences)",
        icon: <Repeat className="w-5 h-5 text-indigo-500" />,
        params: {
          units: 64,
          returnSequences: false,
        },
      },
    ],
  }

  return (
    <div className={`${isMobile ? "w-full" : "w-72 border-r"} bg-background p-4 flex flex-col h-full`}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Layers
        </h2>
      </motion.div>

      <Tabs defaultValue="core" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="core">Core</TabsTrigger>
          <TabsTrigger value="convolutional">Conv</TabsTrigger>
          <TabsTrigger value="recurrent">RNN</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1 mt-4">
          <TabsContent value="core" className="space-y-3 mt-0">
            {layerGroups.core.map((layer) => (
              <LayerItem key={layer.type} layer={layer} onAddLayer={onAddLayer} />
            ))}
          </TabsContent>
          <TabsContent value="convolutional" className="space-y-3 mt-0">
            {layerGroups.convolutional.map((layer) => (
              <LayerItem key={layer.type} layer={layer} onAddLayer={onAddLayer} />
            ))}
          </TabsContent>
          <TabsContent value="recurrent" className="space-y-3 mt-0">
            {layerGroups.recurrent.map((layer) => (
              <LayerItem key={layer.type} layer={layer} onAddLayer={onAddLayer} />
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

