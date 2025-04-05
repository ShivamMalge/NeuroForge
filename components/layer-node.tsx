"use client"

import { memo } from "react"
import { Handle, Position } from "reactflow"
import { LayerType } from "@/lib/types"

function getLayerColor(type: LayerType) {
  switch (type) {
    case LayerType.INPUT:
      return "bg-blue-100 border-blue-300 text-blue-800"
    case LayerType.DENSE:
      return "bg-green-100 border-green-300 text-green-800"
    case LayerType.DROPOUT:
      return "bg-red-100 border-red-300 text-red-800"
    case LayerType.CONV2D:
      return "bg-purple-100 border-purple-300 text-purple-800"
    case LayerType.MAXPOOLING2D:
      return "bg-yellow-100 border-yellow-300 text-yellow-800"
    case LayerType.FLATTEN:
      return "bg-orange-100 border-orange-300 text-orange-800"
    case LayerType.LSTM:
      return "bg-indigo-100 border-indigo-300 text-indigo-800"
    case LayerType.ACTIVATION:
      return "bg-yellow-100 border-yellow-300 text-yellow-800"
    default:
      return "bg-gray-100 border-gray-300 text-gray-800"
  }
}

function getLayerParams(type: LayerType, params: any) {
  switch (type) {
    case LayerType.INPUT:
      return `Shape: ${JSON.stringify(params.shape)}`
    case LayerType.DENSE:
      return `Units: ${params.units}, Activation: ${params.activation}`
    case LayerType.DROPOUT:
      return `Rate: ${params.rate}`
    case LayerType.CONV2D:
      return `Filters: ${params.filters}, Kernel: ${JSON.stringify(params.kernelSize)}`
    case LayerType.MAXPOOLING2D:
      return `Pool Size: ${JSON.stringify(params.poolSize)}`
    case LayerType.FLATTEN:
      return `Flattens input`
    case LayerType.LSTM:
      return `Units: ${params.units}, Return Sequences: ${params.returnSequences ? "Yes" : "No"}`
    case LayerType.ACTIVATION:
      return `Function: ${params.activation}`
    default:
      return ""
  }
}

function LayerNode({ data }: { data: any }) {
  const colorClass = getLayerColor(data.type)
  const paramText = getLayerParams(data.type, data.params)

  return (
    <div className={`px-4 py-2 rounded-md border-2 shadow-sm ${colorClass}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <div className="font-medium">{data.name}</div>
      <div className="text-xs mt-1">{paramText}</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  )
}

export default memo(LayerNode)

