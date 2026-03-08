import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { retrieveContext } from "./knowledge.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
});
app.use(express.static(rootDir));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PORT = Number(process.env.PORT || 4173);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, groqConfigured: Boolean(GROQ_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const query = (req.body?.query || "").toString().trim();
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];

    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is missing. Add it to .env." });
    }

    const contextDocs = retrieveContext(query, 6);
    const context = contextDocs.map((doc, idx) => `[${idx + 1}] ${doc.title}\n${doc.content}`).join("\n\n");

    const systemPrompt = [
      "You are Jarvis, Yash Doshi's portfolio assistant.",
      "Answer in first-person about Yash using only provided context.",
      "If asked 'why should I hire Yash', provide a concise recruiter-style answer with concrete strengths from context.",
      "Do not mention sources, retrieval, or that you are an AI model.",
      "Be direct, specific, and concise.",
    ].join(" ");

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `Context:\n${context}` },
      ...history.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"),
      { role: "user", content: query },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Groq API error: ${errText}` });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return res.status(502).json({ error: "No answer returned by model." });
    }

    return res.json({ answer });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unexpected server error." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Jarvis RAG server running on http://localhost:${PORT}`);
});
