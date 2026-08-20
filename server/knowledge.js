export const profileDocs = [
  {
    id: "core-profile",
    title: "Yash Profile Snapshot",
    type: "profile",
    content:
      "Yash Chetan Doshi is a graduate student engineer focused on data engineering, software systems, and applied AI. Open to 2027 FTE roles in Data Engineering, Software Engineering, and Applied AI.",
  },
  {
    id: "experience-tamu",
    title: "Experience - Texas A&M Full Stack Developer",
    type: "experience",
    content:
      "Full Stack Developer at Texas A&M University. Built and maintained full-stack applications for student and faculty workflows, developing backend logic, API integrations, and relational and MongoDB data models with role-based access controls. Automated workflows using Python, n8n, and Apps Script.",
  },
  {
    id: "experience-acma",
    title: "Experience - Data Analyst Intern",
    type: "experience",
    content:
      "Data Analyst Intern at Acma Computers Ltd, Mumbai (Jul 2024 to Oct 2024). Automated data cleaning workflows, built Python plus SQL dashboards, improved data accuracy, and contributed to a 10% reduction in pipeline/monitoring-related downtime.",
  },
  {
    id: "experience-cdac",
    title: "Experience - Software Developer Intern",
    type: "experience",
    content:
      "Software Developer Intern at C-DAC India, Mumbai (Dec 2023 to May 2024). Built virtual science practical simulator using ReactJS, FlareJS, and Rive; deployed for large educational usage.",
  },
  {
    id: "projects",
    title: "Projects",
    type: "projects",
    content:
      "Projects include AetherMart, CMIS Engagement Platform, Data-Analyzer, Airline-Management-System, Virtual Science Practical Simulator, and AI-Agent-Lab. Covers data engineering, software, and applied AI work.",
  },
  {
    id: "skills",
    title: "Skills",
    type: "skills",
    content:
      "Core skills: Python, SQL, JavaScript/TypeScript, React, Node.js, REST APIs, data analytics, cloud, LangChain, LangGraph, agentic AI, ML tooling.",
  },
  {
    id: "leadership",
    title: "Leadership",
    type: "leadership",
    content:
      "Leadership roles: Event Coordinator at BITS TAMU; Mentor and Marketing Head at CSI; Placement and Internship Coordinator at DJ Sanghvi College.",
  },
  {
    id: "research",
    title: "Research",
    type: "research",
    content:
      "Research work includes XAI for diabetes prediction, AR for anxiety exposure therapy, and YOLO model comparisons for object detection.",
  },
  {
    id: "contact",
    title: "Contact",
    type: "contact",
    content:
      "Contact via email yash.doshi@tamu.edu, phone +1 (979) 574-9820, LinkedIn linkedin.com/in/yashdoshi8, GitHub github.com/candelatesla.",
  },
  {
    id: "source-links",
    title: "Linked Sources",
    type: "source",
    content:
      "Grounding sources: website portfolio content, resume file assets/Yash_Doshi_Resume.pdf, LinkedIn profile, and GitHub repositories.",
  },
];

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const intentKeywords = {
  hire: ["hire", "why should", "fit", "candidate", "strength"],
  projects: ["project", "build", "repo", "github", "portfolio"],
  skills: ["skill", "stack", "tools", "tech"],
  experience: ["experience", "intern", "role", "work"],
  leadership: ["leadership", "lead", "mentor", "coordinator"],
  research: ["research", "paper", "publication", "ieee", "xai"],
  contact: ["contact", "email", "phone", "linkedin"],
};

export const retrieveContext = (query, topK = 5) => {
  const q = query.toLowerCase();
  const qTokens = tokenize(query);
  const results = profileDocs
    .map((doc) => {
      const text = `${doc.title} ${doc.content}`.toLowerCase();
      const tokenMatches = qTokens.reduce((acc, token) => acc + (text.includes(token) ? 1 : 0), 0);
      let boost = 0;

      if (intentKeywords.hire.some((k) => q.includes(k)) && ["experience", "projects", "skills", "leadership"].includes(doc.type)) {
        boost += 4;
      }
      Object.values(intentKeywords).forEach((keys) => {
        if (keys.some((k) => q.includes(k)) && keys.some((k) => doc.content.toLowerCase().includes(k))) {
          boost += 2;
        }
      });

      return { doc, score: tokenMatches + boost };
    })
    .sort((a, b) => b.score - a.score)
    .filter((entry) => entry.score > 0)
    .slice(0, topK)
    .map((entry) => entry.doc);

  return results.length ? results : profileDocs.slice(0, 4);
};
