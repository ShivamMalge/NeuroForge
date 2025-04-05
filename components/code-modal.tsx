"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Download, Code2 } from "lucide-react"
import { toast } from "sonner"

interface CodeModalProps {
  isOpen: boolean
  onClose: () => void
  pythonCode: string
  javascriptCode: string
}

export function CodeModal({ isOpen, onClose, pythonCode, javascriptCode }: CodeModalProps) {
  const [activeTab, setActiveTab] = useState<"python" | "javascript">("python")

  const handleCopyCode = () => {
    const codeToCopy = activeTab === "python" ? pythonCode : javascriptCode
    navigator.clipboard.writeText(codeToCopy)
    toast.success("Code copied to clipboard")
  }

  const handleDownloadCode = () => {
    const codeToCopy = activeTab === "python" ? pythonCode : javascriptCode
    const fileName = activeTab === "python" ? "model.py" : "model.js"
    const blob = new Blob([codeToCopy], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${fileName}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Generated Model Code
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center px-6 py-2">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "python" | "javascript")}>
              <TabsList>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="default" size="sm" onClick={handleDownloadCode}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-6 pt-2">
            {activeTab === "python" ? (
              <div className="bg-zinc-950 text-zinc-100 p-4 rounded-md h-full overflow-auto">
                <pre className="font-mono text-sm whitespace-pre-wrap">{pythonCode}</pre>
              </div>
            ) : (
              <div className="bg-zinc-950 text-zinc-100 p-4 rounded-md h-full overflow-auto">
                <pre className="font-mono text-sm whitespace-pre-wrap">{javascriptCode}</pre>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

