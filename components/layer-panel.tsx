"use client"

import { type Layer, LayerType } from "@/lib/types"
import { Layers, Box, Grid3X3, Droplets, Repeat, Maximize, Minimize, LayoutGrid, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDrag } from "react-dnd"

interface LayerItemProps {
  layer: Layer
  onAddLayer: (layer: Layer) => void
}

function LayerItem({ layer, onAddLayer }: LayerItemProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "LAYER",
      item: layer,
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult()
        if (item && dropResult) {
          onAddLayer(layer)
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [layer, onAddLayer],
  )

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 p-3 rounded-md border cursor-move hover:bg-accent ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={() => onAddLayer(layer)} // Also allow click to add for better UX
    >
      {layer.icon}
      <div>
        <h3 className="font-medium">{layer.name}</h3>
        <p className="text-xs text-muted-foreground">{layer.description}</p>
      </div>
    </div>
  )
}

interface LayerPanelProps {
  onAddLayer: (layer: Layer) => void
}

export function LayerPanel({ onAddLayer }: LayerPanelProps) {
  const layerGroups = {
    core: [
      {
        type: LayerType.INPUT,
        name: "Input",
        description: "Input layer for the model",
        icon: <Box className="w-5 h-5 text-blue-500" />,
        params: {
          shape: [28, 28, 1],
        },
      },
      {
        type: LayerType.DENSE,
        name: "Dense",
        description: "Fully connected layer",
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
        description: "2D convolutional layer",
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
        description: "2D max pooling layer",
        icon: <Maximize className="w-5 h-5 text-yellow-500" />,
        params: {
          poolSize: [2, 2],
        },
      },
      {
        type: LayerType.FLATTEN,
        name: "Flatten",
        description: "Flattens input to 1D",
        icon: <Minimize className="w-5 h-5 text-orange-500" />,
        params: {},
      },
    ],
    recurrent: [
      {
        type: LayerType.LSTM,
        name: "LSTM",
        description: "Long Short-Term Memory",
        icon: <Repeat className="w-5 h-5 text-indigo-500" />,
        params: {
          units: 64,
          returnSequences: false,
        },
      },
    ],
  }

  return (
    <div className="w-72 border-r bg-background p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5" />
        Layers
      </h2>
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

