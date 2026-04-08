# GreenCore - Smart Infrastructure Dashboard

A premium React-based dashboard for real-time datacenter sustainability monitoring and optimization, featuring the "Obsidian Gold" design system.

## 🚀 Features

- **ThermalTrace**: 8×8 thermal grid with hotspot detection and prediction
- **IdleHunter**: Server consolidation with real-time idle detection
- **WaterWatch**: Water usage efficiency monitoring and benchmarking
- **CarbonClock**: Carbon-aware job scheduling with 24h intensity forecasting
- **LightSpeed**: Network topology visualization with traffic optimization
- **Overview**: Bento-grid dashboard with unified efficiency metrics

## 🎨 Design System

- **Background**: Deep Navy/Black (#05070A)
- **Cards**: #0F1218 with backdrop blur
- **Accents**: Gold (#FFD700), Neon Teal (#00F2FF)
- **Typography**: Inter/Geist Sans + JetBrains Mono
- **Animations**: Framer Motion with global pulse effects

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + clsx/tailwind-merge
- **Charts**: Recharts + D3.js
- **Animations**: Framer Motion
- **Routing**: React Router
- **API**: Axios (mock backend integration)

## 📦 Installation

```bash
cd datacenter-os/frontend
npm install
```

## 🚀 Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗 Backend Integration

The frontend is designed to work with the FastAPI backend running on `http://localhost:8000`. Start the backend first:

```bash
cd datacenter-os/backend
pip install -r requirements.txt
python main.py
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   └── Topbar.jsx
├── pages/
│   ├── Overview.jsx
│   ├── ThermalTrace.jsx
│   ├── IdleHunter.jsx
│   ├── WaterWatch.jsx
│   ├── CarbonClock.jsx
│   └── LightSpeed.jsx
├── services/
│   └── api.js
├── lib/
│   └── utils.js
├── App.jsx
└── main.jsx
```

## 🎯 Key Features

- **Real-time Updates**: 3-5 second refresh cycles
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Page transitions and interactive elements
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized rendering with React.memo and useMemo

## 🔧 Customization

The design system is fully customizable through Tailwind config. Colors, fonts, and spacing can be adjusted in `tailwind.config.js`.

## 📄 License

This project is part of the GreenCore datacenter optimization suite.