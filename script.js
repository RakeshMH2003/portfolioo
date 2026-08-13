/* =================================================
   RAKESH M H — PORTFOLIO JAVASCRIPT
   script.js — All interactivity, animations, effects
================================================= */

'use strict';

/* ══════════════════════════════════════════
   1. MATRIX RAIN CANVAS
══════════════════════════════════════════ */
(function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF!@#$%^&*';
  let cols, drops, fontSize;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    fontSize = 13;
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -canvas.height / fontSize));
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(7, 9, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00d9ff';
    ctx.font      = `${fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.globalAlpha = Math.random() * 0.7 + 0.3;
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      ctx.globalAlpha = 1;

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  let animId;
  function loop() { draw(); animId = requestAnimationFrame(loop); }
  loop();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(animId); }
    else { loop(); }
  });
})();


/* ══════════════════════════════════════════
   2. TYPED TEXT ANIMATION
══════════════════════════════════════════ */
(function initTypedText() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const roles = [
    'Cybersecurity Student',
    'OSINT Developer',
    'Security Researcher',
    'Building Secure Systems',
    'CTF Enthusiast',
    'Full-Stack Developer',
    'Ethical Hacker',
  ];

  let roleIdx   = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;
  const SPEED_TYPE   = 80;
  const SPEED_DELETE = 45;
  const PAUSE_AFTER  = 2200;
  const PAUSE_BEFORE = 350;

  function type() {
    if (paused) return;
    const current = roles[roleIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; setTimeout(type, SPEED_DELETE); }, PAUSE_AFTER);
        return;
      }
      setTimeout(type, SPEED_TYPE);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        paused = true;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(() => { paused = false; setTimeout(type, SPEED_TYPE); }, PAUSE_BEFORE);
        return;
      }
      setTimeout(type, SPEED_DELETE);
    }
  }

  setTimeout(type, 800);
})();


/* ══════════════════════════════════════════
   3. HERO GLITCH EFFECT (on load, once)
══════════════════════════════════════════ */
(function initGlitch() {
  const el = document.querySelector('.glitch');
  if (!el) return;

  // Trigger once after slight delay
  setTimeout(() => {
    el.classList.add('play-glitch');
    setTimeout(() => el.classList.remove('play-glitch'), 500);
  }, 600);
})();


/* ══════════════════════════════════════════
   4. NUMBER COUNTER ANIMATION
══════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  const duration = 1600;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const start  = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();


/* ══════════════════════════════════════════
   5. LIVE PING COUNTER
══════════════════════════════════════════ */
(function initPing() {
  const el = document.getElementById('ping-val');
  if (!el) return;

  function randomPing() {
    const base = 15 + Math.random() * 10;
    el.textContent = Math.round(base);
    setTimeout(randomPing, 2800 + Math.random() * 1600);
  }
  setTimeout(randomPing, 3000);
})();


/* ══════════════════════════════════════════
   6. NAVBAR — scroll + active section
══════════════════════════════════════════ */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-links');
  const links   = document.querySelectorAll('.nav-link[data-section]');

  // Scroll class
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 40) navbar.classList.add('scrolled');
    else        navbar.classList.remove('scrolled');
    lastY = y;
  }, { passive: true });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click (mobile)
  navList.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 68;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: `-${navHeight}px 0px -60% 0px`, threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));
})();


/* ══════════════════════════════════════════
   7. SCROLL-IN ANIMATIONS (Intersection Observer)
══════════════════════════════════════════ */
(function initScrollAnimations() {
  const animTargets = document.querySelectorAll(
    '.section-header, .about-grid > *, .skill-category, .project-card, .cert-card, .contact-grid > *'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animTargets.forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════
   8. BACK TO TOP BUTTON
══════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ══════════════════════════════════════════
   9. CONTACT FORM — Client-side validation
══════════════════════════════════════════ */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  if (!form) return;
  const submitBtn  = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success');

  function validate(id, errorId, condition, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!condition(input.value)) {
      error.textContent = message;
      input.style.borderColor = '#ff5252';
      return false;
    }
    error.textContent = '';
    input.style.borderColor = '';
    return true;
  }

  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.addEventListener('input', () => {
      error.textContent = '';
      input.style.borderColor = '';
    }, { once: true });
  }

  // Bind live clear
  [
    ['form-name',    'name-error'],
    ['form-email',   'email-error'],
    ['form-subject', 'subject-error'],
    ['form-message', 'message-error'],
  ].forEach(([inp, err]) => clearError(inp, err));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validName    = validate('form-name',    'name-error',    v => v.trim().length >= 2,          'Please enter your name (min 2 chars).');
    const validEmail   = validate('form-email',   'email-error',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), 'Please enter a valid email address.');
    const validSubject = validate('form-subject', 'subject-error', v => v.trim().length >= 3,          'Subject must be at least 3 characters.');
    const validMessage = validate('form-message', 'message-error', v => v.trim().length >= 10,         'Message must be at least 10 characters.');

    if (!validName || !validEmail || !validSubject || !validMessage) return;

    // Animate button
    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Transmitting...';

    // Simulate network (replace with actual form handler like Formspree)
    await new Promise(r => setTimeout(r, 1400));

    form.reset();
    submitBtn.disabled = false;
    if (btnText) btnText.textContent = 'Send Message';

    // Show success
    successMsg.hidden = false;
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { successMsg.hidden = true; }, 6000);
  });
})();


/* ══════════════════════════════════════════
   10. SMOOTH SCROLL for all hash links
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ══════════════════════════════════════════
   11. SKILL TAG PULSE ON HOVER
══════════════════════════════════════════ */
(function initSkillInteraction() {
  const tags = document.querySelectorAll('.skill-tag');
  tags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'scale(1.06)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
    });
  });
})();


/* ══════════════════════════════════════════
   12. PROJECT CARD — TILT EFFECT (desktop)
══════════════════════════════════════════ */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const cards = document.querySelectorAll('.project-card, .cert-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();


/* ══════════════════════════════════════════
   13. FOOTER YEAR & RANDOM SECURITY TIP
══════════════════════════════════════════ */
(function initFooter() {
  const tips = [
    'Stay curious. Stay secure.',
    'Every system has a weakness. Find it first.',
    'Security through obscurity is not security.',
    'Trust no input. Validate everything.',
    'Defence in depth. Always.',
    'Encrypt at rest. Encrypt in transit.',
    'Patch early. Patch often.',
  ];
  const tagline = document.querySelector('.footer-tagline');
  if (!tagline) return;
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const span = tagline.querySelector('.cursor-blink');
  tagline.childNodes[0].textContent = '';
  // Replace the text node
  tagline.innerHTML = `<span class="prompt">&gt;</span> ${tip} <span class="cursor-blink" aria-hidden="true">_</span>`;
})();


/* ══════════════════════════════════════════
   14. KEYBOARD SHORTCUT: '/' focus search nav
══════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  // Press 'T' to scroll to top
  if (e.key === 'T' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});


/* ══════════════════════════════════════════
   15. TERMINAL WINDOW TYPING SIMULATION in About
══════════════════════════════════════════ */
(function initAboutTerminal() {
  const promptLine = document.querySelector('.about-bio .prompt-line');
  if (!promptLine) return;

  const originalText = 'whoami';
  const promptSpan   = promptLine.querySelector('.prompt');
  promptLine.innerHTML = '';
  promptLine.appendChild(promptSpan);

  const textNode = document.createTextNode('');
  promptLine.appendChild(textNode);

  let i = 0;
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      io.disconnect();
      setTimeout(() => {
        const interval = setInterval(() => {
          textNode.nodeValue = ' ' + originalText.slice(0, ++i);
          if (i >= originalText.length) clearInterval(interval);
        }, 90);
      }, 300);
    }
  }, { threshold: 0.8 });
  io.observe(promptLine);
})();


/* ══════════════════════════════════════════
   16. NEON GLOW TRAIL on mouse (desktop)
══════════════════════════════════════════ */
(function initGlowTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,217,255,0.7), transparent);
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease, opacity 0.3s ease;
    opacity: 0;
    transform: translate(-50%,-50%);
  `;
  document.body.appendChild(dot);

  let mx = 0, my = 0, ox = 0, oy = 0;
  let animating = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.opacity = '1';
    if (!animating) {
      animating = true;
      requestAnimationFrame(moveDot);
    }
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });

  function moveDot() {
    ox += (mx - ox) * 0.18;
    oy += (my - oy) * 0.18;
    dot.style.left = ox + 'px';
    dot.style.top  = oy + 'px';

    if (Math.abs(mx - ox) > 0.5 || Math.abs(my - oy) > 0.5) {
      requestAnimationFrame(moveDot);
    } else {
      animating = false;
    }
  }
})();


/* ══════════════════════════════════════════
   17. INIT LOG (console easter egg)
══════════════════════════════════════════ */
(function consoleEasterEgg() {
  const style1 = 'color: #00d9ff; font-family: monospace; font-size: 14px; font-weight: bold;';
  const style2 = 'color: #8899aa; font-family: monospace; font-size: 11px;';
  const style3 = 'color: #00d9ff; font-family: monospace; font-size: 12px;';

  console.log('%c╔══════════════════════════════════════════╗', style1);
  console.log('%c║   RAKESH M H — CYBERSECURITY PORTFOLIO  ║', style1);
  console.log('%c╚══════════════════════════════════════════╝', style1);
  console.log('%c> Built with ❤️  Vanilla HTML/CSS/JS', style2);
  console.log('%c> Looking for cybersecurity opportunities!', style2);
  console.log('%c> rakeshmh13@gmail.com', style3);
  console.log('%c> github.com/RakeshMH2003', style3);
  console.log('%c> linkedin.com/in/rakesh-m-h/', style3);
  console.log('%c\n[ Curious minds are welcome here 🔐 ]\n', style1);
})();


/* ══════════════════════════════════════════
   18. BOOT SCREEN
══════════════════════════════════════════ */
(function initBootScreen() {
  const screen = document.getElementById('boot-screen');
  const lines  = document.getElementById('boot-lines');
  const bar    = document.getElementById('boot-bar');
  if (!screen || !lines || !bar) return;

  const bootLog = [
    { text: '> Initializing kernel modules...', cls: 'info', delay: 0 },
    { text: '> Loading cryptographic libraries... [OK]', cls: 'ok', delay: 350 },
    { text: '> Starting matrix subsystem...', cls: 'info', delay: 650 },
    { text: '> Checking network interfaces... [OK]', cls: 'ok', delay: 900 },
    { text: '> Mounting secure vault... [OK]', cls: 'ok', delay: 1150 },
    { text: '> WARNING: High entropy detected', cls: 'warn', delay: 1400 },
    { text: '> Bypassing firewall... [OK]', cls: 'ok', delay: 1650 },
    { text: '> Running OSINT scan... [OK]', cls: 'ok', delay: 1900 },
    { text: '> Portfolio ready. Welcome, Rakesh.', cls: 'ok', delay: 2200 },
  ];

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    bar.style.width = '100%';
    setTimeout(() => screen.classList.add('hidden'), 400);
  }

  document.addEventListener('keydown', dismiss, { once: true });
  screen.addEventListener('click', dismiss, { once: true });

  bootLog.forEach(({ text, cls, delay }, idx) => {
    setTimeout(() => {
      if (dismissed) return;
      const el = document.createElement('span');
      el.textContent = text;
      el.className = cls;
      lines.appendChild(el);
      bar.style.width = (((idx + 1) / bootLog.length) * 100) + '%';
    }, delay);
  });

  setTimeout(dismiss, 2800);
})();


/* ══════════════════════════════════════════
   19. PROJECT MODAL
══════════════════════════════════════════ */
(function initProjectModal() {
  const modal     = document.getElementById('project-modal');
  const backdrop  = document.getElementById('modal-backdrop');
  const closeBtn  = document.getElementById('modal-close');
  const titleEl   = document.getElementById('modal-proj-title');
  const taglineEl = document.getElementById('modal-tagline');
  const outputEl  = document.getElementById('modal-output');
  const actionsEl = document.getElementById('modal-actions');
  if (!modal) return;

  const projects = {
    proj1: {
      title: '🛡️ QuantumVault',
      tagline: 'Military-Grade Quantum Cryptographic Security Platform',
      desc: `> PROJECT: QuantumVault\n> STATUS:  Live Production\n> STACK:   Python · Flask · AES-256 · RSA · Quantum Crypto · JS\n\nA cutting-edge cryptographic vault implementing quantum-resistant\nencryption algorithms alongside classical AES-256 and RSA.\n\nFEATURES:\n  ▸ Secure key generation & encrypted data storage\n  ▸ Real-time key management dashboard\n  ▸ Terminal-style UI for cryptographic operations\n  ▸ Quantum-resistant algorithm research integration`,
      demo: 'https://quantum-vault-sepia.vercel.app/',
      github: 'https://github.com/RakeshMH2003/QuantumVault.git',
    },
    proj2: {
      title: '🚗 DriveEase',
      tagline: 'Premium Car Rental Platform',
      desc: `> PROJECT: DriveEase\n> STATUS:  Live Production\n> STACK:   Node.js · Express.js · MongoDB · JavaScript · HTML/CSS\n\nA full-stack premium car rental web application.\n\nFEATURES:\n  ▸ Intuitive booking system with real-time availability\n  ▸ Vehicle catalogue with category filtering (SUVs, Sedans, Sports)\n  ▸ User authentication & session management\n  ▸ Responsive admin dashboard for fleet management`,
      demo: 'https://driverace-car.onrender.com',
      github: 'https://github.com/RakeshMH2003/Driverace-car.git',
    },
    proj3: {
      title: '🔍 Web Vulnerability Dashboard',
      tagline: 'Full-Stack Web Security Scanner Dashboard',
      desc: `> PROJECT: Web Vulnerability Dashboard\n> STATUS:  Live (GitHub Pages)\n> STACK:   JavaScript · HTML/CSS · OWASP · XSS · SQL Injection\n\nA comprehensive web security scanner auditing sites for\ncommon vulnerabilities.\n\nFEATURES:\n  ▸ XSS, SQL Injection, CSRF, insecure header detection\n  ▸ Severity classification: Critical / High / Medium / Low\n  ▸ Interactive charts & visual dashboards\n  ▸ Actionable remediation suggestions`,
      demo: 'https://rakeshmh2003.github.io/web-vuln-dashboard/',
      github: 'https://github.com/RakeshMH2003/web-vuln-dashboard.git',
    },
    proj4: {
      title: '🌿 Smart Plant Monitoring',
      tagline: 'IoT Plant Health Monitor with Instant Email Alerts',
      desc: `> PROJECT: Smart Plant Monitoring System\n> STATUS:  Live (GitHub Pages)\n> STACK:   Raspberry Pi · Python · IoT Sensors · SMTP · HTML/CSS/JS\n\nAn IoT solution built on Raspberry Pi monitoring plant health\nmetrics in real-time.\n\nFEATURES:\n  ▸ Monitors soil moisture, temperature, humidity & light\n  ▸ Instant email alerts on threshold breaches\n  ▸ Live web dashboard with historical sensor charts\n  ▸ GPIO sensor integration with Raspberry Pi 2`,
      demo: 'https://rakeshmh2003.github.io/smart-Plant-Monitoring-System-using-Raspberry-Pi-2/',
      github: 'https://github.com/RakeshMH2003/smart-Plant-Monitoring-System-using-Raspberry-Pi-2.git',
    },
    proj5: {
      title: '📡 NRF24L01 Wireless Simulator',
      tagline: 'Browser-Based 2.4GHz Wireless Module Simulator',
      desc: `> PROJECT: NRF24L01 Wireless Communication Simulator\n> STATUS:  Live (GitHub Pages)\n> STACK:   JavaScript · Web Serial API · Arduino · NRF24L01\n\nA browser-based simulator and real-hardware bridge for the\nNRF24L01 2.4GHz wireless module.\n\nFEATURES:\n  ▸ Visualizes packet flow, RSSI signal strength & ACK/NOACK\n  ▸ Interactive wiring diagrams\n  ▸ Works entirely in-browser (no hardware required)\n  ▸ Connects live to real Arduino boards via Web Serial API`,
      demo: 'https://rakeshmh2003.github.io/NRF24L01-WIRELESS-Communication-with-Aurdino-Bord/',
      github: 'https://github.com/RakeshMH2003/NRF24L01-WIRELESS-Communication-with-Aurdino-Bord',
    },
  };

  let typeTimer = null;

  function typeText(el, text, speed) {
    el.textContent = '';
    let i = 0;
    clearInterval(typeTimer);
    typeTimer = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(typeTimer);
    }, speed || 10);
  }

  function openModal(id) {
    const p = projects[id];
    if (!p) return;
    titleEl.textContent   = p.title;
    taglineEl.textContent = '$ ' + p.tagline;
    outputEl.textContent  = '';
    actionsEl.innerHTML   = `
      <a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="modal-btn-primary">&#128279; Live Demo</a>
      <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="modal-btn-ghost">&#128197; Source Code</a>`;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => typeText(outputEl, p.desc, 9), 80);
    closeBtn.focus();
  }

  function closeModal() {
    clearInterval(typeTimer);
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card[data-modal]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      openModal(card.dataset.modal);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.modal); }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
})();


/* ══════════════════════════════════════════
   20. MOUSE TRAIL (desktop only)
══════════════════════════════════════════ */
(function initMouseTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const canvas = document.getElementById('mouse-trail');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const TRAIL = 28;
  const pts   = [];
  let raf;

  window.addEventListener('mousemove', (e) => {
    pts.push({ x: e.clientX, y: e.clientY });
    if (pts.length > TRAIL) pts.shift();
    if (!raf) raf = requestAnimationFrame(draw);
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (pts.length < 2) { raf = null; return; }
    for (let i = 1; i < pts.length; i++) {
      const t = i / pts.length;
      ctx.beginPath();
      ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
      ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(0,217,255,${t * 0.55})`;
      ctx.lineWidth   = t * 2.5;
      ctx.lineCap     = 'round';
      ctx.shadowColor = '#00d9ff';
      ctx.shadowBlur  = 10;
      ctx.stroke();
    }
    const h = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(h.x, h.y, 3, 0, Math.PI * 2);
    ctx.fillStyle  = '#00d9ff';
    ctx.shadowBlur = 16;
    ctx.fill();
    raf = requestAnimationFrame(draw);
  }
})();


/* ══════════════════════════════════════════
   21. HERO GLITCH HOVER
══════════════════════════════════════════ */
(function initGlitchHover() {
  const hero = document.querySelector('.hero-name.glitch');
  if (!hero) return;
  setTimeout(() => {
    hero.classList.add('glitch-active');
    setTimeout(() => hero.classList.remove('glitch-active'), 500);
  }, 3300);
  hero.addEventListener('mouseenter', () => {
    hero.classList.add('glitch-active');
    setTimeout(() => hero.classList.remove('glitch-active'), 450);
  });
})();




