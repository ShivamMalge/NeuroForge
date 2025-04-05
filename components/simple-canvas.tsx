"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Layer, LayerType } from "@/lib/types"
import { X, ChevronDown, ChevronUp, Plus } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"

interface SimpleCanvasProps {
  layers: Layer[]
  selectedLayer: Layer | null
  onSelectLayer: (layer: Layer) => void
  onRemoveLayer: (id: string) => void
  onUpdateLayer: (layer: Layer) => void
  onMoveLayer: (dragIndex: number, hoverIndex: number) => void
}

export function SimpleCanvas({
  layers,
  selectedLayer,
  onSelectLayer,
  onRemoveLayer,
  onUpdateLayer,
  onMoveLayer,
}: SimpleCanvasProps) {
  const isMobile = useMobile()
  const [isDragOver, setIsDragOver] = useState(false)

  const handleLayerSelect = (layer: Layer) => {
    onSelectLayer(layer)
  }

  const getLayerColor = (type: LayerType) => {
    switch (type) {
      case LayerType.INPUT:
        return "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-700 dark:text-blue-300"
      case LayerType.DENSE:
        return "bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:border-green-700 dark:text-green-300"
      case LayerType.DROPOUT:
        return "bg-gradient-to-r from-red-100 to-red-200 border-red-300 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:border-red-700 dark:text-red-300"
      case LayerType.CONV2D:
        return "bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 text-purple-800 dark:from-purple-900/30 dark:to-purple-800/30 dark:border-purple-700 dark:text-purple-300"
      case LayerType.MAXPOOLING2D:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:border-yellow-700 dark:text-yellow-300"
      case LayerType.FLATTEN:
        return "bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300 text-orange-800 dark:from-orange-900/30 dark:to-orange-800/30 dark:border-orange-700 dark:text-orange-300"
      case LayerType.LSTM:
        return "bg-gradient-to-r from-indigo-100 to-indigo-200 border-indigo-300 text-indigo-800 dark:from-indigo-900/30 dark:to-indigo-800/30 dark:border-indigo-700 dark:text-indigo-300"
      case LayerType.ACTIVATION:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:border-yellow-700 dark:text-yellow-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-800 dark:from-gray-900/30 dark:to-gray-800/30 dark:border-gray-700 dark:text-gray-300"
    }
  }

  const getLayerWidth = (type: LayerType) => {
    if (isMobile) return "w-full"

    switch (type) {
      case LayerType.INPUT:
        return "w-40"
      case LayerType.DENSE:
        return "w-48"
      case LayerType.DROPOUT:
        return "w-36"
      case LayerType.CONV2D:
        return "w-52"
      case LayerType.MAXPOOLING2D:
        return "w-44"
      case LayerType.FLATTEN:
        return "w-36"
      case LayerType.LSTM:
        return "w-48"
      case LayerType.ACTIVATION:
        return "w-40"
      default:
        return "w-40"
    }
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-[500px] rounded-lg border-2 border-dashed transition-colors overflow-hidden ${
        isDragOver ? "border-primary bg-primary/5" : "border-border"
      } ${isMobile ? "pb-16" : ""}`}
    >
      {layers.length === 0 ? (
        <motion.div
          className="text-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-medium">Build Your Neural Network</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Add layers from the panel to create your model</p>
          {isMobile && (
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => document.querySelector('[data-panel="layers"]')?.click()}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Layers
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-8 py-12 w-full px-4">
          <AnimatePresence>
            {layers.map((layer, index) => (
              <motion.div
                key={layer.id}
                className="relative flex flex-col items-center w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {index > 0 && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                      <path
                        d="M12 4L12 20M12 20L18 14M12 20L6 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <motion.div
                  layoutId={layer.id}
                  onClick={() => handleLayerSelect(layer)}
                  className={`${getLayerColor(layer.type)} ${getLayerWidth(
                    layer.type,
                  )} relative flex flex-col justify-center p-4 rounded-lg border-2 shadow-sm cursor-pointer backdrop-blur-sm ${
                    selectedLayer?.id === layer.id ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute top-2 right-2 flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onMoveLayer(index, index - 1)
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded-full bg-background/80 hover:bg-background"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                    )}
                    {index < layers.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onMoveLayer(index, index + 1)
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded-full bg-background/80 hover:bg-background"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveLayer(layer.id!)
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-background/80 hover:bg-background hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {layer.icon}
                    <h3 className="font-medium">{layer.name}</h3>
                  </div>
                  <div className="mt-1 text-xs">
                    {layer.type === LayerType.INPUT && <p>Shape: {JSON.stringify(layer.params.shape)}</p>}
                    {layer.type === LayerType.DENSE && (
                      <p>
                        Units: {layer.params.units}, Activation: {layer.params.activation}
                      </p>
                    )}
                    {layer.type === LayerType.DROPOUT && <p>Rate: {layer.params.rate}</p>}
                    {layer.type === LayerType.CONV2D && (
                      <p>
                        Filters: {layer.params.filters}, Kernel: {JSON.stringify(layer.params.kernelSize)}
                      </p>
                    )}
                    {layer.type === LayerType.MAXPOOLING2D && <p>Pool Size: {JSON.stringify(layer.params.poolSize)}</p>}
                    {layer.type === LayerType.ACTIVATION && <p>Function: {layer.params.activation}</p>}
                    {layer.type === LayerType.LSTM && (
                      <p>
                        Units: {layer.params.units}, Return Sequences: {layer.params.returnSequences ? "Yes" : "No"}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

