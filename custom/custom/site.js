document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".ru-site-header");
  if (!header) return;

  const menuBtn = header.querySelector(".ru-site-menu-btn");
  const nav = header.querySelector(".ru-site-nav");
  const navLinks = Array.from(header.querySelectorAll(".ru-site-nav-link"));

  const sectionMap = [
    { id: "why-rest-upp", link: header.querySelector('.ru-site-nav-link[href="#why-rest-upp"]') },
    { id: "real-support", link: header.querySelector('.ru-site-nav-link[href="#real-support"]') },
    { id: "problem-solution", link: header.querySelector('.ru-site-nav-link[href="#problem-solution"]') },
    { id: "how-it-works", link: header.querySelector('.ru-site-nav-link[href="#how-it-works"]') },
    { id: "why-now", link: header.querySelector('.ru-site-nav-link[href="#why-now"]') }
  ]
    .map(item => ({ ...item, element: document.getElementById(item.id) }))
    .filter(item => item.link && item.element);

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function clearActiveLinks() {
    navLinks.forEach(link => link.classList.remove("is-active"));
  }

  function updateActiveLink() {
    const triggerY = window.innerHeight * 0.30;
    let current = null;

    sectionMap.forEach((section) => {
      const rect = section.element.getBoundingClientRect();
      if (rect.top <= triggerY) current = section;
    });

    clearActiveLinks();

    if (current && window.scrollY > 80) {
      current.link.classList.add("is-active");
    }
  }

  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const headerOffset = 96;
    const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = 520;
    let startTime = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        updateActiveLink();
      }
    }

    requestAnimationFrame(step);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const id = href.replace("#", "");
      if (!document.getElementById(id)) return;

      e.preventDefault();
      smoothScrollTo(id);

      if (nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });

  const cta = header.querySelector('.ru-site-cta[href="#early-access"]');
  if (cta) {
    cta.addEventListener("click", function (e) {
      if (!document.getElementById("early-access")) return;
      e.preventDefault();
      smoothScrollTo("early-access");

      if (nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  const hero = document.querySelector(".rest-hero");
  if (hero) {
    hero.addEventListener("pointermove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--glow-x", `${x}%`);
      hero.style.setProperty("--glow-y", `${y}%`);
    });
  }

  const buttons = document.querySelectorAll(".rest-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty("--btn-glow-x", `${x}%`);
      btn.style.setProperty("--btn-glow-y", `${y}%`);
    });
  });

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
});
