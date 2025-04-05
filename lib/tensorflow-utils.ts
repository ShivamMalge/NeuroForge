"use client"

import * as tf from "@tensorflow/tfjs"

export async function loadTensorflowJS() {
  await tf.ready()
  return tf
}

export function buildTensorflowModel(layerConfigs: any[], modelConfig: any) {
  const model = tf.sequential()

  const inputLayer = layerConfigs.find((layer) => layer.type === "input")
  const inputShape = inputLayer?.params?.shape

  if (!inputShape) {
    throw new Error("Model must have an input layer with a defined shape")
  }

  let hasAddedLayer = false

  layerConfigs.forEach((layerConfig) => {
    let layer

    if (layerConfig.type === "input") return

    const isFirstLayer = !hasAddedLayer

    // 🛠 Reshape input for LSTM if necessary
    if (
      isFirstLayer &&
      layerConfig.type === "lstm" &&
      inputShape.length === 3 // e.g., [28, 28, 1]
    ) {
      const [h, w, c] = inputShape
      const timeSteps = h
      const features = w * (c || 1)

      model.add(
        tf.layers.reshape({
          targetShape: [timeSteps, features],
          inputShape: inputShape,
        })
      )
      hasAddedLayer = true
    }

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

  if (!hasAddedLayer) {
    throw new Error("Model must have at least one layer besides the input layer")
  }

  const lastLayer = layerConfigs[layerConfigs.length - 1]
  const isClassification = modelConfig.loss.includes("Crossentropy")

  if (
    isClassification &&
    (lastLayer.type !== "dense" ||
      (modelConfig.dataset === "mnist" && lastLayer.params.units !== 10) ||
      (modelConfig.dataset === "xor" && lastLayer.params.units !== 1))
  ) {
    if (modelConfig.dataset === "mnist") {
      model.add(
        tf.layers.dense({
          units: 10,
          activation: "softmax",
          name: "output_layer",
        })
      )
    } else if (modelConfig.dataset === "xor") {
      model.add(
        tf.layers.dense({
          units: 1,
          activation: "sigmoid",
          name: "output_layer",
        })
      )
    }
  }

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
  await model.fit(trainData.xs, trainData.ys, {
    epochs: modelConfig.epochs,
    batchSize: modelConfig.batchSize,
    validationData: [testData.xs, testData.ys],
    callbacks: {
      onEpochEnd,
    },
  })

  return model
}

export function getXORData() {
  const xTrain = tf.tensor2d([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ])
  const yTrain = tf.tensor2d([[0], [1], [1], [0]])

  const xTest = xTrain
  const yTest = yTrain

  return { xTrain, yTrain, xTest, yTest }
}

export async function getMNISTData() {
  try {
    return generateMockMNISTData()
  } catch (error) {
    console.error("Error loading MNIST dataset:", error)
    return generateMockMNISTData()
  }
}

function generateMockMNISTData() {
  const numTrainSamples = 100
  const numTestSamples = 20
  const numClasses = 10

  const flatXTrainData = new Float32Array(numTrainSamples * 28 * 28 * 1)
  const flatXTestData = new Float32Array(numTestSamples * 28 * 28 * 1)

  for (let i = 0; i < flatXTrainData.length; i++) {
    flatXTrainData[i] = Math.random()
  }

  for (let i = 0; i < flatXTestData.length; i++) {
    flatXTestData[i] = Math.random()
  }

  const yTrainData = new Float32Array(numTrainSamples * numClasses)
  const yTestData = new Float32Array(numTestSamples * numClasses)

  for (let i = 0; i < numTrainSamples; i++) {
    const label = Math.floor(Math.random() * numClasses)
    yTrainData[i * numClasses + label] = 1
  }

  for (let i = 0; i < numTestSamples; i++) {
    const label = Math.floor(Math.random() * numClasses)
    yTestData[i * numClasses + label] = 1
  }

  const xTrain = tf.tensor4d(flatXTrainData, [numTrainSamples, 28, 28, 1])
  const yTrain = tf.tensor2d(yTrainData, [numTrainSamples, numClasses])
  const xTest = tf.tensor4d(flatXTestData, [numTestSamples, 28, 28, 1])
  const yTest = tf.tensor2d(yTestData, [numTestSamples, numClasses])

  return { xTrain, yTrain, xTest, yTest }
}
