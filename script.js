const sections = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav a");
const cursorGlow = document.querySelector(".cursor-glow");
const projectButtons = document.querySelectorAll(".chip");
const projectCards = document.querySelectorAll(".project-card");
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
const themeToggleBtn = document.querySelector("#theme-toggle");
const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");
const chatLauncher = document.querySelector("#chat-launcher");
const chatNudge = document.querySelector("#chat-nudge");
const chatbotPanel = document.querySelector("#chatbot-panel");
const chatbotClose = document.querySelector("#chatbot-close");
const chatbotMessages = document.querySelector("#chatbot-messages");
const chatbotForm = document.querySelector("#chatbot-form");
const chatbotInput = document.querySelector("#chatbot-input");
const chatPromptButtons = document.querySelectorAll(".chat-prompt");

const THEME_KEY = "portfolio-theme";
const setTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
};

const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme === "light" ? "light" : "dark");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme") === "light" ? "light" : "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

const knowledgeBase = [
  {
    type: "experience",
    title: "Texas A&M University - Full Stack Developer",
    summary: "Current full-stack role delivering student/internal features end-to-end across UI, APIs, and data.",
    details: "College Station, TX. Focused on reliable delivery and iterative feature ownership.",
    source: "Website experience section",
    keywords: ["tamu", "texas a&m", "full stack", "developer", "current role", "experience"],
  },
  {
    type: "experience",
    title: "Acma Computers Ltd - Data Analyst Intern",
    summary: "Built Python/SQL analytics workflows, improved data quality, and supported better infrastructure monitoring.",
    details: "Jul 2024 - Oct 2024, Mumbai, India.",
    source: "Website + resume",
    keywords: ["acma", "data analyst", "intern", "python", "sql", "dashboard"],
  },
  // {
  //   type: "experience",
  //   title: "C-DAC India - Software Developer Intern",
  //   summary: "Developed an interactive virtual science simulator and deployed it for high-scale educational usage.",
  //   details: "Dec 2023 - May 2024, Mumbai, India.",
  //   source: "Website + GitHub (CDAC repo)",
  //   keywords: ["cdac", "software developer", "simulator", "react", "vidyakash"],
  // },
  // {
  //   type: "experience",
  //   title: "DJ Sanghvi - Teaching Assistant",
  //   summary: "Supported a 60-student theory course with tutorials and focused doubt-solving sessions.",
  //   details: "Dec 2023 - May 2024, Mumbai, India.",
  //   source: "Website + resume",
  //   keywords: ["teaching assistant", "dj sanghvi", "automata", "formal language"],
  // },
  {
    type: "experience",
    title: "ROI Institute India - Business Development Intern",
    summary: "Generated qualified leads and supported go-to-market seminar launches across cities.",
    details: "Jun 2023 - Aug 2023, Mumbai, India.",
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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const typeChatMessage = async (text) => {
  if (!chatbotMessages) return;
  const bubble = document.createElement("div");
  bubble.className = "chat-msg bot";
  chatbotMessages.appendChild(bubble);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  const chars = [...text];
  for (let i = 0; i < chars.length; i += 1) {
    bubble.textContent += chars[i];
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    const char = chars[i];
    const delay = char === "\n" ? 110 : /[.,:;!?]/.test(char) ? 55 : 16;
    await wait(delay);
  }
};

const summarizeExperience = () => {
  const roles = knowledgeBase.filter((item) => item.type === "experience");
  const lines = roles.map((item) => `• ${item.title}: ${item.summary}`);
  return `Quick experience snapshot:\n${lines.join("\n")}`;
};

const summarizeSkills = () => {
  const skillNode = knowledgeBase.find((item) => item.type === "skills");
  return skillNode ? `${skillNode.summary}\n${skillNode.details}` : "Skills include data, AI, and full-stack engineering capabilities.";
};

const detectIntent = (query) => {
  if (["experience", "exp"].includes(query) || query.includes("experience summary")) return "experience";
  if (query === "projects" || query.includes("project")) return "projects";
  if (query === "leadership" || query.includes("leadership")) return "leadership";
  if (query === "research" || query.includes("research")) return "research";
  if (query === "skills" || query.includes("skill") || query.includes("tech stack")) return "skills";
  if (query === "contact" || query.includes("contact") || query.includes("email") || query.includes("phone")) return "contact";
  return "general";
};

const answerFromKnowledge = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return "Please ask a question about experience, projects, leadership, research, or contact.";
  const intent = detectIntent(q);

  if (intent === "experience") {
    return summarizeExperience();
  }

  if (intent === "skills") {
    return `Skills summary:\n${summarizeSkills()}`;
  }

  const scored = knowledgeBase
    .map((item) => {
      const keywordScore = item.keywords.reduce((acc, key) => acc + (q.includes(key) ? 2 : 0), 0);
      const textScore = `${item.title} ${item.summary} ${item.details}`.toLowerCase().includes(q) ? 3 : 0;
      return { item, score: keywordScore + textScore };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!scored.length) {
    return "I can help with experience, projects, leadership, research, skills, and contact details. Try one quick prompt above.";
  }
  return scored.map(({ item }) => `${item.title}: ${item.summary}`).join("\n");
};

if (chatLauncher && chatbotPanel && chatbotClose && chatbotForm && chatbotInput) {
  let isTyping = false;
  if (chatNudge) {
    window.setTimeout(() => {
      chatNudge.classList.add("show");
    }, 500);
    window.setTimeout(() => {
      chatNudge.classList.add("hide");
      chatNudge.classList.remove("show");
    }, 5200);
  }

  chatLauncher.addEventListener("click", () => {
    chatbotPanel.classList.add("open");
    chatbotPanel.setAttribute("aria-hidden", "false");
    chatbotInput.focus();
    if (chatNudge) {
      chatNudge.classList.add("hide");
      chatNudge.classList.remove("show");
    }
  });

  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.remove("open");
    chatbotPanel.setAttribute("aria-hidden", "true");
  });

  chatPromptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      chatbotInput.value = button.textContent || "";
      chatbotForm.requestSubmit();
    });
  });

  chatbotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = chatbotInput.value.trim();
    if (!query || isTyping) return;
    addChatMessage(query, "user");
    const answer = answerFromKnowledge(query);
    isTyping = true;
    typeChatMessage(answer).finally(() => {
      isTyping = false;
    });
    chatbotInput.value = "";
  });

  isTyping = true;
  typeChatMessage("Hi, I’m Jarvis. Ask about Yash’s experience, projects, leadership, research, skills, or contact details.").finally(
    () => {
      isTyping = false;
    }
  );
}

document.querySelector("#year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.18 }
);
sections.forEach((section) => observer.observe(section));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isMatch);
      });
    });
  },
  { threshold: 0.55 }
);
["education", "experience", "projects", "research", "leadership", "skills", "awards", "contact"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

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

document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    projectButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");

    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
      const show = filter === "all" || tags.includes(filter);
      card.style.display = show ? "block" : "none";
    });
  });
});

if (cursorGlow) {
  document.addEventListener("mousemove", (event) => {
    cursorGlow.style.opacity = "1";
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Sending...";

  const formData = new FormData(form);
  formData.append("_subject", "New portfolio contact form message");

  try {
    const response = await fetch("https://formsubmit.co/ajax/yash.doshi@tamu.edu", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to submit form.");
    }

    form.reset();
    statusEl.textContent = "Message sent successfully. Thank you.";
  } catch (error) {
    statusEl.textContent = "Could not send right now. Please email me directly at yash.doshi@tamu.edu.";
  }
});

