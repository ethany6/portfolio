const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const phrases = [
  "FiveM scripts.",
  "websites.",
  "backend systems.",
  "frontend systems."
];

const typewriter = document.getElementById("typewriter");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];

  if (!deleting) {
    typewriter.textContent = phrase.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    typewriter.textContent = phrase.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, deleting ? 40 : 90);
}

typeLoop();

const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

// Theme toggle
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

// Page load progress bar
const loadbar = document.getElementById("loadbar");
window.addEventListener("load", () => {
  loadbar.classList.add("done");
  setTimeout(() => loadbar.classList.add("hide"), 1400);
});

// FAQ accordion
document.querySelectorAll(".faq__item").forEach((item) => {
  const answer = item.nextElementSibling;
  item.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
  });
});

// GitHub stats
async function loadGitHubStats() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/ethany6"),
      fetch("https://api.github.com/users/ethany6/repos?per_page=100")
    ]);
    const user = await userRes.json();
    const repos = await reposRes.json();

    if (user.public_repos != null) {
      document.getElementById("statRepos").textContent = user.public_repos;
    }
    if (user.followers != null) {
      document.getElementById("statFollowers").textContent = user.followers;
    }
    if (Array.isArray(repos)) {
      const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      document.getElementById("statStars").textContent = stars;
    }
  } catch (e) {}
}

loadGitHubStats();

// Now playing state
const bgMusic = document.getElementById("bgMusic");
const nowplaying = document.getElementById("nowplaying");
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
const VOLUME = 0.15;

function updateStatus() {
  const label = nowplaying.querySelector(".nowplaying__label");
  nowplaying.classList.toggle("paused", bgMusic.paused);
  nowplaying.classList.toggle("muted", bgMusic.muted);
  if (muteBtn) muteBtn.classList.toggle("muted", bgMusic.muted);

  if (bgMusic.muted) label.textContent = "MUTED";
  else if (bgMusic.paused) label.textContent = "PAUSED";
  else label.textContent = "NOW PLAYING";
}

function tryAutoplay() {
  bgMusic.volume = VOLUME;
  bgMusic.play().catch(() => {});
}

function toggleMute() {
  bgMusic.muted = !bgMusic.muted;
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.volume = VOLUME;
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
}

if (muteBtn) muteBtn.addEventListener("click", toggleMute);

if (volumeSlider) {
  volumeSlider.addEventListener("input", () => {
    const v = volumeSlider.value / 100;
    bgMusic.volume = v;
    if (v > 0 && bgMusic.muted) {
      bgMusic.muted = false;
    }
    updateStatus();
  });
}

bgMusic.addEventListener("play", updateStatus);
bgMusic.addEventListener("pause", updateStatus);
bgMusic.addEventListener("volumechange", () => {
  if (volumeSlider && !bgMusic.muted) {
    volumeSlider.value = Math.round(bgMusic.volume * 100);
  }
});

updateStatus();
tryAutoplay();

window.addEventListener("pointerdown", tryAutoplay, { once: true });

// Hero name scramble on hover
const heroName = document.querySelector(".hero__name");
const glyphs = "アイウエオ01#@$%&<>{}[]";
let scrambleTimer = null;

function scrambleName() {
  const target = heroName.textContent;
  let frame = 0;
  const frames = 12;
  clearInterval(scrambleTimer);
  scrambleTimer = setInterval(() => {
    frame++;
    const progress = frame / frames;
    heroName.textContent = target
      .split("")
      .map((ch, i) =>
        i < progress * target.length
          ? ch
          : glyphs[Math.floor(Math.random() * glyphs.length)]
      )
      .join("");
    if (frame >= frames) {
      heroName.textContent = target;
      clearInterval(scrambleTimer);
    }
  }, 38);
}

heroName.addEventListener("mouseenter", scrambleName);

// Discord copy
const discordCopy = document.getElementById("discordCopy");
const discordAction = document.getElementById("discordAction");
const DISCORD_USER = "cranberrydrink2";

discordCopy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(DISCORD_USER);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = DISCORD_USER;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  discordCopy.classList.add("copied");
  discordAction.textContent = "Copied!";
  setTimeout(() => {
    discordCopy.classList.remove("copied");
    discordAction.textContent = "Copy";
  }, 2000);
});

// Keyboard shortcuts
const sectionMap = {
  "1": "#about",
  "2": "#projects",
  "3": "#skills",
  "4": "#experience",
  "5": "#contact"
};

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  if (sectionMap[e.key]) {
    const el = document.querySelector(sectionMap[e.key]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  } else if (e.key === "t" || e.key === "T") {
    themeToggle.click();
  } else if (e.key === "m" || e.key === "M") {
    toggleMusic();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
