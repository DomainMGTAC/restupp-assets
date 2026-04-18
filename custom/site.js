document.addEventListener("DOMContentLoaded", function () {
  const doc = document;

  const header = doc.querySelector(".ru-site-header");
  if (header) {
    const menuBtn = header.querySelector(".ru-site-menu-btn");
    const nav = header.querySelector(".ru-site-nav");
    const navLinks = Array.from(header.querySelectorAll(".ru-site-nav-link"));
    const ctaLink = header.querySelector('.ru-site-cta[href="#early-access"]');

    const sectionMap = [
      { id: "why-rest-upp", link: header.querySelector('.ru-site-nav-link[href="#why-rest-upp"]') },
      { id: "real-support", link: header.querySelector('.ru-site-nav-link[href="#real-support"]') },
      { id: "problem-solution", link: header.querySelector('.ru-site-nav-link[href="#problem-solution"]') },
      { id: "how-it-works", link: header.querySelector('.ru-site-nav-link[href="#how-it-works"]') },
      { id: "why-now", link: header.querySelector('.ru-site-nav-link[href="#why-now"]') }
    ]
      .map(item => ({ ...item, element: doc.getElementById(item.id) }))
      .filter(item => item.link && item.element);

    function closeMenu() {
      if (!nav || !menuBtn) return;
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      if (!nav || !menuBtn) return;
      nav.classList.add("is-open");
      menuBtn.setAttribute("aria-expanded", "true");
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
      const target = doc.getElementById(targetId);
      if (!target) return;

      const headerOffset = window.innerWidth <= 767 ? 82 : 96;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      const duration = 460;
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

    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        const isOpen = nav.classList.contains("is-open");
        if (isOpen) closeMenu();
        else openMenu();
      });
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const targetId = href.replace("#", "");
        if (!doc.getElementById(targetId)) return;

        e.preventDefault();
        smoothScrollTo(targetId);
        closeMenu();
      });
    });

    if (ctaLink) {
      ctaLink.addEventListener("click", function (e) {
        if (!doc.getElementById("early-access")) return;
        e.preventDefault();
        smoothScrollTo("early-access");
        closeMenu();
      });
    }

    doc.querySelectorAll('.rest-btn[href^="#"]').forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const targetId = href.replace("#", "");
        if (!doc.getElementById(targetId)) return;

        e.preventDefault();
        smoothScrollTo(targetId);
      });
    });

    doc.addEventListener("click", function (e) {
      if (!nav || !menuBtn) return;
      if (!header.contains(e.target) && nav.classList.contains("is-open")) {
        closeMenu();
      }
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
  }

  const hero = doc.querySelector(".rest-hero");
  if (hero) {
    hero.addEventListener("pointermove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--glow-x", `${x}%`);
      hero.style.setProperty("--glow-y", `${y}%`);
    });
  }

  const heroButtons = doc.querySelectorAll(".rest-btn");
  heroButtons.forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty("--btn-glow-x", `${x}%`);
      btn.style.setProperty("--btn-glow-y", `${y}%`);
    });
  });

  const inviteCard = doc.querySelector(".ru-invite-card");
  if (inviteCard) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          inviteCard.classList.add("is-visible");
          observer.unobserve(inviteCard);
        }
      });
    }, { threshold: 0.18 });

    observer.observe(inviteCard);

    inviteCard.addEventListener("pointermove", (e) => {
      const rect = inviteCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      inviteCard.style.setProperty("--invite-glow-x", `${x}%`);
      inviteCard.style.setProperty("--invite-glow-y", `${y}%`);
    });
  }

  const hiwSection = doc.querySelector(".hiw-stack-section");
  if (hiwSection) {
    const links = Array.from(hiwSection.querySelectorAll(".hiw-step-link"));
    const cards = Array.from(hiwSection.querySelectorAll(".hiw-card"));

    function setActiveCard(index) {
      links.forEach((link, i) => {
        link.classList.toggle("is-active", i === index);
        link.setAttribute("aria-selected", i === index ? "true" : "false");
      });

      cards.forEach((card, i) => {
        card.classList.remove("is-active", "is-prev", "is-prev-2", "is-next");

        if (i === index) {
          card.classList.add("is-active");
          card.setAttribute("aria-hidden", "false");
        } else {
          card.setAttribute("aria-hidden", "true");

          if (i === index - 1) card.classList.add("is-prev");
          else if (i === index - 2) card.classList.add("is-prev-2");
          else card.classList.add("is-next");
        }
      });
    }

    setActiveCard(0);

    links.forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveCard(index);
      });

      link.addEventListener("mouseenter", () => {
        if (window.innerWidth >= 992) setActiveCard(index);
      });

      link.addEventListener("focus", () => setActiveCard(index));
      link.addEventListener("touchstart", () => setActiveCard(index), { passive: true });
    });
  }

  const footerCard = doc.querySelector(".ru-footer-card");
  if (footerCard) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footerCard.classList.add("is-visible");
          observer.unobserve(footerCard);
        }
      });
    }, { threshold: 0.18 });

    observer.observe(footerCard);
  }
});
