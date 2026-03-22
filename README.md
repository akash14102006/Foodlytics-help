<p align="center">
  <img src="https://github.com/akash14102006/Foodlytics-help/blob/main/foodlytics_banner.png?raw=true" alt="Foodlytics Banner" width="100%">
</p>

<h1 align="center">🥗 Foodlytics AI</h1>

<p align="center">
  <strong>The Future of Intelligent Nutrition Tracking & Analysis</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Production_Ready-10/10-success?style=for-the-badge" alt="Status">
</p>

---

### 🌟 Overview

**Foodlytics AI** is a high-performance, aesthetically stunning nutrition platform designed for the modern era. Using state-of-the-art AI, it transforms a simple photo of your meal into a comprehensive health report, tracking calories, macros, and health risks in real-time.

> [!IMPORTANT]
> **Privacy First:** This version uses "No-Auth" persistence. Your personal health data never leaves your browser's local storage while still providing a professional-grade experience.

---

### ✨ Core Features

| Feature | Description |
| :--- | :--- |
| **📸 AI Vision** | Instant food identification from photos with Canvas-based image compression. |
| **⚡ Real-time Macros** | Accurate calorie, protein, carb, and fat breakdown powered by Gemini & Nutritionix. |
| **🔐 Secure Persistence** | Complete daily tracking saved locally without needing complex database accounts. |
| **🛡️ Smart Rate Limiting** | Enterprise-grade API protection via SlowAPI to prevent quota exhaustion. |
| **💧 Glassmorphism UI** | A premium, interactive design language built with Framer Motion and Lucide icons. |

---

### 🚀 Quick Start

#### 💻 Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Gemini API Key** (for backend)

#### 1️⃣ Clone the Repo
```bash
git clone https://github.com/akash14102006/Foodlytics-help.git
cd Foodlytics-help
```

#### 2️⃣ Backend Setup (FastAPI)
```bash
cd backend-api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### 3️⃣ Frontend Setup (Vite / React)
```bash
cd ../frontend-web
npm install
npm run dev
```

---

### 🎨 Tech Stack

<details>
<summary><b>Frontend Ecosystem</b></summary>

- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **Icons:** Lucide React
- **State:** Zustand
- **Storage:** LocalStorage (Persistence)
</details>

<details>
<summary><b>Backend Ecosystem</b></summary>

- **API Engine:** FastAPI (High Performance)
- **AI Integration:** Google Gemini (Vision/NLP)
- **Security:** SlowAPI (Rate Limiting)
- **Vision:** PIL + Canvas API (Client-side)
</details>

---

### 📂 Project Structure

```text
Foodlytics-help/
├── 📂 backend-api/          # FastAPI Engine
│   ├── main.py              # Entry Point
│   ├── food_classifier.py   # AI Logic
│   └── rate_limiter.py      # Protection Layer
├── 📂 frontend-web/         # React Application
│   ├── 📂 src/
│   │   ├── 📂 api/          # Client-side persistence
│   │   ├── 📂 pages/        # Premium UI Pages
│   │   └── 📂 components/   # Modular Layouts
│   └── package.json         # Build config
└── README.md
```

---

### 🗺️ Roadmap

- [x] **v1.0** - AI Image Analysis & Calorie Tracking.
- [x] **v1.1** - Performance-optimized image compression.
- [ ] **v2.0** - Advanced data visualization (Charts.js expansion).
- [ ] **v2.1** - Export health reports to PDF/CSV.

---

### 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

### 📜 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

### 👥 Authors

- **Akash M** - Main Developer & AI Integration ([@akash14102006](https://github.com/akash14102006))
- **Buvanraj V** - Core System Architecture & Design

**Project Link:** [Foodlytics AI](https://github.com/akash14102006/Foodlytics-help)
