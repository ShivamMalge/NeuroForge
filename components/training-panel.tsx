"use client"

import { useState } from "react"
import type { ModelConfig, TrainingMetrics } from "@/lib/types"
import { Play, Pause, BarChart, ChevronUp, ChevronDown, Loader2, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainingChart } from "@/components/training-chart"
import { motion, AnimatePresence } from "framer-motion"

interface TrainingPanelProps {
  isTraining: boolean
  metrics: TrainingMetrics
  modelConfig: ModelConfig
  onUpdateModelConfig: (config: Partial<ModelConfig>) => void
  onStartTraining: () => void
  isMobile: boolean
  isLoading?: boolean
  onShowImprovementGuide?: () => void
}

export function TrainingPanel({
  isTraining,
  metrics,
  modelConfig,
  onUpdateModelConfig,
  onStartTraining,
  isMobile,
  isLoading = false,
  onShowImprovementGuide,
}: TrainingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if accuracy is low
  const hasLowAccuracy = metrics.accuracy.length > 0 && metrics.accuracy[metrics.accuracy.length - 1] < 0.7

  return (
    <div
      className={`border-t bg-background/80 backdrop-blur-sm transition-all ${isExpanded ? "h-96" : "h-16"} ${isMobile ? "pb-16" : ""}`}
    >
      <div className="flex items-center justify-between px-4 h-16">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-sm font-medium">
          <BarChart className="w-5 h-5" />
          Training Panel
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {isExpanded ? "Click to collapse" : "Click to expand"}
          </span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <div className="flex items-center gap-2">
          {hasLowAccuracy && onShowImprovementGuide && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowImprovementGuide}
              className="gap-1 text-yellow-600 border-yellow-300 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-950"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Improve Accuracy</span>
            </Button>
          )}

          <Select
            value={modelConfig.dataset}
            onValueChange={(value) => onUpdateModelConfig({ dataset: value })}
            disabled={isTraining || isLoading}
          >
            <SelectTrigger className={isMobile ? "w-24" : "w-32"}>
              <SelectValue placeholder="Dataset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mnist">MNIST</SelectItem>
              <SelectItem value="xor">XOR</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onStartTraining} disabled={isTraining || isLoading} className="gap-2">
            {isTraining ? (
              <>
                <Pause className="w-4 h-4" /> {isMobile ? "" : "Training..."}
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> {isMobile ? "" : "Loading..."}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> {isMobile ? "" : "Train Model"}
              </>
            )}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="p-4 h-80"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "20rem" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-3 gap-6"} h-full`}>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Training Configuration</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Optimizer</label>
                      <Select
                        value={modelConfig.optimizer}
                        onValueChange={(value) => onUpdateModelConfig({ optimizer: value })}
                        disabled={isTraining || isLoading}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Optimizer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adam">Adam</SelectItem>
                          <SelectItem value="sgd">SGD</SelectItem>
                          <SelectItem value="rmsprop">RMSprop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Loss Function</label>
                      <Select
                        value={modelConfig.loss}
                        onValueChange={(value) => onUpdateModelConfig({ loss: value })}
                        disabled={isTraining || isLoading}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Loss" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="categoricalCrossentropy">Categorical CE</SelectItem>
                          <SelectItem value="binaryCrossentropy">Binary CE</SelectItem>
                          <SelectItem value="meanSquaredError">MSE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Batch Size: {modelConfig.batchSize}</label>
                    </div>
                    <Slider
                      value={[modelConfig.batchSize]}
                      min={8}
                      max={128}
                      step={8}
                      disabled={isTraining || isLoading}
                      onValueChange={(value) => onUpdateModelConfig({ batchSize: value[0] })}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Epochs: {modelConfig.epochs}</label>
                    </div>
                    <Slider
                      value={[modelConfig.epochs]}
                      min={1}
                      max={50}
                      step={1}
                      disabled={isTraining || isLoading}
                      onValueChange={(value) => onUpdateModelConfig({ epochs: value[0] })}
                    />
                  </div>
                </div>
              </div>
              <div className={isMobile ? "" : "col-span-2 overflow-hidden"}>
                <Tabs defaultValue="accuracy" className="h-full flex flex-col">
                  <TabsList>
                    <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                    <TabsTrigger value="loss">Loss</TabsTrigger>
                  </TabsList>
                  <div className="flex-1 mt-4 overflow-hidden">
                    <TabsContent value="accuracy" className="h-full">
                      <TrainingChart
                        data={metrics.epoch.map((epoch, i) => ({
                          epoch,
                          value: metrics.accuracy[i],
                          validationValue: metrics.validationAccuracy[i],
                        }))}
                        yLabel="Accuracy"
                        color="hsl(var(--chart-green))"
                        validationColor="hsl(var(--chart-blue))"
                        showValidation={metrics.validationAccuracy.length > 0}
                      />
                    </TabsContent>
                    <TabsContent value="loss" className="h-full">
                      <TrainingChart
                        data={metrics.epoch.map((epoch, i) => ({
                          epoch,
                          value: metrics.loss[i],
                          validationValue: metrics.validationLoss[i],
                        }))}
                        yLabel="Loss"
                        color="hsl(var(--chart-red))"
                        validationColor="hsl(var(--chart-purple))"
                        showValidation={metrics.validationLoss.length > 0}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

