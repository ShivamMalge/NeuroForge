import type React from "react"
export enum LayerType {
  INPUT = "input",
  DENSE = "dense",
  DROPOUT = "dropout",
  CONV2D = "conv2d",
  MAXPOOLING2D = "maxpooling2d",
  FLATTEN = "flatten",
  LSTM = "lstm",
  ACTIVATION = "activation",
}

export interface Layer {
  id?: string
  type: LayerType
  name: string
  description: string
  icon: React.ReactNode
  params: any
}

export interface ModelConfig {
  optimizer: "adam" | "sgd" | "rmsprop"
  loss: "categoricalCrossentropy" | "binaryCrossentropy" | "meanSquaredError"
  metrics: string[]
  batchSize: number
  epochs: number
  dataset: "mnist" | "xor"
}

export interface TrainingMetrics {
  accuracy: number[]
  loss: number[]
  epoch: number[]
  validationAccuracy: number[]
  validationLoss: number[]
}

export interface LogEntry {
  message: string
  type: "info" | "error" | "success"
  timestamp: Date
}

