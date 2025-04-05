"use client"

import * as tf from "@tensorflow/tfjs"

export async function loadTensorflowJS() {
  // Make sure TensorFlow.js is loaded
  await tf.ready()
  return tf
}

// Update the buildTensorflowModel function to ensure proper output shape
export function buildTensorflowModel(layerConfigs: any[], modelConfig: any) {
  // Create a sequential model
  const model = tf.sequential()

  // Find the input layer to get its shape
  const inputLayer = layerConfigs.find((layer) => layer.type === "input")
  const inputShape = inputLayer?.params?.shape

  if (!inputShape) {
    throw new Error("Model must have an input layer with a defined shape")
  }

  // Track if we've added at least one layer
  let hasAddedLayer = false

  // Add layers based on the configuration
  layerConfigs.forEach((layerConfig) => {
    let layer

    // Skip the input layer as it's not an actual layer in TensorFlow.js
    if (layerConfig.type === "input") {
      return
    }

    // For the first actual layer, we need to explicitly set the input shape
    const isFirstLayer = !hasAddedLayer

    switch (layerConfig.type) {
      case "dense":
        layer = tf.layers.dense({
          units: layerConfig.params.units,
          activation: layerConfig.params.activation,
          inputShape: isFirstLayer ? inputShape : undefined,
        })
        break

      case "dropout":
        layer = tf.layers.dropout({
          rate: layerConfig.params.rate,
        })
        break

      case "conv2d":
        layer = tf.layers.conv2d({
          filters: layerConfig.params.filters,
          kernelSize: layerConfig.params.kernelSize,
          activation: layerConfig.params.activation,
          padding: layerConfig.params.padding,
          inputShape: isFirstLayer ? inputShape : undefined,
        })
        break

      case "maxpooling2d":
        layer = tf.layers.maxPooling2d({
          poolSize: layerConfig.params.poolSize,
          inputShape: isFirstLayer ? inputShape : undefined,
        })
        break

      case "flatten":
        layer = tf.layers.flatten({
          inputShape: isFirstLayer ? inputShape : undefined,
        })
        break

      case "lstm":
        layer = tf.layers.lstm({
          units: layerConfig.params.units,
          returnSequences: layerConfig.params.returnSequences,
          inputShape: isFirstLayer ? inputShape : undefined,
        })
        break

      case "activation":
        layer = tf.layers.activation({
          activation: layerConfig.params.activation,
          inputShape: isFirstLayer ? inputShape : undefined,
        })
        break
    }

    if (layer) {
      model.add(layer)
      hasAddedLayer = true
    }
  })

  // Make sure we have at least one layer
  if (!hasAddedLayer) {
    throw new Error("Model must have at least one layer besides the input layer")
  }

  // Check if the last layer is appropriate for the task
  const lastLayer = layerConfigs[layerConfigs.length - 1]
  const isClassification = modelConfig.loss.includes("Crossentropy")

  // For classification tasks, the last layer should be a Dense layer with appropriate units
  if (
    isClassification &&
    (lastLayer.type !== "dense" ||
      (modelConfig.dataset === "mnist" && lastLayer.params.units !== 10) ||
      (modelConfig.dataset === "xor" && lastLayer.params.units !== 1))
  ) {
    // Add appropriate output layer based on the dataset
    if (modelConfig.dataset === "mnist") {
      model.add(
        tf.layers.dense({
          units: 10,
          activation: "softmax",
          name: "output_layer",
        }),
      )
    } else if (modelConfig.dataset === "xor") {
      model.add(
        tf.layers.dense({
          units: 1,
          activation: "sigmoid",
          name: "output_layer",
        }),
      )
    }
  }

  // Compile the model
  model.compile({
    optimizer: modelConfig.optimizer,
    loss: modelConfig.loss,
    metrics: modelConfig.metrics,
  })

  return model
}

export async function trainModel(
  model: tf.Sequential,
  trainData: { xs: tf.Tensor; ys: tf.Tensor },
  testData: { xs: tf.Tensor; ys: tf.Tensor },
  modelConfig: any,
  onEpochEnd: (epoch: number, logs: any) => void,
) {
  // Train the model
  await model.fit(trainData.xs, trainData.ys, {
    epochs: modelConfig.epochs,
    batchSize: modelConfig.batchSize,
    validationData: [testData.xs, testData.ys],
    callbacks: {
      onEpochEnd: onEpochEnd,
    },
  })

  return model
}

export function getXORData() {
  // XOR data
  const xTrain = tf.tensor2d([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ])
  const yTrain = tf.tensor2d([[0], [1], [1], [0]])

  // Use the same data for testing in this simple example
  const xTest = xTrain
  const yTest = yTrain

  return { xTrain, yTrain, xTest, yTest }
}

// Generate mock MNIST data for demo purposes
export async function getMNISTData() {
  try {
    // For the demo, we'll just use the mock data
    // In a real app, you would try to load the actual MNIST dataset here
    return generateMockMNISTData()
  } catch (error) {
    console.error("Error loading MNIST dataset:", error)
    // Fallback to mock data
    return generateMockMNISTData()
  }
}

// Generate mock MNIST data for demo purposes
function generateMockMNISTData() {
  // Create small mock dataset
  const numTrainSamples = 100
  const numTestSamples = 20
  const numClasses = 10

  // Create flat arrays for images (simpler approach to avoid tensor4d formatting issues)
  // Each image is 28x28x1 = 784 values
  const flatXTrainData = new Float32Array(numTrainSamples * 28 * 28 * 1)
  const flatXTestData = new Float32Array(numTestSamples * 28 * 28 * 1)

  // Fill with random values between 0 and 1
  for (let i = 0; i < flatXTrainData.length; i++) {
    flatXTrainData[i] = Math.random()
  }

  for (let i = 0; i < flatXTestData.length; i++) {
    flatXTestData[i] = Math.random()
  }

  // Generate random one-hot encoded labels
  const yTrainData = new Float32Array(numTrainSamples * numClasses)
  const yTestData = new Float32Array(numTestSamples * numClasses)

  // Set one-hot encoded values
  for (let i = 0; i < numTrainSamples; i++) {
    const label = Math.floor(Math.random() * numClasses)
    yTrainData[i * numClasses + label] = 1
  }

  for (let i = 0; i < numTestSamples; i++) {
    const label = Math.floor(Math.random() * numClasses)
    yTestData[i * numClasses + label] = 1
  }

  // Create tensors with proper shapes
  const xTrain = tf.tensor4d(flatXTrainData, [numTrainSamples, 28, 28, 1])
  const yTrain = tf.tensor2d(yTrainData, [numTrainSamples, numClasses])
  const xTest = tf.tensor4d(flatXTestData, [numTestSamples, 28, 28, 1])
  const yTest = tf.tensor2d(yTestData, [numTestSamples, numClasses])

  return { xTrain, yTrain, xTest, yTest }
}

