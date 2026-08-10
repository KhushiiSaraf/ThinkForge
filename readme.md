# ThinkForge — AI Research Note Editor

> A full-stack AI-powered note editor that brings the entire web into your writing space. Generate content, search the web, collaborate in real-time, and chat with your PDFs — all in one place.


## 🚀 Live Demo

🌐 **[thinkforge-beta.vercel.app](https://thinkforge-beta.vercel.app)**

📹 **[Watch Demo Video](https://youtu.be/WfJXGg56x48?si=6HWYS28B-gM2Eoxx)** 

---

## ✨ Features

### Free Plan
- 📝 Unlimited notes with rich text editor (TipTap)
- 🤖 AI content generation (Gemini)
- ✏️ AI rewrite selected text with custom instructions
- 🔍 In-editor web search panel
- 📊 AI-generated flowchart diagrams (Mermaid)
- 📄 Export notes as PDF

### Pro Plan (₹99/month)
- 🔗 Share notes with collaborators
- 📚 PDF Upload + RAG — ask AI questions about your uploaded PDFs

---

## 🧪 Testing the App

### Test Account
Login with this email and password  
Email: josh@gmail.com  
Password: josh1234

### Test Payment (Upgrade to Pro)
**Option 1 — Test Card:**
- Card Number: `4100 2800 0000 1007`
- Expiry: any future date (e.g. 12/26)
- CVV: any 3 digits
- OTP: check your phone

**Option 2 — Netbanking:**
1. Select Netbanking → choose any bank
2. On the test page click "Success"

> ℹ️ Payments are in **test mode** — no real money is charged.

### Test OTP Email
> OTP emails may land in your spam folder. Please check spam if you don't see it in your inbox within a minute.

---

## 🛠️ Tech Stack

### Frontend
- React JS (Vite)
- TipTap — rich text editor
- Tailwind CSS
- Framer Motion
- Socket.io Client
- html2pdf.js

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- Socket.io
- BullMQ + Redis (Upstash)
- JWT + HTTP-only Cookies

### APIs & Services
- **Gemini 2.5 Flash** — AI generation, rewrite, diagram, embeddings
- **Serper.dev** — web search
- **Qdrant Cloud** — vector database for PDF RAG
- **Razorpay** — payment gateway (test mode)
- **Brevo REST API** — transactional email (OTP)
- **LangChain** — RAG pipeline (chunking, embedding, retrieval)

### Hosting
- **Vercel** — frontend
- **Render** — backend (Express + BullMQ worker)

## ⚙️ Background Processing

PDF processing is handled asynchronously using **BullMQ + Redis**. When a PDF is uploaded, the processing job is added to a queue and handled by a BullMQ worker running alongside the Express server.

For deployment, the worker runs within the same Render Web Service rather than as a separate Background Worker, keeping the application compatible with Render's free-tier deployment.


---

## 📁 Project Structure
```text
thinkforge/
├── frontend/
│   └── src/
│       ├── pages/
│       ├── features/
│       │   ├── auth/
│       │   │   ├── components/
│       │   │   ├── hooks/
│       │   │   ├── pages/
│       │   │   └── services/
│       │   └── notes/
│       │       ├── components/
│       │       ├── hooks/
│       │       ├── pages/
│       │       ├── services/
│       │       ├── styles/
│       │       └── utils/
│       └── components/
└── backend/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── queues/
        ├── routes/
        ├── services/
        ├── socket.js
        ├── socket.emitter.js
        └── workers/
```

---

## 🔑 Environment Variables

### Backend

```text
PORT
MONGO_URI
JWT_SECRET
FRONTEND_URL
GEMINI_API_KEY
SERPER_API_KEY
QDRANT_URL
QDRANT_API_KEY
REDIS_URL
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
BREVO_API_KEY
BREVO_FROM_EMAIL
```

### Frontend
```text
VITE_API_URL
VITE_RAZORPAY_KEY_ID
```

---

## 🚦 API Routes
```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
POST /api/auth/send-otp
POST /api/auth/verify-otp

GET /api/notes
POST /api/notes
GET /api/notes/:id
PUT /api/notes/:id
DELETE /api/notes/:id
POST /api/notes/:id/share

POST /api/ai/generate
POST /api/ai/rewrite
POST /api/ai/diagram

POST /api/search

POST /api/payment/create-order
POST /api/payment/verify

POST /api/rag/notes/:noteId/upload
GET /api/rag/notes/:noteId/pdf
POST /api/rag/notes/:noteId/ask
```

---

## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Redis instance (Upstash free tier)
- Qdrant Cloud account
- Gemini API key
- Serper.dev API key
- Razorpay test keys
- Brevo API key

### Backend
```bash
cd backend
npm install
# add your .env file
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# add your .env file
npm run dev
```

---

## 👩‍💻 Author

Built with ❤️ by **Khushi Saraf**

- GitHub: https://github.com/KhushiiSaraf
- LinkedIn: https://www.linkedin.com/in/khushi-saraf-1bab6a242/
---

## 📄 License

This project is for portfolio and educational purposes.