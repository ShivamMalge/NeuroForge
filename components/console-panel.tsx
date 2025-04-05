"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal, X } from "lucide-react"
import type { LogEntry } from "@/lib/types"
import { motion } from "framer-motion"

interface ConsolePanelProps {
  logs: LogEntry[]
  onClose: () => void
}

export function ConsolePanel({ logs, onClose }: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLogClass = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-500"
      case "success":
        return "text-green-500"
      default:
        return "text-foreground"
    }
  }

  return (
    <motion.div
      className="border-t bg-black/90 text-white"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "12rem", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 h-8 bg-gray-900">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Terminal className="w-4 h-4" />
          Console
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-800">
          <X className="w-4 h-4" />
        </button>
      </div>
      <ScrollArea className="h-40 p-2 font-mono text-sm" ref={scrollRef}>
        {logs.length === 0 ? (
          <div className="p-2 text-muted-foreground">No logs yet.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`p-1 ${getLogClass(log.type)}`}>
              <span className="text-muted-foreground text-xs mr-2">[{log.timestamp.toLocaleTimeString()}]</span>
              {log.message}
            </div>
          ))
        )}
      </ScrollArea>
    </motion.div>
  )
}

