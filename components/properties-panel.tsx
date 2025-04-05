"use client"

import { type Layer, LayerType } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sliders, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface PropertiesPanelProps {
  selectedLayer: Layer | null
  onUpdateLayer: (layer: Layer) => void
  onBack?: () => void
  isMobile: boolean
}

export function PropertiesPanel({ selectedLayer, onUpdateLayer, onBack, isMobile }: PropertiesPanelProps) {
  if (!selectedLayer) {
    return (
      <div className={`${isMobile ? "w-full" : "w-72 border-l"} bg-background p-4 flex flex-col h-full`}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Properties
        </h2>
        <div className="flex-1 flex items-center justify-center text-center p-4 text-muted-foreground">
          <p>Select a layer to view and edit its properties</p>
        </div>
      </div>
    )
  }

  const handleUpdateParam = (key: string, value: any) => {
    const updatedLayer = {
      ...selectedLayer,
      params: {
        ...selectedLayer.params,
        [key]: value,
      },
    }
    onUpdateLayer(updatedLayer)
  }

  return (
    <div className={`${isMobile ? "w-full" : "w-72 border-l"} bg-background p-4 flex flex-col h-full`}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-4"
      >
        {isMobile && onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Properties
        </h2>
      </motion.div>

      <ScrollArea className="flex-1">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-sm font-medium mb-2">{selectedLayer.name} Layer</h3>
            <p className="text-xs text-muted-foreground mb-4">{selectedLayer.description}</p>
            <Separator className="my-4" />
          </motion.div>

          {selectedLayer.type === LayerType.INPUT && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="input-shape">Input Shape</Label>
                <div className="flex gap-2">
                  <Input
                    id="input-shape-0"
                    type="number"
                    value={selectedLayer.params.shape[0]}
                    onChange={(e) => {
                      const newShape = [...selectedLayer.params.shape]
                      const value = Number.parseInt(e.target.value)
                      newShape[0] = isNaN(value) ? 0 : value
                      handleUpdateParam("shape", newShape)
                    }}
                  />
                  <Input
                    id="input-shape-1"
                    type="number"
                    value={selectedLayer.params.shape[1]}
                    onChange={(e) => {
                      const newShape = [...selectedLayer.params.shape]
                      const value = Number.parseInt(e.target.value)
                      newShape[1] = isNaN(value) ? 0 : value
                      handleUpdateParam("shape", newShape)
                    }}
                  />
                  <Input
                    id="input-shape-2"
                    type="number"
                    value={selectedLayer.params.shape[2]}
                    onChange={(e) => {
                      const newShape = [...selectedLayer.params.shape]
                      const value = Number.parseInt(e.target.value)
                      newShape[2] = isNaN(value) ? 0 : value
                      handleUpdateParam("shape", newShape)
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">For MNIST: [28, 28, 1], For XOR: [2]</p>
              </div>
            </motion.div>
          )}

          {selectedLayer.type === LayerType.DENSE && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="dense-units">Units</Label>
                <Input
                  id="dense-units"
                  type="number"
                  value={selectedLayer.params.units}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    handleUpdateParam("units", isNaN(value) ? 0 : value)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dense-activation">Activation</Label>
                <Select
                  value={selectedLayer.params.activation}
                  onValueChange={(value) => handleUpdateParam("activation", value)}
                >
                  <SelectTrigger id="dense-activation">
                    <SelectValue placeholder="Select activation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relu">ReLU</SelectItem>
                    <SelectItem value="sigmoid">Sigmoid</SelectItem>
                    <SelectItem value="tanh">Tanh</SelectItem>
                    <SelectItem value="softmax">Softmax</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {selectedLayer.type === LayerType.DROPOUT && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="dropout-rate">Dropout Rate</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="dropout-rate"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedLayer.params.rate}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      handleUpdateParam("rate", isNaN(value) ? 0 : value)
                    }}
                  />
                  <span className="text-sm">{selectedLayer.params.rate}</span>
                </div>
              </div>
            </motion.div>
          )}

          {selectedLayer.type === LayerType.CONV2D && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="conv-filters">Filters</Label>
                <Input
                  id="conv-filters"
                  type="number"
                  value={selectedLayer.params.filters}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    handleUpdateParam("filters", isNaN(value) ? 0 : value)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conv-kernel">Kernel Size</Label>
                <div className="flex gap-2">
                  <Input
                    id="conv-kernel-0"
                    type="number"
                    value={selectedLayer.params.kernelSize[0]}
                    onChange={(e) => {
                      const newKernelSize = [...selectedLayer.params.kernelSize]
                      const value = Number.parseInt(e.target.value)
                      newKernelSize[0] = isNaN(value) ? 0 : value
                      handleUpdateParam("kernelSize", newKernelSize)
                    }}
                  />
                  <Input
                    id="conv-kernel-1"
                    type="number"
                    value={selectedLayer.params.kernelSize[1]}
                    onChange={(e) => {
                      const newKernelSize = [...selectedLayer.params.kernelSize]
                      const value = Number.parseInt(e.target.value)
                      newKernelSize[1] = isNaN(value) ? 0 : value
                      handleUpdateParam("kernelSize", newKernelSize)
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conv-activation">Activation</Label>
                <Select
                  value={selectedLayer.params.activation}
                  onValueChange={(value) => handleUpdateParam("activation", value)}
                >
                  <SelectTrigger id="conv-activation">
                    <SelectValue placeholder="Select activation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relu">ReLU</SelectItem>
                    <SelectItem value="sigmoid">Sigmoid</SelectItem>
                    <SelectItem value="tanh">Tanh</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conv-padding">Padding</Label>
                <Select
                  value={selectedLayer.params.padding}
                  onValueChange={(value) => handleUpdateParam("padding", value)}
                >
                  <SelectTrigger id="conv-padding">
                    <SelectValue placeholder="Select padding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="same">Same</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {selectedLayer.type === LayerType.MAXPOOLING2D && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="pool-size">Pool Size</Label>
                <div className="flex gap-2">
                  <Input
                    id="pool-size-0"
                    type="number"
                    value={selectedLayer.params.poolSize[0]}
                    onChange={(e) => {
                      const newPoolSize = [...selectedLayer.params.poolSize]
                      const value = Number.parseInt(e.target.value)
                      newPoolSize[0] = isNaN(value) ? 0 : value
                      handleUpdateParam("poolSize", newPoolSize)
                    }}
                  />
                  <Input
                    id="pool-size-1"
                    type="number"
                    value={selectedLayer.params.poolSize[1]}
                    onChange={(e) => {
                      const newPoolSize = [...selectedLayer.params.poolSize]
                      const value = Number.parseInt(e.target.value)
                      newPoolSize[1] = isNaN(value) ? 0 : value
                      handleUpdateParam("poolSize", newPoolSize)
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {selectedLayer.type === LayerType.LSTM && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="lstm-units">Units</Label>
                <Input
                  id="lstm-units"
                  type="number"
                  value={selectedLayer.params.units}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    handleUpdateParam("units", isNaN(value) ? 0 : value)
                  }}
                />
              </div>
              <div className="space-y-2 flex items-center justify-between">
                <Label htmlFor="lstm-return-sequences">Return Sequences</Label>
                <Switch
                  id="lstm-return-sequences"
                  checked={selectedLayer.params.returnSequences}
                  onCheckedChange={(checked) => handleUpdateParam("returnSequences", checked)}
                />
              </div>
            </motion.div>
          )}

          {selectedLayer.type === LayerType.ACTIVATION && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="activation-function">Activation Function</Label>
                <Select
                  value={selectedLayer.params.activation}
                  onValueChange={(value) => handleUpdateParam("activation", value)}
                >
                  <SelectTrigger id="activation-function">
                    <SelectValue placeholder="Select activation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relu">ReLU</SelectItem>
                    <SelectItem value="sigmoid">Sigmoid</SelectItem>
                    <SelectItem value="tanh">Tanh</SelectItem>
                    <SelectItem value="softmax">Softmax</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

