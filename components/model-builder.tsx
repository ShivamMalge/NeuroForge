"use client"

import { useState, useEffect, useCallback } from "react"
import { SimpleLayerPanel } from "@/components/simple-layer-panel"
import { SimpleCanvas } from "@/components/simple-canvas"
import { TrainingPanel } from "@/components/training-panel"
import { PropertiesPanel } from "@/components/properties-panel"
import { ConsolePanel } from "@/components/console-panel"
import { AppHeader } from "@/components/app-header"
import { MobileNavigation } from "@/components/mobile-navigation"
import { CodeModal } from "@/components/code-modal"
import { ModelImprovementGuide } from "@/components/model-improvement-guide"
import type { Layer, ModelConfig, TrainingMetrics, LogEntry } from "@/lib/types"
import { buildTensorflowModel, trainModel, getXORData, getMNISTData, loadTensorflowJS } from "@/lib/tensorflow-utils"
import { generatePythonCode, generateTensorflowJSCode } from "@/lib/code-generator"
import { useMobile } from "@/hooks/use-mobile"
import { toast } from "sonner"

export function ModelBuilder() {
  const isMobile = useMobile()
  const [activePanel, setActivePanel] = useState<"layers" | "canvas" | "properties">("canvas")
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null)
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
    batchSize: 32,
    epochs: 10,
    dataset: "mnist",
  })
  const [isTraining, setIsTraining] = useState(false)
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics>({
    accuracy: [],
    loss: [],
    epoch: [],
    validationAccuracy: [],
    validationLoss: [],
  })
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [model, setModel] = useState<any>(null)
  const [trainData, setTrainData] = useState<any>(null)
  const [testData, setTestData] = useState<any>(null)
  const [showConsole, setShowConsole] = useState(false)
  const [isTfLoaded, setIsTfLoaded] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)

  // Add state for code modal
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [pythonCode, setPythonCode] = useState("")
  const [javascriptCode, setJavascriptCode] = useState("")

  // Add state for improvement guide modal
  const [showImprovementGuide, setShowImprovementGuide] = useState(false)

  // Initialize TensorFlow.js
  useEffect(() => {
    const initTensorflow = async () => {
      try {
        await loadTensorflowJS()
        setIsTfLoaded(true)
        addLog("TensorFlow.js initialized successfully", "success")
      } catch (error) {
        console.error("Failed to initialize TensorFlow.js:", error)
        addLog("Failed to initialize TensorFlow.js. Some features may not work correctly.", "error")
      }
    }

    initTensorflow()
  }, [])

  // Update the addLog function to also show a toast
  const addLog = useCallback((message: string, type: "info" | "error" | "success" = "info") => {
    setLogs((prevLogs) => [...prevLogs, { message, type, timestamp: new Date() }])

    // Also show a toast notification for important messages
    if (type === "error") {
      toast.error(message)
    } else if (type === "success" && !message.includes("TensorFlow")) {
      toast.success(message)
    }
  }, [])

  // Make sure the handleAddLayer function properly updates the state
  const handleAddLayer = useCallback(
    (layer: Layer) => {
      const newLayer = { ...layer, id: `layer-${Date.now()}` }
      setLayers((prevLayers) => [...prevLayers, newLayer])
      addLog(`Added ${layer.name} layer`, "success")

      // On mobile, switch to canvas view after adding a layer
      if (isMobile) {
        setActivePanel("canvas")
      }
    },
    [addLog, isMobile, setActivePanel],
  )

  const handleRemoveLayer = useCallback(
    (id: string) => {
      setLayers((prevLayers) => prevLayers.filter((layer) => layer.id !== id))
      if (selectedLayer?.id === id) {
        setSelectedLayer(null)
      }
      addLog("Removed layer", "info")
    },
    [selectedLayer, addLog],
  )

  const handleSelectLayer = useCallback(
    (layer: Layer) => {
      setSelectedLayer(layer)
      // On mobile, switch to properties panel when selecting a layer
      if (isMobile) {
        setActivePanel("properties")
      }
    },
    [isMobile],
  )

  const handleUpdateLayer = useCallback((updatedLayer: Layer) => {
    setLayers((prevLayers) => prevLayers.map((layer) => (layer.id === updatedLayer.id ? updatedLayer : layer)))
    setSelectedLayer(updatedLayer)
  }, [])

  const handleMoveLayer = useCallback((dragIndex: number, hoverIndex: number) => {
    setLayers((prevLayers) => {
      const newLayers = [...prevLayers]
      const draggedLayer = newLayers[dragIndex]
      newLayers.splice(dragIndex, 1)
      newLayers.splice(hoverIndex, 0, draggedLayer)
      return newLayers
    })
  }, [])

  const handleUpdateModelConfig = (config: Partial<ModelConfig>) => {
    setModelConfig({ ...modelConfig, ...config })
  }

  // Function to generate code for the current model
  const generateModelCode = useCallback(() => {
    if (layers.length === 0) {
      toast.error("Cannot generate code: No layers added to the model")
      return
    }

    try {
      // Generate Python code
      const pyCode = generatePythonCode(layers, modelConfig)
      setPythonCode(pyCode)

      // Generate JavaScript code
      const jsCode = generateTensorflowJSCode(layers, modelConfig)
      setJavascriptCode(jsCode)

      // Show the code modal
      setShowCodeModal(true)
    } catch (error) {
      console.error("Error generating code:", error)
      toast.error("Failed to generate code")
    }
  }, [layers, modelConfig])

  const loadDataset = async () => {
    if (!isTfLoaded) {
      addLog("TensorFlow.js is not fully loaded yet. Please wait a moment and try again.", "error")
      return
    }

    setIsDataLoading(true)

    try {
      addLog(`Loading ${modelConfig.dataset} dataset...`)

      if (modelConfig.dataset === "xor") {
        const { xTrain, yTrain, xTest, yTest } = getXORData()
        setTrainData({ xs: xTrain, ys: yTrain })
        setTestData({ xs: xTest, ys: yTest })
        addLog("XOR dataset loaded successfully", "success")
      } else if (modelConfig.dataset === "mnist") {
        addLog("Loading MNIST dataset (this may take a moment)...")

        // Show a toast to inform the user that we're using mock data for the demo
        toast("Using simulated MNIST data for demonstration purposes", {
          description: "In a production environment, this would load the actual MNIST dataset.",
          duration: 5000,
        })

        const { xTrain, yTrain, xTest, yTest } = await getMNISTData()
        setTrainData({ xs: xTrain, ys: yTrain })
        setTestData({ xs: xTest, ys: yTest })
        addLog("MNIST dataset loaded successfully", "success")
      }
    } catch (error) {
      console.error("Error loading dataset:", error)
      addLog(`Error loading dataset: ${error}`, "error")
    } finally {
      setIsDataLoading(false)
    }
  }

  // Enhance the handleStartTraining function with better validation and guidance
  const handleStartTraining = async () => {
    if (!isTfLoaded) {
      addLog("TensorFlow.js is not fully loaded yet. Please wait a moment and try again.", "error")
      return
    }

    if (layers.length === 0) {
      addLog("Cannot train: No layers added to the model", "error")
      toast.error("Your model is empty. Add layers from the Layers panel.", {
        description: "Click the info icon in the header for guidance on building a model.",
        duration: 5000,
      })
      return
    }

    // Check if we have an input layer
    const hasInputLayer = layers.some((layer) => layer.type === "input")
    if (!hasInputLayer) {
      addLog("Model must have an Input layer. Add one from the Layers panel.", "error")
      toast.error("Missing Input layer", {
        description: "Your model must start with an Input layer. Add one from the Layers panel.",
        duration: 5000,
      })
      return
    }

    // Check if the model has an appropriate output layer for the dataset
    const lastLayer = layers[layers.length - 1]
    const isClassification = modelConfig.loss.includes("Crossentropy")

    if (isClassification) {
      if (
        modelConfig.dataset === "mnist" &&
        (lastLayer.type !== "dense" || lastLayer.params.units !== 10 || lastLayer.params.activation !== "softmax")
      ) {
        toast.warning("Recommended: Add a Dense output layer", {
          description:
            "For MNIST classification, your last layer should be Dense with 10 units and softmax activation.",
          duration: 8000,
        })
      } else if (
        modelConfig.dataset === "xor" &&
        (lastLayer.type !== "dense" || lastLayer.params.units !== 1 || lastLayer.params.activation !== "sigmoid")
      ) {
        toast.warning("Recommended: Add a Dense output layer", {
          description: "For XOR classification, your last layer should be Dense with 1 unit and sigmoid activation.",
          duration: 8000,
        })
      }
    }

    try {
      setIsTraining(true)
      setShowConsole(true)
      setTrainingMetrics({
        accuracy: [],
        loss: [],
        epoch: [],
        validationAccuracy: [],
        validationLoss: [],
      })

      // Load dataset if not already loaded
      if (!trainData || !testData) {
        await loadDataset()
      }

      // Build TensorFlow.js model from layers
      const layerConfigs = layers.map((layer) => ({
        type: layer.type,
        params: layer.params,
      }))

      addLog("Building TensorFlow.js model...")

      try {
        const tfModel = buildTensorflowModel(layerConfigs, modelConfig)
        setModel(tfModel)

        // Log model summary
        addLog("Model created successfully", "success")
        tfModel.summary()

        // Train the model
        addLog(`Starting training with ${modelConfig.epochs} epochs...`)
        await trainModel(tfModel, trainData, testData, modelConfig, (epoch, logs) => {
          // Update metrics on each epoch
          setTrainingMetrics((prev) => ({
            accuracy: [...prev.accuracy, logs.acc],
            loss: [...prev.loss, logs.loss],
            validationAccuracy: [...prev.validationAccuracy, logs.val_acc],
            validationLoss: [...prev.validationLoss, logs.val_loss],
            epoch: [...prev.epoch, epoch + 1],
          }))

          addLog(`Epoch ${epoch + 1}/${modelConfig.epochs}: loss=${logs.loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}`)
        })

        addLog("Training completed successfully!", "success")

        // Check if accuracy is low and offer improvement suggestions
        const finalAccuracy = trainingMetrics.accuracy[trainingMetrics.accuracy.length - 1] || 0
        if (finalAccuracy < 0.7) {
          toast.info("Your model's accuracy is low. Want to see improvement tips?", {
            action: {
              label: "Show Tips",
              onClick: () => setShowImprovementGuide(true),
            },
            duration: 10000,
          })
        }

        // Show toast with option to generate code
        toast.success("Training completed! Generate code for your model?", {
          action: {
            label: "Generate Code",
            onClick: generateModelCode,
          },
          duration: 10000,
        })
      } catch (modelError) {
        console.error("Model building error:", modelError)
        addLog(`Error building model: ${modelError.message}`, "error")

        // Provide more helpful error messages based on common issues
        if (modelError.message.includes("dimension") || modelError.message.includes("shape")) {
          toast.error("Model architecture error", {
            description:
              "There's a mismatch in layer dimensions. Make sure your model architecture is correct for the selected dataset.",
            duration: 8000,
          })
        }

        throw modelError
      }
    } catch (error) {
      console.error("Training error:", error)
      addLog(`Training error: ${error}`, "error")
    } finally {
      setIsTraining(false)
    }
  }

  useEffect(() => {
    // Load initial dataset when TensorFlow is ready
    if (isTfLoaded && !isDataLoading) {
      loadDataset()
    }
  }, [modelConfig.dataset, isTfLoaded])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader
        showConsole={showConsole}
        setShowConsole={setShowConsole}
        onGenerateCode={generateModelCode}
        onShowImprovementGuide={() => setShowImprovementGuide(true)}
      />

      {isMobile ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-4">
            {activePanel === "layers" && <SimpleLayerPanel onAddLayer={handleAddLayer} />}
            {activePanel === "canvas" && (
              <SimpleCanvas
                layers={layers}
                selectedLayer={selectedLayer}
                onSelectLayer={handleSelectLayer}
                onRemoveLayer={handleRemoveLayer}
                onUpdateLayer={handleUpdateLayer}
                onMoveLayer={handleMoveLayer}
              />
            )}
            {activePanel === "properties" && selectedLayer && (
              <PropertiesPanel
                selectedLayer={selectedLayer}
                onUpdateLayer={handleUpdateLayer}
                onBack={() => setActivePanel("canvas")}
                isMobile={true}
              />
            )}
          </div>
          <TrainingPanel
            isTraining={isTraining}
            metrics={trainingMetrics}
            modelConfig={modelConfig}
            onUpdateModelConfig={handleUpdateModelConfig}
            onStartTraining={handleStartTraining}
            isMobile={isMobile}
            isLoading={isDataLoading}
            onShowImprovementGuide={() => setShowImprovementGuide(true)}
          />
          {showConsole && <ConsolePanel logs={logs} onClose={() => setShowConsole(false)} />}
          <MobileNavigation
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            hasSelectedLayer={!!selectedLayer}
          />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <SimpleLayerPanel onAddLayer={handleAddLayer} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto p-4">
              <SimpleCanvas
                layers={layers}
                selectedLayer={selectedLayer}
                onSelectLayer={handleSelectLayer}
                onRemoveLayer={handleRemoveLayer}
                onUpdateLayer={handleUpdateLayer}
                onMoveLayer={handleMoveLayer}
              />
            </div>
            <TrainingPanel
              isTraining={isTraining}
              metrics={trainingMetrics}
              modelConfig={modelConfig}
              onUpdateModelConfig={handleUpdateModelConfig}
              onStartTraining={handleStartTraining}
              isMobile={isMobile}
              isLoading={isDataLoading}
              onShowImprovementGuide={() => setShowImprovementGuide(true)}
            />
            {showConsole && <ConsolePanel logs={logs} onClose={() => setShowConsole(false)} />}
          </div>
          <PropertiesPanel selectedLayer={selectedLayer} onUpdateLayer={handleUpdateLayer} isMobile={false} />
        </div>
      )}

      {/* Add Code Modal */}
      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        pythonCode={pythonCode}
        javascriptCode={javascriptCode}
      />

      {/* Add Improvement Guide Modal */}
      <ModelImprovementGuide
        isOpen={showImprovementGuide}
        onClose={() => setShowImprovementGuide(false)}
        modelConfig={modelConfig}
      />
    </div>
  )
}

