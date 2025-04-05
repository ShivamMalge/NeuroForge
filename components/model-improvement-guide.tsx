"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, ChevronRight, Lightbulb, BarChart, Zap, Brain } from "lucide-react"
import type { ModelConfig } from "@/lib/types"

interface ModelImprovementGuideProps {
  isOpen: boolean
  onClose: () => void
  modelConfig: ModelConfig
}

export function ModelImprovementGuide({ isOpen, onClose, modelConfig }: ModelImprovementGuideProps) {
  const [activeTab, setActiveTab] = useState<"architecture" | "hyperparameters" | "regularization" | "training">(
    "architecture",
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Improve Model Accuracy
          </DialogTitle>
          <DialogDescription>Try these strategies to improve your model's performance</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="px-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="hyperparameters">Hyperparameters</TabsTrigger>
              <TabsTrigger value="regularization">Regularization</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1 overflow-auto p-6 pt-4">
            {activeTab === "architecture" && (
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Improve Network Architecture
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Add more convolutional layers</h4>
                        <p className="text-sm text-muted-foreground">
                          For MNIST, try adding 2-3 Conv2D layers with increasing filter counts (32→64→128)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Increase network depth</h4>
                        <p className="text-sm text-muted-foreground">
                          Add more Dense layers after flattening (e.g., 512→256→128 units)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Use better activation functions</h4>
                        <p className="text-sm text-muted-foreground">Try LeakyReLU instead of ReLU for hidden layers</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Ensure proper output layer</h4>
                        <p className="text-sm text-muted-foreground">
                          For MNIST: Dense layer with 10 units and softmax activation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Recommended MNIST Architecture</h3>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Input (28, 28, 1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Conv2D (32 filters, 3x3, ReLU)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>MaxPooling2D (2x2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Conv2D (64 filters, 3x3, ReLU)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>MaxPooling2D (2x2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Flatten</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Dense (128 units, ReLU)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Dropout (0.3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Dense (10 units, softmax)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "hyperparameters" && (
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Optimize Hyperparameters
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Learning Rate</h4>
                        <p className="text-sm text-muted-foreground">
                          Try a smaller learning rate (0.001 or 0.0005) with Adam optimizer
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Batch Size</h4>
                        <p className="text-sm text-muted-foreground">
                          Experiment with different batch sizes (32, 64, 128)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Current: {modelConfig.batchSize}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Optimizer</h4>
                        <p className="text-sm text-muted-foreground">
                          Try different optimizers (Adam is usually good, but RMSprop can work well for CNNs)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Current: {modelConfig.optimizer}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Number of Epochs</h4>
                        <p className="text-sm text-muted-foreground">
                          Train for more epochs (20-50) to allow the model to converge
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Current: {modelConfig.epochs}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "regularization" && (
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Apply Regularization Techniques
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Dropout Layers</h4>
                        <p className="text-sm text-muted-foreground">
                          Add dropout after each Dense layer (try rates between 0.2-0.5)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Batch Normalization</h4>
                        <p className="text-sm text-muted-foreground">
                          Add BatchNormalization layers after Conv2D layers to stabilize training
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Data Augmentation</h4>
                        <p className="text-sm text-muted-foreground">
                          For image data, apply random rotations, shifts, and zooms to increase dataset variety
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Early Stopping</h4>
                        <p className="text-sm text-muted-foreground">
                          Stop training when validation accuracy stops improving to prevent overfitting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "training" && (
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Training Strategies
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Learning Rate Scheduling</h4>
                        <p className="text-sm text-muted-foreground">Reduce learning rate when training plateaus</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Proper Data Preprocessing</h4>
                        <p className="text-sm text-muted-foreground">Normalize input data to range [0,1] or [-1,1]</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Use More Training Data</h4>
                        <p className="text-sm text-muted-foreground">
                          If possible, increase the amount of training data
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Transfer Learning</h4>
                        <p className="text-sm text-muted-foreground">
                          For complex tasks, start with pre-trained models and fine-tune
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Quick Fixes for Low Accuracy</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Increase model capacity (more layers, more units)</li>
                    <li>Train for more epochs (at least 20-30 for MNIST)</li>
                    <li>Ensure proper output layer configuration</li>
                    <li>Check for data normalization (divide pixel values by 255)</li>
                    <li>Use a proven architecture like the one in the Architecture tab</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

