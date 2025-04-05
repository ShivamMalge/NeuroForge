"use client"

import { useState } from "react"
import { TerminalIcon, InfoIcon, Code2, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface AppHeaderProps {
  showConsole: boolean
  setShowConsole: (show: boolean) => void
  onGenerateCode: () => void
  onShowImprovementGuide: () => void
}

export function AppHeader({ showConsole, setShowConsole, onGenerateCode, onShowImprovementGuide }: AppHeaderProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Update the info tooltip to provide better guidance
  const handleInfoClick = () => {
    toast(
      <div className="space-y-2">
        <h3 className="text-base font-medium">How to Build a Neural Network</h3>
        <p className="text-sm">
          <strong>Step 1:</strong> Add an <strong>Input</strong> layer from the Layers panel.
          <br />• For MNIST: use input shape [28, 28, 1]
          <br />• For XOR: use input shape [2]
        </p>
        <p className="text-sm">
          <strong>Step 2:</strong> Add hidden layers (Conv2D, MaxPooling2D, Flatten, Dense, etc.)
        </p>
        <p className="text-sm">
          <strong>Step 3:</strong> Add a final <strong>Dense</strong> output layer:
          <br />• For MNIST: 10 units with softmax activation
          <br />• For XOR: 1 unit with sigmoid activation
        </p>
        <p className="text-sm">
          <strong>Example MNIST model:</strong> Input → Conv2D → MaxPooling2D → Flatten → Dense(128) → Dropout →
          Dense(10, softmax)
        </p>
      </div>,
      {
        duration: 12000,
        icon: <InfoIcon className="h-5 w-5" />,
      },
    )
  }

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-10 h-10 rounded-md bg-primary flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-primary-foreground"
              animate={
                isHovered
                  ? {
                      pathLength: [0, 1],
                      pathOffset: [0.2, 0],
                      opacity: [0.5, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
            </motion.svg>
          </motion.div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            NeuroForge
          </h1>
        </motion.div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleInfoClick}>
                  <InfoIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>How to Build a Model</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConsole(!showConsole)}
                  className={showConsole ? "text-primary" : ""}
                >
                  <TerminalIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Console</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onGenerateCode}>
                  <Code2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate Code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onShowImprovementGuide}>
                  <Lightbulb className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Improve Model</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="hidden md:flex gap-2">
            <Button variant="outline" onClick={onShowImprovementGuide}>
              <Lightbulb className="mr-2 h-4 w-4" /> Improve Model
            </Button>
            <Button onClick={onGenerateCode}>
              <Code2 className="mr-2 h-4 w-4" /> Generate Code
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

