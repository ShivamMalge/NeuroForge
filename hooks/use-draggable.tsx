"use client"

import { useRef } from "react"
import { useDrag } from "react-dnd"

interface UseDraggableProps {
  type: string
  item: any
  onDragEnd?: () => void
}

export function useDraggable({ type, item, onDragEnd }: UseDraggableProps) {
  const dragRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: () => item,
      end: (item, monitor) => {
        const didDrop = monitor.didDrop()
        if (didDrop && onDragEnd) {
          onDragEnd()
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [type, item, onDragEnd],
  )

  drag(dragRef)

  return { dragRef, isDragging }
}

