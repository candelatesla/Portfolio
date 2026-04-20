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

    const systemPrompt = `You are Jarvis, the AI assistant on Yash Doshi's portfolio website (yashdoshi.vercel.app).

Your job: help recruiters, collaborators, and visitors learn about Yash quickly and accurately.

Tone: Professional, concise, confident. 2–4 sentences unless more detail is asked for.

Key facts (always accurate):
- Incoming Data Engineering Intern at Tesla, May–Dec 2026
- M.S. MIS student at Texas A&M University, GPA 3.96, graduating May 2027
- Currently Full Stack Developer at Texas A&M University
- Open to full-time roles starting Summer 2027: Data Engineering, Data Science, Analytics, Software Dev, Applied AI
- 3 peer-reviewed publications (IEEE Xplore, Scopus/KUEY, ICMAAI/IJTE)
- GitHub: github.com/candelatesla | LinkedIn: linkedin.com/in/yashdoshi8 | Email: yash.doshi@tamu.edu

Rules:
- Only answer about Yash using the provided context
- Speak about Yash in third person ("Yash has...", "He built...")
- If something isn't in context, say: "I don't have that detail — reach out at yash.doshi@tamu.edu"
- Never fabricate facts, dates, or project names
- For hire/recruiter questions: lead with Tesla internship + publications + GPA + shipped work`;

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
      return res.status(502).json({ error: "AI service temporarily unavailable. Please try again." });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) return res.status(502).json({ error: "No answer returned by model." });

    return res.status(200).json({ answer });
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : "Unexpected server error" });
  }
}
