# 🧠 NeuroForge

**NeuroForge** is a powerful, intuitive, and modern drag-and-drop platform to design, train, and export neural networks—all in your browser. Built with cutting-edge web technologies, it brings the full power of machine learning and neural network visualization to users with no need for backend services.

> 🚀 Visual. Interactive. Intelligent. Open-source.

---

## 🌐 Live Demo

👉 [Try it out now](https://neuro-forge.vercel.app/)

---

## 📦 Tech Stack

| Layer              | Technology                     |
|--------------------|---------------------------------|
| Frontend           | Next.js, React, TypeScript      |
| ML Engine          | TensorFlow.js                   |
| UI Styling         | Tailwind CSS, shadcn/ui         |
| Animation          | Framer Motion                   |
| Graph Visualization| ReactFlow                       |
| Charting           | Recharts                        |
| Icons              | Lucide React                    |
| Tooling            | ESLint, Prettier                |

---

## 🔧 Core Features

### ⚙️ Drag-and-Drop Model Builder
- Visual interface to build neural networks
- Supports core, convolutional, and recurrent layers
- Layer types: Input, Dense, Dropout, Conv2D, MaxPooling2D, Flatten, LSTM, Activation

### 🧩 Layer Configuration Panel
- Dynamic UI for setting layer-specific parameters
- Mobile-responsive layout
- Smart validation for layer compatibility

### 📊 Real-Time Training
- In-browser training using TensorFlow.js
- Live metrics for accuracy and loss
- Supports MNIST and XOR datasets

### 📈 Training Visualization
- Real-time charts using Recharts
- Displays training/validation accuracy & loss
- Responsive and interactive

### 🧠 Code Generator
- Export trained models as:
  - Python (TensorFlow/Keras)
  - JavaScript (TensorFlow.js)
- One-click copy & download

### 💡 AI-Powered Suggestions
- Automatic tips for:
  - Model architecture improvements
  - Hyperparameter tuning
  - Regularization techniques

### 🧾 Live Console Panel
- Timestamped training logs
- Real-time error and success messages
- Auto-scroll and log filtering

---

## 🗺 Architecture Overview

### 🧭 Data Flow

1. **User Interaction** → UI event triggers callback  
2. **State Update** → ModelBuilder.tsx updates core state  
3. **Re-render** → Components reflect new data  
4. **Training** → TensorFlow.js runs training loop  
5. **Metrics Callback** → UI updated in real-time  
6. **Visualization** → Charts + logs reflect new progress

### 🔑 Key State Objects

- `layers`: Layer configurations  
- `selectedLayer`: Layer being edited  
- `modelConfig`: Training settings  
- `trainingMetrics`: Accuracy/loss values  
- `logs`: Live console messages  
- `model`: TensorFlow.js model instance  

---

## 🚨 Challenges & Solutions

| Challenge                     | Solution |
|------------------------------|----------|
| In-browser training perf.    | Async TF.js ops with UI syncing |
| Visualizing complex models   | Simplified layer cards + mobile layouts |
| TensorFlow compatibility     | Feature detection + fallback support |
| State complexity             | Centralized state in ModelBuilder.tsx |

---

## 🔮 Advanced Capabilities

- ✅ **Intelligent Layer Validation**
- ✅ **Dataset-Adaptive Training**
- ✅ **Progressive Enhancement**
- ✅ **Dynamic Code Rendering**
- ✅ **Custom Mobile Navigation**

---

## 🛠️ Installation

```bash
git clone https://github.com/your-username/neuroforge.git
cd neuroforge
npm install
npm run dev
```



## 👥 Contributors

Made with ❤️ by **Shivam Malge**  
Want to contribute? PRs are welcome!

---

## 📜 License

**MIT License** — feel free to use, modify, and share 🌐

---

## 🤖 Future Plans

- ✅ Support for more datasets (CIFAR-10, IMDB)  
- ✅ Export to ONNX  
- ✅ Training history downloads  
- ✅ Real-time collaboration (multi-user)
