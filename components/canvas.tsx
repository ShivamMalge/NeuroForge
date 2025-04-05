"use client"

import { useCallback, useState, useEffect } from "react"
import ReactFlow, { Background, Controls, MiniMap, type NodeTypes } from "reactflow"
import LayerNode from "@/components/layer-node"
import { useDrop } from "react-dnd"

interface CanvasProps {
  nodes: any[]
  edges: any[]
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
  onConnect: (params: any) => void
  onNodeSelect: (node: any) => void
  onUpdateNode: (node: any) => void
}

export function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onUpdateNode,
}: CanvasProps) {
  const [rfInstance, setRfInstance] = useState(null)
  const [isReady, setIsReady] = useState(false)

  const nodeTypes: NodeTypes = {
    layerNode: LayerNode,
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "LAYER",
    drop: () => ({ name: "Canvas" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const onNodeClick = useCallback(
    (event: any, node: any) => {
      onNodeSelect(node)
    },
    [onNodeSelect],
  )

  // Delay initialization to ensure DOM is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={drop}
      className={`canvas-container overflow-hidden ${isOver ? "bg-primary/10" : ""}`}
      data-testid="canvas-drop-area"
    >
      {isReady ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          onInit={setRfInstance}
          fitView
          attributionPosition="bottom-right"
          minZoom={0.2}
          maxZoom={4}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Initializing canvas...</p>
        </div>
      )}
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-primary/20 border-2 border-dashed border-primary rounded-lg p-8">
            <p className="text-lg font-medium text-primary">Drop layer here</p>
          </div>
        </div>
      )}
    </div>
  )
}

