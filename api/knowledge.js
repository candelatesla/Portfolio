export const profileDocs = [
  { id: "core-profile", title: "Yash Profile Snapshot", content: "Yash Chetan Doshi is a graduate student engineer focused on AI, data, and full-stack systems. Open to internship roles in Data, AI, and Full-Stack Engineering." },
  { id: "experience-tamu", title: "Experience - Texas A&M Full Stack Developer", content: "Current Full Stack Developer at Texas A&M University..." },
  { id: "experience-acma", title: "Experience - Data Analyst Intern", content: "Data Analyst Intern at Acma Computers Ltd..." },
  { id: "experience-cdac", title: "Experience - Software Developer Intern", content: "Software Developer Intern at C-DAC India..." },
  { id: "projects", title: "Projects", content: "AetherMart, CMIS, Data-Analyzer, Airline-Management-System, CDAC simulator, AI-Agent-Lab." },
  { id: "skills", title: "Skills", content: "Python, SQL, React, Node.js, LangChain/LangGraph, analytics, cloud, data systems." },
  { id: "leadership", title: "Leadership", content: "BITS TAMU, CSI, Placement/Internship coordination." },
  { id: "research", title: "Research", content: "XAI healthcare, AR exposure therapy, YOLO benchmarking." },
  { id: "contact", title: "Contact", content: "yash.doshi@tamu.edu, +1 (979) 574-9820, LinkedIn, GitHub." },
];

const tokenize = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

export function retrieveContext(query, topK = 5) {
  const q = query.toLowerCase();
  const qTokens = tokenize(query);

  const scored = profileDocs
    .map((doc) => {
      const text = `${doc.title} ${doc.content}`.toLowerCase();
      const tokenScore = qTokens.reduce((a, tok) => a + (text.includes(tok) ? 1 : 0), 0);
      const hireBoost = (q.includes("hire") || q.includes("why should")) &&
        /experience|projects|skills|leadership/.test(text) ? 4 : 0;
      return { doc, score: tokenScore + hireBoost };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.doc);

  return scored.length ? scored : profileDocs.slice(0, 4);
}
