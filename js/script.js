/* ============================================================
   KEARIFAN LOKAL TULUNGAGUNG — MAIN INTERACTIVE SCRIPT
   ============================================================ */

/* ── 1. PAGE LOADER ── */
const loader = document.querySelector('.page-loader');
if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
}

/* ── 2. PROGRESS BAR ── */
const progressBar = document.querySelector('.progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ── 3. HEADER — scroll shadow & active nav ── */
const header = document.querySelector('.header');

function updateHeader() {
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader(); // Run on load

/* Mark active nav link */
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── 4. HAMBURGER MENU ── */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── 5. SCROLL REVEAL ANIMATIONS ── */
const animatedEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Small stagger for cards in a grid
      const siblings = entry.target.parentElement?.querySelectorAll('.fade-up, .fade-left, .fade-right');
      let delay = 0;
      if (siblings && siblings.length > 1) {
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
      }
      setTimeout(() => entry.target.classList.add('show'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animatedEls.forEach(el => revealObserver.observe(el));

/* ── 6. HERO BACKGROUND SLIDESHOW (double-layer cross-fade) ── */
const heroImages = [
  "https://i.pinimg.com/736x/f1/ba/e5/f1bae54a728b0f371f1044bd8e7087b4.jpg",
  "https://i.pinimg.com/736x/68/15/78/68157854066a24c03b2b5d0be4614da1.jpg",
  "https://i.pinimg.com/1200x/11/05/99/1105998014364c09e07b4d68d58087f8.jpg",
  "https://i.pinimg.com/736x/0f/cd/91/0fcd917fa6081ac6282a4daa83cef68d.jpg",
  "https://i.pinimg.com/1200x/0b/05/96/0b0596fd932a35b129f4acbfb606798c.jpg",
  "https://i.pinimg.com/736x/e2/de/e8/e2dee87ee5f60800ef6cfaacb5f6cb3d.jpg",
  "https://i.pinimg.com/736x/4f/51/93/4f519350d3b65ee2a1d9153d53942ff7.jpg",
];

const slide1 = document.querySelector('.slide-1');
const slide2 = document.querySelector('.slide-2');
const overlay = "linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.62))";

let currentIndex = 0;

if (slide1 && slide2) {
  const setLayer = (el, idx) => {
    el.style.backgroundImage = `${overlay}, url('${heroImages[idx]}')`;
  };

  setLayer(slide1, currentIndex);
  slide1.classList.add('active');
  slide1.classList.remove('hidden');
  slide2.classList.add('hidden');
  slide2.classList.remove('active');

  setInterval(() => {
    const active   = slide1.classList.contains('active') ? slide1 : slide2;
    const standby  = active === slide1 ? slide2 : slide1;

    currentIndex = (currentIndex + 1) % heroImages.length;
    setLayer(standby, currentIndex);

    setTimeout(() => {
      standby.classList.remove('hidden');
      standby.classList.add('active');
      active.classList.remove('active');
      active.classList.add('hidden');
    }, 60);
  }, 4000);
}

/* ── 7. CARD 3D TILT EFFECT (desktop only) ── */
function applyTilt(cards) {
  if (!cards.length || window.matchMedia('(max-width: 768px)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const rotX = dy * -5;
      const rotY = dx * 5;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

applyTilt(document.querySelectorAll('.budaya-card'));
applyTilt(document.querySelectorAll('.card'));

/* ── 8. BUTTON RIPPLE EFFECT ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.4;
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ── 9. BACK TO TOP BUTTON ── */
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 10. SMOOTH ANCHOR NAVIGATION ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── 11. CARD HOVER GLOW (accent border pulse) ── */
document.querySelectorAll('.budaya-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'rgba(245, 158, 11, 0.3)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '';
  });
});

/* ── 12. IMAGE LAZY LOAD (native + fallback) ── */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        lazyObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
}

/* ── 13. KEYBOARD ACCESSIBILITY — close menu on Escape ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks?.classList.contains('open')) {
    navLinks.classList.remove('open');
    menuToggle?.classList.remove('open');
    document.body.style.overflow = '';
  }
});
