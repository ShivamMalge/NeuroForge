"use client"

import { useRef } from "react"
import { useDrop } from "react-dnd"

interface UseDroppableProps {
  accept: string | string[]
  onDrop: (item: any, monitor: any) => void
}

export function useDroppable({ accept, onDrop }: UseDroppableProps) {
  const dropRef = useRef<HTMLDivElement>(null)

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept,
      drop: (item, monitor) => {
        if (onDrop) {
          onDrop(item, monitor)
        }
        return { name: "Canvas" }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [accept, onDrop],
  )

  drop(dropRef)

  return { dropRef, isOver }
}

