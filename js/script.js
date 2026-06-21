/* ============================================================
   KEARIFAN LOKAL TULUNGAGUNG - MAIN INTERACTIVE SCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* 1. PAGE LOADER */
  const loader = document.querySelector(".page-loader");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hidden"), 400);
    });
  }

  /* 2. PROGRESS BAR */
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    window.addEventListener(
      "scroll",
      () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
      },
      { passive: true },
    );
  }

  /* 3. HEADER - scroll shadow & active nav */
  const header = document.querySelector(".header");
  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 50);
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const currentPath = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentPath) link.classList.add("active");
  });

  /* 4. HAMBURGER MENU */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (e) => {
      if (
        header &&
        !header.contains(e.target) &&
        navLinks.classList.contains("open")
      )
        closeMenu();
    });
  }

  /* 5. SCROLL REVEAL ANIMATIONS */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("show"), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".fade-up, .fade-left, .fade-right")
    .forEach((el) => revealObserver.observe(el));

  /* 6. HERO BACKGROUND SLIDESHOW */
  const heroImages = [
    "https://i.pinimg.com/736x/f1/ba/e5/f1bae54a728b0f371f1044bd8e7087b4.jpg",
    "image/airterjun.png",
    "https://i.pinimg.com/736x/68/15/78/68157854066a24c03b2b5d0be4614da1.jpg",
    "image/buper.png",
    "https://i.pinimg.com/1200x/11/05/99/1105998014364c09e07b4d68d58087f8.jpg",
    "image/bukit1.png",
    "https://i.pinimg.com/736x/0f/cd/91/0fcd917fa6081ac6282a4daa83cef68d.jpg",
    "image/bukit.png",
    "https://i.pinimg.com/1200x/0b/05/96/0b0596fd932a35b129f4acbfb606798c.jpg",
    "image/jurang.png",
    "https://i.pinimg.com/736x/e2/de/e8/e2dee87ee5f60800ef6cfaacb5f6cb3d.jpg",
    "image/pantaicoro.png",
    "https://i.pinimg.com/736x/4f/51/93/4f519350d3b65ee2a1d9153d53942ff7.jpg",
  ];

  const slide1 = document.querySelector(".slide-1");
  const slide2 = document.querySelector(".slide-2");
  const overlay = "linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.62))";
  let currentIndex = 0;

  if (slide1 && slide2) {
    const setLayer = (el, idx) =>
      (el.style.backgroundImage = `${overlay}, url('${heroImages[idx]}')`);

    setLayer(slide1, currentIndex);
    slide1.classList.add("active");
    slide2.classList.add("hidden");

    setInterval(() => {
      currentIndex = (currentIndex + 1) % heroImages.length;
      const active = slide1.classList.contains("active") ? slide1 : slide2;
      const standby = active === slide1 ? slide2 : slide1;

      setLayer(standby, currentIndex);
      standby.classList.replace("hidden", "active");
      active.classList.replace("active", "hidden");
    }, 4000);
  }

  /* 7. CARD 3D TILT EFFECT */
  const applyTilt = (selector) => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    document.querySelectorAll(selector).forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const rotX = ((e.clientY - top) / height - 0.5) * -10;
        const rotY = ((e.clientX - left) / width - 0.5) * 10;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  };
  applyTilt(".budaya-card, .card");

  /* 8. BUTTON RIPPLE & 9. BACK TO TOP & 10. SMOOTH ANCHOR */
  document.querySelectorAll(".btn").forEach((btn) =>
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.style.cssText = `width:${size}px; height:${size}px; left:${e.clientX - rect.left - size / 2}px; top:${e.clientY - rect.top - size / 2}px;`;
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    }),
  );

  const backToTop = document.querySelector(".back-to-top");
  window.addEventListener(
    "scroll",
    () => {
      if (backToTop)
        backToTop.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true },
  );
  backToTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* 11. ACCESSIBILITY */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks?.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
});
