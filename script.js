/* ============================================================
   PAGE LOADER
   ============================================================ */
const pageLoader = document.querySelector("#page-loader");
if (pageLoader) {
  // Car animation: 0.55s delay + 1.45s run = 2.0s. Add 0.35s buffer then exit.
  const exitLoader = () => {
    pageLoader.classList.add("loader-out");
    pageLoader.addEventListener("transitionend", () => pageLoader.remove(), { once: true });
  };
  if (document.readyState === "complete") {
    setTimeout(exitLoader, 2350);
  } else {
    window.addEventListener("load", () => setTimeout(exitLoader, 2350), { once: true });
  }
}

/* ============================================================
   THEME
   ============================================================ */
const THEME_KEY = "portfolio-theme";
const themeToggleBtn = document.querySelector("#theme-toggle");

const setTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
};

setTheme(localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const next = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

/* ============================================================
   RESUME MODAL
   ============================================================ */
const resumeModal       = document.querySelector("#resume-modal");
const resumeModalClose  = document.querySelector("#resume-modal-close");
const resumeModalBg     = document.querySelector("#resume-modal-backdrop");
const resumePreviewBtn  = document.querySelector("#resume-preview-btn");

if (resumeModal && resumePreviewBtn) {
  const openResume = () => {
    resumeModal.classList.add("open");
    resumeModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    resumeModalClose?.focus();
  };
  const closeResume = () => {
    resumeModal.classList.remove("open");
    resumeModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    resumePreviewBtn.focus();
  };
  const FOCUSABLE = 'a[href],button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';
  const trapFocus = (e) => {
    if (!resumeModal.classList.contains("open")) return;
    const els = [...resumeModal.querySelectorAll(FOCUSABLE)];
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === "Escape") closeResume();
  };
  resumePreviewBtn.addEventListener("click", openResume);
  resumeModalClose?.addEventListener("click", closeResume);
  resumeModalBg?.addEventListener("click", closeResume);
  document.addEventListener("keydown", trapFocus);
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow) {
  let raf;
  document.addEventListener("mousemove", (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  });
  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.1 }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ============================================================
   ACTIVE NAV SECTION
   ============================================================ */
const sectionIds = ["education", "experience", "projects", "research", "leadership", "skills", "awards", "contact"];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.45 }
);

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ============================================================
   TILT CARDS
   ============================================================ */
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ============================================================
   PROJECT FILTER
   ============================================================ */
const filterBtns = document.querySelectorAll(".chip");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
      const show = filter === "all" || tags.includes(filter);
      card.style.display = show ? "" : "none";
      card.style.opacity  = show ? "" : "0";
    });
  });
});

/* ============================================================
   FOOTER YEAR
   ============================================================ */
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   CONTACT FORM
   ============================================================ */
const form     = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");

if (form && statusEl) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending…";

    const formData = new FormData(form);
    formData.append("_subject", "New portfolio contact form message");

    try {
      const res = await fetch("https://formsubmit.co/ajax/yash.doshi@tamu.edu", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!res.ok) throw new Error();
      form.reset();
      statusEl.textContent = "Message sent — thanks!";
    } catch {
      statusEl.textContent = "Couldn't send right now. Email me directly at yash.doshi@tamu.edu";
    }
  });
}

/* ============================================================
   CHATBOT
   ============================================================ */
const chatLauncher      = document.querySelector("#chat-launcher");
const chatNudge         = document.querySelector("#chat-nudge");
const chatbotPanel      = document.querySelector("#chatbot-panel");
const chatbotClose      = document.querySelector("#chatbot-close");
const chatbotMessages   = document.querySelector("#chatbot-messages");
const chatbotForm       = document.querySelector("#chatbot-form");
const chatbotInput      = document.querySelector("#chatbot-input");
const chatPromptButtons = document.querySelectorAll(".chat-prompt");
const chatHistory       = [];
const CHAT_API_ENDPOINTS = ["/api/chat"];

const knowledgeBase = [
  {
    type: "experience",
    title: "Tesla — Data Engineering Intern",
    summary: "Data Engineering Intern at Tesla, May – Dec 2026 (Summer & Fall).",
    details: "Joining Tesla as a Data Engineering Intern — details to follow.",
    source: "Website experience section",
    keywords: ["tesla", "data engineering", "intern", "2026"],
  },
  {
    type: "experience",
    title: "Texas A&M University — Full Stack Developer",
    summary: "Current full-stack role delivering student/internal features end-to-end across UI, APIs, and data.",
    details: "College Station, TX. Focused on reliable delivery and iterative feature ownership.",
    source: "Website experience section",
    keywords: ["tamu", "texas a&m", "full stack", "developer", "current role", "experience"],
  },
  {
    type: "experience",
    title: "Acma Computers Ltd — Data Analyst Intern",
    summary: "Built Python/SQL analytics workflows, improved data quality, and supported better infrastructure monitoring.",
    details: "Jul 2024 – Oct 2024, Mumbai, India.",
    source: "Website + resume",
    keywords: ["acma", "data analyst", "intern", "python", "sql", "dashboard"],
  },
  {
    type: "experience",
    title: "ROI Institute India — Business Development Intern",
    summary: "Generated qualified leads and supported go-to-market seminar launches across cities.",
    details: "Jun 2023 – Aug 2023, Mumbai, India.",
    source: "Website + resume",
    keywords: ["roi institute", "business development", "leads", "gtm"],
  },
  {
    type: "leadership",
    title: "Leadership",
    summary: "Event Coordinator at BITS TAMU, Mentor & Marketing Head at CSI, and Placement/Internship Coordinator at DJ Sanghvi.",
    details: "Led teams, events, partnerships, and student placement prep at scale.",
    source: "Website leadership section",
    keywords: ["leadership", "bits", "csi", "coordinator", "mentor"],
  },
  {
    type: "research",
    title: "Research",
    summary: "Focus on XAI in healthcare, AR in exposure therapy, and YOLO model benchmarking.",
    details: "Includes ICMAAI presentation and IEEE/Scopus publications.",
    source: "Website research section",
    keywords: ["research", "xai", "ieee", "yolo", "healthcare", "paper"],
  },
  {
    type: "skills",
    title: "Skills",
    summary: "Core stack: Python, SQL, React, Node.js, LangChain/LangGraph, analytics tools, cloud, and data systems.",
    details: "Strengths span data engineering, AI workflows, full-stack development, and product-oriented implementation.",
    source: "Website skills section + resume",
    keywords: ["skills", "tech stack", "tools", "python", "sql", "react", "node", "ai", "cloud"],
  },
  {
    type: "projects",
    title: "Projects",
    summary: "Core work across data, full-stack, and AI: AetherMart, CMIS, Data-Analyzer, Airline system, CDAC simulator, AI-Agent-Lab.",
    details: "Primary stack includes Python, SQL, React, Node.js, LangChain/LangGraph, and analytics tooling.",
    source: "Website projects + GitHub",
    keywords: ["projects", "github", "aethermart", "cmis", "ai-agent-lab", "data-analyzer"],
  },
  {
    type: "contact",
    title: "Contact",
    summary: "Email: yash.doshi@tamu.edu, Phone: +1 (979) 574-9820, LinkedIn and GitHub available.",
    details: "Direct links: LinkedIn /in/yashdoshi8, GitHub /candelatesla, downloadable resume in website hero.",
    source: "Website contact section",
    keywords: ["contact", "email", "phone", "linkedin", "github", "resume"],
  },
  {
    type: "profile",
    title: "Source profile links",
    summary: "Answers are grounded on portfolio content and linked resume/LinkedIn/GitHub context.",
    details: "LinkedIn: linkedin.com/in/yashdoshi8 | GitHub: github.com/candelatesla | Resume: assets/Yash_Doshi_Resume.pdf",
    source: "Website links",
    keywords: ["linkedin", "github", "resume", "source", "rag"],
  },
];

const addChatMessage = (text, role = "bot") => {
  if (!chatbotMessages) return;
  const bubble = document.createElement("div");
  bubble.className = `chat-msg ${role}`;
  bubble.textContent = text;
  chatbotMessages.appendChild(bubble);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const typeChatMessage = async (text) => {
  if (!chatbotMessages) return;
  const bubble = document.createElement("div");
  bubble.className = "chat-msg bot";
  chatbotMessages.appendChild(bubble);
  for (const char of [...text]) {
    bubble.textContent += char;
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    await wait(/[.,:;!?\n]/.test(char) ? 55 : 14);
  }
};

const summarizeExperience = () =>
  knowledgeBase
    .filter((i) => i.type === "experience")
    .map((i) => `• ${i.title}: ${i.summary}`)
    .join("\n");

const summarizeSkills = () => {
  const s = knowledgeBase.find((i) => i.type === "skills");
  return s ? `${s.summary}\n${s.details}` : "Python, SQL, React, Node.js, LangChain, and more.";
};

const detectIntent = (q) => {
  if (q.includes("hire"))                                         return "hire";
  if (q.includes("experience") || q === "exp")                   return "experience";
  if (q.includes("project"))                                      return "projects";
  if (q.includes("leadership"))                                   return "leadership";
  if (q.includes("research"))                                     return "research";
  if (q.includes("skill") || q.includes("stack"))                return "skills";
  if (q.includes("contact") || q.includes("email") || q.includes("phone")) return "contact";
  return "general";
};

const answerFromKnowledge = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return "Ask me about experience, projects, leadership, research, or contact.";
  const intent = detectIntent(q);
  if (intent === "experience") return summarizeExperience();
  if (intent === "skills")     return summarizeSkills();
  if (intent === "hire")
    return "Yash is an incoming Tesla intern and is exploring full-time roles starting 2027 in Data Engineering, Data Science, Analytics, Software Development, and Applied AI. He combines full-stack execution, data/AI implementation, and leadership experience across real delivered systems.";

  const scored = knowledgeBase
    .map((item) => {
      const kw = item.keywords.reduce((acc, k) => acc + (q.includes(k) ? 2 : 0), 0);
      const txt = `${item.title} ${item.summary} ${item.details}`.toLowerCase().includes(q) ? 3 : 0;
      return { item, score: kw + txt };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!scored.length)
    return "I can help with experience, projects, leadership, research, skills, and contact. Try a prompt above!";
  return scored.map(({ item }) => `${item.title}: ${item.summary}`).join("\n");
};

const getApiAnswer = async (query) => {
  for (const endpoint of CHAT_API_ENDPOINTS) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, history: chatHistory.slice(-8) }),
    });
    if (!res.ok) {
      const p = await res.json().catch(() => ({}));
      throw new Error(p.error || `API failed at ${endpoint}`);
    }
    const p = await res.json();
    return p.answer;
  }
  throw new Error("No endpoint available.");
};

if (chatLauncher && chatbotPanel && chatbotClose && chatbotForm && chatbotInput) {
  let isTyping = false;

  if (chatNudge) {
    setTimeout(() => chatNudge.classList.add("show"), 600);
    setTimeout(() => { chatNudge.classList.add("hide"); chatNudge.classList.remove("show"); }, 5500);
  }

  chatLauncher.addEventListener("click", () => {
    chatbotPanel.classList.add("open");
    chatbotPanel.setAttribute("aria-hidden", "false");
    chatbotInput.focus();
    if (chatNudge) { chatNudge.classList.add("hide"); chatNudge.classList.remove("show"); }
  });

  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.remove("open");
    chatbotPanel.setAttribute("aria-hidden", "true");
  });

  chatPromptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      chatbotInput.value = btn.textContent || "";
      chatbotForm.requestSubmit();
    });
  });

  chatbotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = chatbotInput.value.trim();
    if (!query || isTyping) return;
    addChatMessage(query, "user");
    chatHistory.push({ role: "user", content: query });
    chatbotInput.value = "";
    isTyping = true;
    let answer = "";
    try {
      answer = await getApiAnswer(query);
    } catch {
      answer = answerFromKnowledge(query);
    }
    await typeChatMessage(answer);
    chatHistory.push({ role: "assistant", content: answer });
    isTyping = false;
  });

  isTyping = true;
  typeChatMessage(
    "Hi, I'm Jarvis. Ask about Yash's experience, projects, leadership, research, skills, or contact details."
  ).then(() => { isTyping = false; });
}
