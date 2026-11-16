const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${amount}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

document.getElementById("year").textContent = new Date().getFullYear();
const revealTargets = document.querySelectorAll(
  ".section-label, .about-grid, .education-card, .skill-card, .project-card, .timeline-item, .contact-grid"
);
revealTargets.forEach(el => el.classList.add("reveal"));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));
const exploreWorkButton = document.getElementById("exploreWorkButton");
if (exploreWorkButton) {
  exploreWorkButton.addEventListener("click", event => {
    const target = document.getElementById("projects");
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#projects");
    }
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

document.querySelectorAll(".hero-copy > *").forEach((el, i) => {
  el.classList.add("hero-in");
  el.style.setProperty("--d", `${0.1 + i * 0.11}s`);
});

[".skills-grid .skill-card", ".timeline .timeline-item", ".education-section .education-card"].forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => el.style.setProperty("--rd", `${i * 0.12}s`));
});

document.querySelectorAll(".pills").forEach(group => {
  group.querySelectorAll("span").forEach((pill, i) => pill.style.setProperty("--i", i));
});

const projectCards = document.querySelectorAll(".project-card");
function typeCode(card) {
  const lines = card.querySelectorAll(".code-lines p");
  lines.forEach((line, i) => {
    setTimeout(() => {
      line.classList.add("on");
      card.querySelectorAll(".caret").forEach(c => c.remove());
      const caret = document.createElement("span");
      caret.className = "caret";
      line.appendChild(caret);
    }, reduceMotion ? 0 : 500 + i * 220);
  });
}
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.querySelector(".code-lines")) typeCode(entry.target);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
projectCards.forEach(card => cardObserver.observe(card));

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 40), { passive: true });

const navLinks = [...nav.querySelectorAll("a:not(.nav-cta)")];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));

if (!reduceMotion) {
  const roles = ["STUDENT / DEVELOPER", "PROBLEM SOLVER", "LIFELONG LEARNER", "FUTURE ENGINEER"];
  const roleEl = document.querySelector(".card-top span:first-child");
  if (roleEl) {
    let roleIndex = 0, charIndex = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      roleEl.textContent = word.slice(0, charIndex);
      let delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) { deleting = true; delay = 1800; }
      else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  }
}

if (!reduceMotion && finePointer) {
  const heroArt = document.querySelector(".hero-art");
  const profileCard = document.querySelector(".profile-card");
  const depth = [
    [".art-grid", 8], [".orbit-one", 14], [".orbit-two", 22],
    [".note-one", 30], [".note-two", -26], [".visual-stamp", 18]
  ].map(([sel, d]) => [document.querySelector(sel), d]).filter(([el]) => el);

  heroArt.addEventListener("mousemove", e => {
    const rect = heroArt.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    depth.forEach(([el, d]) => { el.style.translate = `${x * d}px ${y * d}px`; });
    profileCard.style.transform = `perspective(900px) rotate(3deg) rotateX(${-y * 12}deg) rotateY(${x * 14}deg)`;
  });
  heroArt.addEventListener("mouseleave", () => {
    depth.forEach(([el]) => { el.style.translate = ""; });
    profileCard.style.transform = "";
  });

  document.querySelectorAll(".button, .nav-cta").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
      btn.style.translate = `${x}px ${y}px`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.translate = ""; });
  });

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  let targetX = 0, targetY = 0, glowX = 0, glowY = 0;
  window.addEventListener("mousemove", e => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.classList.add("on");
  }, { passive: true });
  document.addEventListener("mouseleave", () => glow.classList.remove("on"));
  (function follow() {
    glowX += (targetX - glowX) * 0.12;
    glowY += (targetY - glowY) * 0.12;
    glow.style.translate = `${glowX}px ${glowY}px`;
    requestAnimationFrame(follow);
  })();
}
