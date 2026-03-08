# Portfolio

Personal portfolio website repository.

## Run Jarvis RAG Chat (Groq)

1. Install dependencies:

```bash
npm install
```

2. Create env file from template:

```bash
cp .env.example .env
```

3. Add your Groq key in `.env`:

```env
GROQ_API_KEY=your_actual_key
PORT=4174
```

4. Start server:

```bash
npm run start
```

The API runs on `http://localhost:4174` (recommended).

If your frontend is served from another local port (for example `4173`), Jarvis will still call the API via fallback.

- Health check: `GET /api/health`
- Chat API: `POST /api/chat` with JSON body `{ "query": "...", "history": [...] }`

## Notes

- Jarvis answers are grounded in portfolio/resume/profile context in `server/knowledge.js`.
- Frontend falls back to local offline responses if the API is unavailable.
