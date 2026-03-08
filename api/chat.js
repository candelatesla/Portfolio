import { retrieveContext } from "../lib/knowledge.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const query = (req.body?.query || "").toString().trim();
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];

    if (!query) return res.status(400).json({ error: "Query is required." });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY missing" });

    const contextDocs = retrieveContext(query, 6);
    const context = contextDocs.map((d, i) => `[${i + 1}] ${d.title}\n${d.content}`).join("\n\n");

    const systemPrompt =
      "You are Jarvis, Yash Doshi's portfolio assistant. " +
      "Answer in first-person about Yash using only provided context. " +
      "If asked why should I hire Yash, give concise recruiter-style strengths. " +
      "Do not mention sources or retrieval.";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "system", content: `Context:\n${context}` },
          ...history.filter((m) => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string"),
          { role: "user", content: query },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Groq API error: ${errText}` });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) return res.status(502).json({ error: "No answer returned by model." });

    return res.status(200).json({ answer });
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : "Unexpected server error" });
  }
}
