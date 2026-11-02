# ParseMind 🧠⚡

> Transform raw study notes, lecture transcripts, and textbook excerpts into structured, high-yield learning materials with strict schema-enforced AI.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4.svg?logo=google&logoColor=white)](https://aistudio.google.com/)

---

## 🌟 Key Features

* **Strict AI Output Enforcement**: Backed by Pydantic and LLM constrained decoding (Gemini Structured Outputs), guaranteeing 100% schema-compliant JSON every generation.
* **Executive Summary & Key Takeaways**: 2–3 sentence high-level synthesis with prioritized bullet points and core topic breakdowns.
* **Interactive Quiz Runner**: Multiple choice testing with 4 plausible options, instant pedagogical feedback, explanations, score calculations, and confetti celebrations.
* **3D Flip Flashcards**: Active recall study cards with realistic 3D flipping, category pill filtering, and mastery tracking.
* **ELI5 & Deep Dives**: Difficult jargon simplified with real-world analogies and a live searchable technical glossary.
* **Kinetic Typography (21st.dev)**: Staggered letter-by-letter hover animations built with Tailwind CSS.
* **Dual Ingestion Engine**: Paste raw text or upload `.pdf`, `.txt`, and `.md` files parsed in-memory.

---

## 🏗️ Architecture & Project Structure

```text
parsemind/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routes (/api/study/generate-from-text, etc.)
│   │   ├── core/         # Pydantic Settings & CORS configuration
│   │   ├── schemas/      # Strict Pydantic contracts (AI schema single source of truth)
│   │   ├── services/     # AI Orchestration (Gemini / OpenAI) & In-memory PDF parser
│   │   └── main.py       # ASGI app entrypoint, middleware, and healthchecks
│   ├── .env.example      # Environment template
│   └── requirements.txt  # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/   # SummaryView, QuizView, FlashcardView, ExplanationsView
    │   ├── components/ui/# 21st.dev kinetic FlipLinks
    │   ├── services/     # API fetch layer
    │   ├── types/        # TypeScript contracts mirroring backend schema
    │   └── App.tsx       # State orchestrator & layout
    └── tailwind.config.js
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* **Python 3.10+**
* **Node.js 18+**

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```
Add your `GEMINI_API_KEY` in `backend/.env` (or use built-in demo mode without a key).

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Deployment Plan

* **Frontend**: Host on **Netlify** with `base directory: frontend`, `build command: npm run build`, and `publish directory: dist`.
* **Backend**: Host on **Render** or **Railway** pointing to the `backend` directory with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

---

## 📄 License
MIT License. Built for students and lifelong learners.
