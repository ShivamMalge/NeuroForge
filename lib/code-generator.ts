"use client"

import type { Layer, ModelConfig } from "@/lib/types"

// Generate Python code for the model
export function generatePythonCode(layers: Layer[], modelConfig: ModelConfig): string {
  const imports = `import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D, Activation
import numpy as np
import matplotlib.pyplot as plt
`

  // Generate model creation code
  let modelCode = `
# Create a Sequential model
model = Sequential()
`

  // Add layers
  layers.forEach((layer, index) => {
    switch (layer.type) {
      case "input":
        // Input layer is handled implicitly in the first layer
        break
      case "dense":
        if (index === 1 && layers[0].type === "input") {
          // First layer after input needs input_shape
          modelCode += `
# Dense layer with input shape
model.add(Dense(${layer.params.units}, activation='${layer.params.activation}', input_shape=${JSON.stringify(layers[0].params.shape).replace(/\[/g, "(").replace(/\]/g, ")")}))
`
        } else {
          modelCode += `
# Dense layer
model.add(Dense(${layer.params.units}, activation='${layer.params.activation}'))
`
        }
        break
      case "dropout":
        modelCode += `
# Dropout layer
model.add(Dropout(${layer.params.rate}))
`
        break
      case "conv2d":
        if (index === 1 && layers[0].type === "input") {
          // First layer after input needs input_shape
          modelCode += `
# Conv2D layer with input shape
model.add(Conv2D(${layer.params.filters}, ${JSON.stringify(layer.params.kernelSize).replace(/\[/g, "(").replace(/\]/g, ")")}, 
        activation='${layer.params.activation}', 
        padding='${layer.params.padding}', 
        input_shape=${JSON.stringify(layers[0].params.shape).replace(/\[/g, "(").replace(/\]/g, ")")}))
`
        } else {
          modelCode += `
# Conv2D layer
model.add(Conv2D(${layer.params.filters}, ${JSON.stringify(layer.params.kernelSize).replace(/\[/g, "(").replace(/\]/g, ")")}, 
        activation='${layer.params.activation}', 
        padding='${layer.params.padding}'))
`
        }
        break
      case "maxpooling2d":
        modelCode += `
# MaxPooling2D layer
model.add(MaxPooling2D(pool_size=${JSON.stringify(layer.params.poolSize).replace(/\[/g, "(").replace(/\]/g, ")")}))
`
        break
      case "flatten":
        modelCode += `
# Flatten layer
model.add(Flatten())
`
        break
      case "lstm":
        if (index === 1 && layers[0].type === "input") {
          // First layer after input needs input_shape
          modelCode += `
# LSTM layer with input shape
model.add(tf.keras.layers.LSTM(${layer.params.units}, return_sequences=${layer.params.returnSequences ? "True" : "False"}, input_shape=${JSON.stringify(
            layers[0].params.shape,
          )
            .replace(/\[/g, "(")
            .replace(/\]/g, ")")}))
`
        } else {
          modelCode += `
# LSTM layer
model.add(tf.keras.layers.LSTM(${layer.params.units}, return_sequences=${layer.params.returnSequences ? "True" : "False"}))
`
        }
        break
      case "activation":
        modelCode += `
# Activation layer
model.add(Activation('${layer.params.activation}'))
`
        break
    }
  })

  // Convert loss function name to TensorFlow format
  const tfLoss = modelConfig.loss
    .replace("categoricalCrossentropy", "categorical_crossentropy")
    .replace("binaryCrossentropy", "binary_crossentropy")
    .replace("meanSquaredError", "mean_squared_error")

  // Compile the model
  modelCode += `
# Compile the model
model.compile(
  optimizer='${modelConfig.optimizer}',
  loss='${tfLoss}',
  metrics=['accuracy']
)

# Print model summary
model.summary()
`

  // Add training code based on the dataset
  if (modelConfig.dataset === "mnist") {
    modelCode += `
# Load MNIST dataset
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

# Preprocess the data
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

# Reshape data to match the input shape
x_train = x_train.reshape(-1, 28, 28, 1)
x_test = x_test.reshape(-1, 28, 28, 1)

# Apply standardization for better performance
def standardize_batch(images):
  # Standardize per image
  mean = np.mean(images, axis=(1, 2, 3), keepdims=True)
  std = np.std(images, axis=(1, 2, 3), keepdims=True)
  return (images - mean) / (std + 1e-7)

x_train = standardize_batch(x_train)
x_test = standardize_batch(x_test)

# Convert labels to categorical
y_train = tf.keras.utils.to_categorical(y_train, 10)
y_test = tf.keras.utils.to_categorical(y_test, 10)

# Create a callback to save the best model
checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
  'best_mnist_model.h5',
  monitor='val_accuracy',
  save_best_only=True,
  mode='max',
  verbose=1
)

# Early stopping to prevent overfitting
early_stopping = tf.keras.callbacks.EarlyStopping(
  monitor='val_loss',
  patience=5,
  restore_best_weights=True
)

# Train the model
history = model.fit(
  x_train, y_train,
  batch_size=${modelConfig.batchSize},
  epochs=${modelConfig.epochs},
  validation_split=0.1,
  callbacks=[checkpoint_callback, early_stopping]
)

# Evaluate the model
test_loss, test_acc = model.evaluate(x_test, y_test, verbose=2)
print(f'Test accuracy: {test_acc:.4f}')

# Plot training history
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.tight_layout()
plt.show()

# Save the model
model.save('mnist_model.h5')

# Make predictions on a few test samples
predictions = model.predict(x_test[:5])
predicted_classes = np.argmax(predictions, axis=1)
true_classes = np.argmax(y_test[:5], axis=1)

print("Predictions for 5 test samples:")
for i in range(5):
  print(f"Sample {i+1}: True label = {true_classes[i]}, Predicted = {predicted_classes[i]}")
`
  } else if (modelConfig.dataset === "xor") {
    modelCode += `
# Create XOR dataset
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

# Convert to float32 for better performance
X = X.astype('float32')
y = y.astype('float32')

# Train the model
history = model.fit(
  X, y,
  batch_size=${modelConfig.batchSize},
  epochs=${modelConfig.epochs},
  validation_split=0.2,
  verbose=1
)

# Plot training history
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
if 'val_accuracy' in history.history:
  plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
if 'val_loss' in history.history:
  plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.tight_layout()
plt.show()

# Evaluate the model
predictions = model.predict(X)
print("Predictions:")
for i, pred in enumerate(predictions):
  print(f"Input: {X[i]}, Prediction: {pred[0]:.4f}, Actual: {y[i][0]}")

# Save the model
model.save('xor_model.h5')

# Visualize decision boundary (for XOR)
if X.shape[1] == 2:  # Only for 2D inputs
  h = 0.01
  x_min, x_max = -0.1, 1.1
  y_min, y_max = -0.1, 1.1
  xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
  Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
  Z = Z.reshape(xx.shape)
  
  plt.figure(figsize=(8, 6))
  plt.contourf(xx, yy, Z, cmap=plt.cm.RdBu, alpha=0.8)
  plt.scatter(X[:, 0], X[:, 1], c=y.reshape(-1), cmap=plt.cm.RdBu, edgecolors='k')
  plt.xlim(xx.min(), xx.max())
  plt.ylim(yy.min(), yy.max())
  plt.xlabel('X1')
  plt.ylabel('X2')
  plt.title('XOR Decision Boundary')
  plt.colorbar()
  plt.show()
`
  }

  return imports + modelCode
}

// Generate TensorFlow.js code for the model
export function generateTensorflowJSCode(layers: Layer[], modelConfig: ModelConfig): string {
  const imports = `// TensorFlow.js Model
import * as tf from '@tensorflow/tfjs';

// Create a sequential model
const model = tf.sequential();
`

  // Generate model creation code
  let modelCode = ""

  // Add layers
  layers.forEach((layer, index) => {
    switch (layer.type) {
      case "input":
        // Input layer is handled implicitly in the first layer
        break
      case "dense":
        if (index === 1 && layers[0].type === "input") {
          // First layer after input needs inputShape
          modelCode += `
// Dense layer with input shape
model.add(tf.layers.dense({
  units: ${layer.params.units},
  activation: '${layer.params.activation}',
  inputShape: ${JSON.stringify(layers[0].params.shape)}
}));
`
        } else {
          modelCode += `
// Dense layer
model.add(tf.layers.dense({
  units: ${layer.params.units},
  activation: '${layer.params.activation}'
}));
`
        }
        break
      case "dropout":
        modelCode += `
// Dropout layer
model.add(tf.layers.dropout({
  rate: ${layer.params.rate}
}));
`
        break
      case "conv2d":
        if (index === 1 && layers[0].type === "input") {
          // First layer after input needs inputShape
          modelCode += `
// Conv2D layer with input shape
model.add(tf.layers.conv2d({
  filters: ${layer.params.filters},
  kernelSize: ${JSON.stringify(layer.params.kernelSize)},
  activation: '${layer.params.activation}',
  padding: '${layer.params.padding}',
  inputShape: ${JSON.stringify(layers[0].params.shape)}
}));
`
        } else {
          modelCode += `
// Conv2D layer
model.add(tf.layers.conv2d({
  filters: ${layer.params.filters},
  kernelSize: ${JSON.stringify(layer.params.kernelSize)},
  activation: '${layer.params.activation}',
  padding: '${layer.params.padding}'
}));
`
        }
        break
      case "maxpooling2d":
        modelCode += `
// MaxPooling2D layer
model.add(tf.layers.maxPooling2d({
  poolSize: ${JSON.stringify(layer.params.poolSize)}
}));
`
        break
      case "flatten":
        modelCode += `
// Flatten layer
model.add(tf.layers.flatten());
`
        break
      case "lstm":
        if (index === 1 && layers[0].type === "input") {
          // First layer after input needs inputShape
          modelCode += `
// LSTM layer with input shape
model.add(tf.layers.lstm({
  units: ${layer.params.units},
  returnSequences: ${layer.params.returnSequences},
  inputShape: ${JSON.stringify(layers[0].params.shape)}
}));
`
        } else {
          modelCode += `
// LSTM layer
model.add(tf.layers.lstm({
  units: ${layer.params.units},
  returnSequences: ${layer.params.returnSequences}
}));
`
        }
        break
      case "activation":
        modelCode += `
// Activation layer
model.add(tf.layers.activation({
  activation: '${layer.params.activation}'
}));
`
        break
    }
  })

  // Convert loss function name to TensorFlow.js format
  const tfLoss = modelConfig.loss
    .replace("categoricalCrossentropy", "categoricalCrossentropy")
    .replace("binaryCrossentropy", "binaryCrossentropy")
    .replace("meanSquaredError", "meanSquaredError")

  // Compile the model
  modelCode += `
// Compile the model
model.compile({
  optimizer: '${modelConfig.optimizer}',
  loss: '${tfLoss}',
  metrics: ['accuracy']
});

// Print model summary
model.summary();
`

  // Add training code based on the dataset
  if (modelConfig.dataset === "mnist") {
    modelCode += `
// Load and train with MNIST data
async function trainModel() {
  // Display status
  const statusElement = document.getElementById('status');
  if (statusElement) statusElement.textContent = 'Loading MNIST data...';

  try {
    // Load MNIST data - using proper loading method
    const [trainXs, trainYs, testXs, testYs] = await loadMnistData();
    
    if (statusElement) statusElement.textContent = 'Training model...';
    
    // Define callbacks
    const callbacks = {
      onEpochEnd: (epoch, logs) => {
        console.log(\`Epoch \${epoch+1}: loss=\${logs.loss.toFixed(4)}, acc=\${logs.acc.toFixed(4)}\`);
        if (statusElement) {
          statusElement.textContent = \`Epoch \${epoch+1}: accuracy=\${logs.acc.toFixed(4)}\`;
        }
      }
    };
    
    // Train the model
    const history = await model.fit(trainXs, trainYs, {
      batchSize: ${modelConfig.batchSize},
      epochs: ${modelConfig.epochs},
      validationData: [testXs, testYs],
      callbacks: callbacks
    });
    
    // Evaluate the model
    if (statusElement) statusElement.textContent = 'Evaluating model...';
    
    const evalResult = await model.evaluate(testXs, testYs);
    // Properly extract values from tensors
    const testLoss = evalResult[0].dataSync()[0];
    const testAcc = evalResult[1].dataSync()[0];
    
    console.log(\`Test loss: \${testLoss.toFixed(4)}\`);
    console.log(\`Test accuracy: \${testAcc.toFixed(4)}\`);
    
    if (statusElement) {
      statusElement.textContent = \`Test accuracy: \${testAcc.toFixed(4)}\`;
    }
    
    // Save the model
    if (statusElement) statusElement.textContent = 'Saving model...';
    await model.save('downloads://mnist_model');
    
    if (statusElement) statusElement.textContent = 'Model saved!';
    
    // Clean up tensors
    trainXs.dispose();
    trainYs.dispose();
    testXs.dispose();
    testYs.dispose();
    
    return { testLoss, testAcc };
  } catch (error) {
    console.error('Error during training:', error);
    if (statusElement) statusElement.textContent = \`Error: \${error.message}\`;
    throw error;
  }
}

// Helper function to load MNIST data
async function loadMnistData() {
  // In a browser environment, we would typically load from a CDN or server
  // For this example, we'll use a simplified approach

  // Load the MNIST data
  const mnistImages = await fetch('https://storage.googleapis.com/tfjs-tutorials/mnist_images.png');
  const mnistLabels = await fetch('https://storage.googleapis.com/tfjs-tutorials/mnist_labels_uint8');

  // If the fetch fails, provide a fallback
  if (!mnistImages.ok || !mnistLabels.ok) {
    console.warn('Could not load MNIST data from URLs, using synthetic data instead');
    return createSyntheticMnistData();
  }

  // Process the data
  const imagesBuffer = await mnistImages.arrayBuffer();
  const labelsBuffer = await mnistLabels.arrayBuffer();

  // Convert to tensors
  const xs = tf.tidy(() => {
    const img = tf.node
      ? tf.node.decodeImage(new Uint8Array(imagesBuffer))
      : tf.browser.fromPixels(await createImageBitmap(new Blob([imagesBuffer])));
    
    // Reshape and normalize
    const numExamples = img.shape[0];
    const imgWidth = img.shape[1];
    const imgHeight = img.shape[2];
    
    return img
      .reshape([numExamples, imgWidth, imgHeight, 1])
      .toFloat()
      .div(255.0);
  });

  const labels = tf.tidy(() => {
    const labelsArray = new Uint8Array(labelsBuffer);
    return tf.oneHot(tf.tensor1d(Array.from(labelsArray), 'int32'), 10);
  });

  // Split into training and test sets
  const numExamples = xs.shape[0];
  const numTrainExamples = Math.floor(numExamples * 0.8);

  const trainXs = xs.slice([0, 0, 0, 0], [numTrainExamples, xs.shape[1], xs.shape[2], 1]);
  const testXs = xs.slice([numTrainExamples, 0, 0, 0]);

  const trainYs = labels.slice([0, 0], [numTrainExamples, labels.shape[1]]);
  const testYs = labels.slice([numTrainExamples, 0]);

  // Dispose original tensors
  xs.dispose();
  labels.dispose();

  return [trainXs, trainYs, testXs, testYs];
}

// Create synthetic MNIST data for testing when real data isn't available
function createSyntheticMnistData() {
  return tf.tidy(() => {
    // Create synthetic training data
    const trainSize = 1000;
    const testSize = 200;
    
    // Create random images (28x28x1)
    const trainXs = tf.randomUniform([trainSize, 28, 28, 1]);
    const testXs = tf.randomUniform([testSize, 28, 28, 1]);
    
    // Create random one-hot labels (10 classes)
    const trainLabels = tf.floor(tf.randomUniform([trainSize], 0, 10)).cast('int32');
    const testLabels = tf.floor(tf.randomUniform([testSize], 0, 10)).cast('int32');
    
    const trainYs = tf.oneHot(trainLabels, 10);
    const testYs = tf.oneHot(testLabels, 10);
    
    // Dispose temporary tensors
    trainLabels.dispose();
    testLabels.dispose();
    
    return [trainXs, trainYs, testXs, testYs];
  });
}

// Create a status element in the DOM
function createStatusElement() {
  if (!document.getElementById('status')) {
    const statusElement = document.createElement('div');
    statusElement.id = 'status';
    statusElement.style.padding = '10px';
    statusElement.style.marginTop = '20px';
    statusElement.style.backgroundColor = '#f0f0f0';
    statusElement.style.borderRadius = '5px';
    statusElement.textContent = 'Ready to train model';
    document.body.appendChild(statusElement);
  }
}

// Initialize the page
async function init() {
  createStatusElement();

  // Add a button to start training
  const trainButton = document.createElement('button');
  trainButton.textContent = 'Train Model';
  trainButton.style.padding = '10px 20px';
  trainButton.style.margin = '10px 0';
  trainButton.style.backgroundColor = '#4CAF50';
  trainButton.style.color = 'white';
  trainButton.style.border = 'none';
  trainButton.style.borderRadius = '5px';
  trainButton.style.cursor = 'pointer';

  trainButton.onclick = () => {
    trainButton.disabled = true;
    trainButton.textContent = 'Training...';
    
    trainModel()
      .then(() => {
        trainButton.textContent = 'Training Complete!';
      })
      .catch(err => {
        console.error(err);
        trainButton.textContent = 'Training Failed';
      })
      .finally(() => {
        trainButton.disabled = false;
      });
  };

  document.body.insertBefore(trainButton, document.getElementById('status'));
}

// Call the initialization function
init();
`
  } else if (modelConfig.dataset === "xor") {
    modelCode += `
// XOR data
const xorData = {
  xs: tf.tensor2d([[0, 0], [0, 1], [1, 0], [1, 1]]),
  ys: tf.tensor2d([[0], [1], [1], [0]])
};

// Train the model
async function trainModel() {
  // Create a status element
  const statusElement = document.getElementById('status');
  if (statusElement) statusElement.textContent = 'Training model...';

  try {
    // Define callbacks
    const callbacks = {
      onEpochEnd: (epoch, logs) => {
        console.log(\`Epoch \${epoch+1}: loss=\${logs.loss.toFixed(4)}, acc=\${logs.acc.toFixed(4)}\`);
        if (statusElement) {
          statusElement.textContent = \`Epoch \${epoch+1}: accuracy=\${logs.acc.toFixed(4)}\`;
        }
      }
    };
    
    // Train the model
    const history = await model.fit(xorData.xs, xorData.ys, {
      batchSize: ${modelConfig.batchSize},
      epochs: ${modelConfig.epochs},
      callbacks: callbacks
    });
    
    // Test the model
    const predictions = model.predict(xorData.xs);
    
    // Convert predictions to array for display
    const predictionValues = await predictions.arraySync();
    
    // Display results
    console.log('XOR Predictions:');
    const inputs = await xorData.xs.arraySync();
    const targets = await xorData.ys.arraySync();
    
    for (let i = 0; i < inputs.length; i++) {
      console.log(\`Input: [\${inputs[i]}], Target: \${targets[i][0]}, Prediction: \${predictionValues[i][0].toFixed(4)}\`);
    }
    
    if (statusElement) {
      statusElement.innerHTML = 'Training complete!<br>Check console for predictions.';
    }
    
    // Save the model
    await model.save('downloads://xor_model');
    
    // Clean up tensors
    predictions.dispose();
    
    // Visualize decision boundary if we're in a browser environment
    if (typeof document !== 'undefined') {
      visualizeDecisionBoundary();
    }
  } catch (error) {
    console.error('Error during training:', error);
    if (statusElement) statusElement.textContent = \`Error: \${error.message}\`;
  }
}

// Visualize the decision boundary for XOR
async function visualizeDecisionBoundary() {
  // Create a canvas for visualization
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  canvas.style.border = '1px solid #ccc';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const resolution = 50;
  const gridSize = canvas.width / resolution;

  // Generate a grid of points
  const xs = tf.tidy(() => {
    const points = [];
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        points.push([i / (resolution - 1), j / (resolution - 1)]);
      }
    }
    return tf.tensor2d(points);
  });

  // Get predictions for the grid
  const preds = model.predict(xs);
  const predsArr = await preds.arraySync();

  // Draw the decision boundary
  let idx = 0;
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const value = predsArr[idx++][0];
      const color = getColorForProbability(value);
      ctx.fillStyle = color;
      ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
  }

  // Draw the training points
  const xorInputs = await xorData.xs.arraySync();
  const xorTargets = await xorData.ys.arraySync();

  for (let i = 0; i < xorInputs.length; i++) {
    const x = xorInputs[i][0] * canvas.width;
    const y = xorInputs[i][1] * canvas.height;
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = xorTargets[i][0] === 1 ? 'green' : 'red';
    ctx.fill();
    ctx.stroke();
  }

  // Clean up tensors
  xs.dispose();
  preds.dispose();
}

// Helper function to get color based on probability
function getColorForProbability(prob) {
  // Red for 0, Green for 1
  const r = Math.floor(255 * (1 - prob));
  const g = Math.floor(255 * prob);
  const b = 100;
  const a = 0.6;
  return \`rgba(\${r}, \${g}, \${b}, \${a})\`;
}

// Create a status element in the DOM
function createStatusElement() {
  if (!document.getElementById('status')) {
    const statusElement = document.createElement('div');
    statusElement.id = 'status';
    statusElement.style.padding = '10px';
    statusElement.style.marginTop = '20px';
    statusElement.style.backgroundColor = '#f0f0f0';
    statusElement.style.borderRadius = '5px';
    statusElement.textContent = 'Ready to train model';
    document.body.appendChild(statusElement);
  }
}

// Initialize the page
function init() {
  createStatusElement();

  // Add a button to start training
  const trainButton = document.createElement('button');
  trainButton.textContent = 'Train XOR Model';
  trainButton.style.padding = '10px 20px';
  trainButton.style.margin = '10px 0';
  trainButton.style.backgroundColor = '#4CAF50';
  trainButton.style.color = 'white';
  trainButton.style.border = 'none';
  trainButton.style.borderRadius = '5px';
  trainButton.style.cursor = 'pointer';

  trainButton.onclick = () => {
    trainButton.disabled = true;
    trainButton.textContent = 'Training...';
    
    trainModel()
      .then(() => {
        trainButton.textContent = 'Training Complete!';
      })
      .catch(err => {
        console.error(err);
        trainButton.textContent = 'Training Failed';
      })
      .finally(() => {
        trainButton.disabled = false;
      });
  };

  document.body.insertBefore(trainButton, document.getElementById('status'));
}

// Call the initialization function
init();
`
  }

  return imports + modelCode
}

