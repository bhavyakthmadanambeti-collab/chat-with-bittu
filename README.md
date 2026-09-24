# ChatGPT-Style Starter

A beginner-friendly full-stack starter with:
- React + TypeScript + Vite frontend
- FastAPI Python backend
- Chat UI
- Conversation history in browser
- Backend `/api/chat` endpoint
- Demo AI mode that works without an API key
- Optional OpenAI-compatible API integration through environment variables

## 1. Run the backend

```bash
cd backend
python -m venv .venv
```

Windows:
```bash
.venv\Scripts\activate
```

macOS/Linux:
```bash
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 2. Run the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 3. Optional real AI model

Copy `backend/.env.example` to `backend/.env` and configure an OpenAI-compatible endpoint:

```env
LLM_MODE=api
LLM_API_KEY=your_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=your_model
```

The starter uses a generic OpenAI-compatible `/chat/completions` request. Check your provider's current API documentation for the exact model and endpoint.

## Project structure

```text
chatgpt-style-starter/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── models.py
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

## Next features to learn/build

1. Streaming responses with Server-Sent Events
2. User authentication
3. PostgreSQL/Supabase conversation storage
4. File/PDF upload
5. RAG and embeddings
6. Web search/tool calling
7. AI agents
8. Production deployment
