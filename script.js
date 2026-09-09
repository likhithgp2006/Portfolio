// LIKHITH G P — FULL-STACK PORTFOLIO JS SCRIPT

document.addEventListener('DOMContentLoaded', () => {
  initNeat3DBg();
  initScrollAnimations();
  initHeroTypewriter();
  initCardTilt();
  initStatsCounter();
  initThemeSwitcher();
  initCliTerminal();
  initNavScroll();
  initCommandPalette();
});

/* -------------------------------------------------------------
 * 1. DYNAMIC HERO TYPEWRITER
 * ------------------------------------------------------------- */
function initHeroTypewriter() {
  const el = document.getElementById('heroTypewriter');
  if (!el) return;

  const roles = [
    "Full-Stack Web & Database Developer",
    "BCA Computer Science Scholar @ St Claret",
    "PHP, MySQL & Supabase Systems Architect",
    "Python, Java & C++ Developer",
    "Real-Time Web Apps & Portal Builder"
  ];

  let roleIdx = 0;
  let charIdx = roles[0].length;
  let isDeleting = true;
  let typingSpeed = 65;

  function typeStep() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      el.textContent = currentRole.substring(0, charIdx);
      typingSpeed = 30;
    } else {
      charIdx++;
      el.textContent = currentRole.substring(0, charIdx);
      typingSpeed = 60;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2200; // Pause when full role is typed
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 350; // Pause before typing next role
    }

    setTimeout(typeStep, typingSpeed);
  }

  setTimeout(typeStep, 1800);
}

/* -------------------------------------------------------------
 * 2. INTERACTIVE 3D PERSPECTIVE CARD TILT
 * ------------------------------------------------------------- */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const maxTilt = 4.5;
      const rotX = -deltaY * maxTilt;
      const rotY = deltaX * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* -------------------------------------------------------------
 * 3. ANIMATED METRIC COUNTERS ON SCROLL
 * ------------------------------------------------------------- */
function initStatsCounter() {
  const statsContainer = document.getElementById('statsGrid');
  if (!statsContainer) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateStats();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsContainer);

  function animateStats() {
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    statNums.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = (target * ease);

        el.textContent = currentVal.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }
}

/* -------------------------------------------------------------
 * 4. MULTI-THEME SWITCHER
 * ------------------------------------------------------------- */
function initThemeSwitcher() {
  const btn = document.getElementById('themeToggleBtn');
  const themes = [
    { id: 'default', name: 'Cyber Cyan' },
    { id: 'cyber-emerald', name: 'Cyber Emerald' },
    { id: 'amber-glow', name: 'Amber Glow' }
  ];

  const savedTheme = localStorage.getItem('likhith_portfolio_theme') || 'default';
  if (savedTheme !== 'default') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'default';
    const currentIdx = themes.findIndex(t => t.id === current);
    const nextTheme = themes[(currentIdx + 1) % themes.length];

    if (nextTheme.id === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', nextTheme.id);
    }

    localStorage.setItem('likhith_portfolio_theme', nextTheme.id);
    showToast(`🎨 Theme switched to ${nextTheme.name}`);

    btn.style.transform = 'rotate(180deg) scale(1.15)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 300);
  });
}

/* -------------------------------------------------------------
 * 2. CURSOR ORB (DISABLED)
 * ------------------------------------------------------------- */
function initCursorOrb() {
  // Cursor animation removed per user request
}

/* -------------------------------------------------------------
 * 3. NEAT 3D CANVAS BACKGROUND (FLOATING POLYGON NODES)
 * ------------------------------------------------------------- */
function initNeat3DBg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.density = (Math.random() * 20) + 1;
  }

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Mouse interaction reaction
    if (mouse.x != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 3;
        this.y -= (dy / dist) * force * 3;
      }
    }
  };

  Particle.prototype.draw = function() {
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };

  function createParticles() {
    particles = [];
    let count = Math.floor((width * height) / 14000);
    for (let i = 0; i < count; i++) {
      let x = Math.random() * width;
      let y = Math.random() * height;
      particles.push(new Particle(x, y));
    }
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          let opacity = 1 - (dist / 110);
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* -------------------------------------------------------------
 * 4. SCROLL REVEAL ANIMATIONS & SCROLL PROGRESS BAR
 * ------------------------------------------------------------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const scrollProgress = document.getElementById('scrollProgress');

  function checkReveal() {
    const triggerBottom = window.innerHeight * 0.88;

    reveals.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('revealed');
      }
    });

    // Update Scroll Progress Bar
    if (scrollProgress) {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    // Nav bar active link highlight
    const sections = document.querySelectorAll('section[id]');
    let currentSec = '';

    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
        currentSec = sec.getAttribute('id');
      }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSec}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Initial check
}

/* -------------------------------------------------------------
 * 5. INTERACTIVE TERMINAL CLI ENGINE (WITH HISTORY & AUTOCOMPLETE)
 * ------------------------------------------------------------- */
function initCliTerminal() {
  const cliInput = document.getElementById('cliInput');
  const cliOutput = document.getElementById('cliOutput');

  if (!cliInput || !cliOutput) return;

  const history = [];
  let historyIdx = -1;

  const commands = {
    help: "Available CLI Commands:\n • help - Display available commands\n • whoami - Show developer summary\n • skills - List technical skill set\n • projects - Display featured web apps\n • edu - View education details\n • leadership - View Rotaract Club leadership & community service\n • certs - Show certifications & honors\n • contact - Get email & phone info\n • resume - Display & download original Resume PDF\n • sudo hire - Unlock recruiter quick action\n • theme - Toggle color themes (Cyan / Emerald / Amber)\n • time - View current Bengaluru IST time\n • stats - Display academic & development statistics\n • socials - View GitHub and LinkedIn links\n • matrix - Trigger matrix stream effect\n • clear - Clear terminal output",
    whoami: "Likhith G P — Full-Stack Developer & BCA Student at St Claret College, Bengaluru.\nBuilding practical web applications with PHP, MySQL, JS, Python, C++, MongoDB, Supabase.",
    skills: "Languages: Python, Java, C++, PHP, JavaScript, HTML5, CSS3\nFrameworks: Bootstrap, Modern Vanilla CSS\nDatabases: MySQL, MongoDB, Supabase\nTools: Git, GitHub, VS Code, XAMPP",
    projects: "1. Smart Parking Slot Finder [HTML5, CSS3, JS, PHP, MySQL, Bootstrap]\n2. Smart Hostel Management System [HTML5, CSS3, JS, PHP, MySQL]",
    edu: "• St Claret College, Bengaluru (BCA 2025-2027) — CGPA: 7.9\n• Sri Sapthagiri PU College, Tumkur (PUC 2022-2024) — 92%\n• Sri Vasavi Vidyalaya (SSLC 2022) — 74%",
    leadership: "Rotaract Club of St. Claret College Autonomous, Bengaluru\n• Role: Secretary (Rotary Year 2026–27)\n• District: Rotary District 3192\n• Effective From: 22 August 2026\n• Focus: Club Administration, Activity Coordination, Community Service & Youth Leadership",
    certs: "• Winter Internship Technical Training (India Space Lab, 2026)\n• Accountant Compulsory Internship (Sri Nidhi Cloth & Jewellers, Nelamangala)\n• Java Programming Fundamentals (Infosys Springboard)\n• Project Management (NPTEL)\n• Emotional Intelligence (NPTEL)\n• Winner — IT Quiz INSPIRE 2024",
    contact: "Email: likhithgps@gmail.com | Phone: +91 6361267643 | GitHub: https://github.com/likhithgp2006 | LinkedIn: https://www.linkedin.com/in/likhith-g-p-334755427",
    resume: "Displaying & downloading Likhith's Resume-hackerresume.pdf...",
    "sudo hire": "ACCESS GRANTED 🚀 Likhith G P is ready for full-stack developer roles! Opening contact form...",
    stats: "BCA CGPA: 7.9 | PUC: 92% | Major Projects: 2+ | Certifications: 4 | Status: Open for Tech Roles",
    socials: "GitHub: https://github.com/likhithgp2006\nLinkedIn: https://www.linkedin.com/in/likhith-g-p-334755427"
  };

  cliInput.addEventListener('keydown', (e) => {
    // Arrow Up / Down command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIdx < history.length - 1) {
        historyIdx++;
        cliInput.value = history[history.length - 1 - historyIdx];
      }
      return;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        cliInput.value = history[history.length - 1 - historyIdx];
      } else if (historyIdx === 0) {
        historyIdx = -1;
        cliInput.value = '';
      }
      return;
    }

    // Tab autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = cliInput.value.trim().toLowerCase();
      if (current) {
        const match = Object.keys(commands).find(c => c.startsWith(current));
        if (match) cliInput.value = match;
      }
      return;
    }

    if (e.key === 'Enter') {
      const cmdText = cliInput.value.trim().toLowerCase();
      cliInput.value = '';
      historyIdx = -1;

      if (!cmdText) return;

      history.push(cmdText);
      appendCliLine(`likhith@portfolio:~$ ${cmdText}`, 'info');

      if (cmdText === 'clear') {
        cliOutput.innerHTML = '';
        return;
      }

      if (cmdText === 'theme') {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) themeBtn.click();
        appendCliLine("Theme toggled successfully.", 'success');
        return;
      }

      if (cmdText === 'time' || cmdText === 'date') {
        const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' });
        appendCliLine(`Current Bengaluru Time: ${now} (IST)`, 'success');
        return;
      }

      if (cmdText === 'matrix') {
        appendCliLine("01001100 01001001 01001011 01001000 01001001 01010100 01001000", 'success');
        showToast("⚡ Matrix stream pulse active!");
        return;
      }

      if (cmdText === 'resume') {
        openResumeModal();
        appendCliLine(commands.resume, 'success');
        return;
      }

      if (cmdText === 'sudo hire') {
        appendCliLine(commands['sudo hire'], 'success');
        navigateSection('#contact');
        return;
      }

      if (commands[cmdText]) {
        appendCliLine(commands[cmdText], 'success');
      } else {
        appendCliLine(`zsh: command not found: ${cmdText}. Type 'help' for options.`, 'error');
      }
    }
  });
}

function appendCliLine(text, type = '') {
  const cliOutput = document.getElementById('cliOutput');
  if (!cliOutput) return;

  const line = document.createElement('div');
  line.className = `cli-line ${type}`;
  line.textContent = text;
  cliOutput.appendChild(line);
  cliOutput.scrollTop = cliOutput.scrollHeight;
}

function runCliCmd(cmd) {
  const cliInput = document.getElementById('cliInput');
  if (cliInput) {
    cliInput.value = cmd;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    cliInput.dispatchEvent(event);
  }
}

/* -------------------------------------------------------------
 * 6. NAVIGATION & MOBILE MENU
 * ------------------------------------------------------------- */
function initNavScroll() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }
}

function navigateSection(selector) {
  const sec = document.querySelector(selector);
  if (sec) {
    sec.scrollIntoView({ behavior: 'smooth' });
  }
}

/* -------------------------------------------------------------
 * 7. SKILLS FILTERING
 * ------------------------------------------------------------- */
function filterSkills(category, btn) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const items = document.querySelectorAll('.skill-item');
  items.forEach(item => {
    const cat = item.getAttribute('data-cat');
    if (category === 'all' || cat === category) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

/* -------------------------------------------------------------
 * 8. ORIGINAL RESUME PDF DISPLAY & DOWNLOAD MODAL
 * ------------------------------------------------------------- */
function openResumeModal() {
  const simModal = document.getElementById('simModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!simModal || !modalBody) return;

  const resumeFile = "Likhith's Resume-hackerresume.pdf";

  modalTitle.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Likhith G P — Resume (HackerResume)`;
  
  modalBody.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
      <div style="font-family:var(--font-mono); font-size:0.88rem; color:var(--text-muted);">
        <i class="fa-solid fa-circle-check" style="color:var(--secondary)"></i> Official Document (${resumeFile})
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <a href="${resumeFile}" download="${resumeFile}" class="btn btn-primary" style="text-decoration:none;">
          <i class="fa-solid fa-download"></i> Download Resume PDF
        </a>
        <a href="${resumeFile}" target="_blank" class="btn btn-outline" style="text-decoration:none;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Fullscreen
        </a>
      </div>
    </div>

    <!-- EMBEDDED ORIGINAL PDF VIEWER -->
    <div style="width:100%; background:#101622; border:1px solid var(--border-color); border-radius:8px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <iframe src="${resumeFile}#toolbar=1" style="width:100%; height:75vh; border:none;" title="Likhith G P Resume PDF">
        <p style="padding: 20px; color: var(--text-main);">Your browser does not support inline PDFs. <a href="${resumeFile}" download="${resumeFile}" style="color: var(--primary)">Click here to download ${resumeFile}</a>.</p>
      </iframe>
    </div>
  `;

  simModal.classList.add('active');
}

function viewCertificateModal(title, issuer, details) {
  const simModal = document.getElementById('simModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!simModal || !modalBody) return;

  modalTitle.innerHTML = `<i class="fa-solid fa-award"></i> Certificate Verification — ${title}`;

  modalBody.innerHTML = `
    <div style="background: var(--bg-card); border: 1px solid var(--primary); border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 15px 40px rgba(0,240,255,0.15);">
      <div style="font-size: 3rem; color: var(--secondary); margin-bottom: 12px;">
        <i class="fa-solid fa-certificate"></i>
      </div>
      <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--secondary); letter-spacing: 2px; text-transform: uppercase;">
        VERIFIED OFFICIAL CERTIFICATE
      </div>
      <h2 style="font-size: 1.6rem; color: var(--text-main); margin: 12px 0 6px 0; font-weight: 800;">
        ${title}
      </h2>
      <div style="font-family: var(--font-mono); color: var(--primary); font-size: 0.95rem; margin-bottom: 20px;">
        Issued by: <strong>${issuer}</strong>
      </div>

      <div style="background: #090d14; border: 1px solid var(--border-color); border-radius: 8px; padding: 18px; text-align: left; font-family: var(--font-mono); font-size: 0.88rem; color: var(--text-muted); margin-bottom: 24px; line-height: 1.7;">
        <div><strong style="color:var(--text-main)">Candidate Name:</strong> Likhith G P</div>
        <div><strong style="color:var(--text-main)">Program Details:</strong> ${details}</div>
        <div><strong style="color:var(--text-main)">Verification ID:</strong> CERT-LGP-${Math.floor(100000 + Math.random() * 900000)}</div>
        <div><strong style="color:var(--text-main)">Status:</strong> <span style="color:var(--secondary)"><i class="fa-solid fa-circle-check"></i> Authenticated & Validated</span></div>
      </div>

      <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
        <a href="Likhith's Resume-hackerresume.pdf" download="Likhith's Resume-hackerresume.pdf" class="btn btn-primary" style="text-decoration:none;">
          <i class="fa-solid fa-download"></i> Download Verified Resume PDF
        </a>
        <button class="btn btn-outline" onclick="closeSimModal()">
          <i class="fa-solid fa-xmark"></i> Close Verification Window
        </button>
      </div>
    </div>
  `;

  simModal.classList.add('active');
}

function viewLeadershipModal() {
  window.open('https://drive.google.com/file/d/1Jehw0mWLHWgx0H5jV7_2Ccu7QDm7OMuJ/view?usp=sharing', '_blank');
}

function closeSimModal() {
  const simModal = document.getElementById('simModal');
  if (simModal) simModal.classList.remove('active');
}

/* -------------------------------------------------------------
 * 9. INTERACTIVE DEMO SIMULATORS (PARKING & HOSTEL)
 * ------------------------------------------------------------- */
function openSimulatorModal(type) {
  const simModal = document.getElementById('simModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!simModal || !modalBody) return;

  if (type === 'parking') {
    modalTitle.innerHTML = `<i class="fa-solid fa-square-parking"></i> Smart Parking Slot Finder — Interactive Demo`;
    
    modalBody.innerHTML = `
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">
        Click any available parking slot to simulate instant real-time slot reservation:
      </p>

      <div class="parking-sim-grid">
        <div class="parking-slot" onclick="toggleSlot(this, 'A-1')"><strong>Slot A-1</strong><br><small>Available</small></div>
        <div class="parking-slot booked"><strong>Slot A-2</strong><br><small>Occupied</small></div>
        <div class="parking-slot" onclick="toggleSlot(this, 'A-3')"><strong>Slot A-3</strong><br><small>Available</small></div>
        <div class="parking-slot" onclick="toggleSlot(this, 'A-4')"><strong>Slot A-4</strong><br><small>Available</small></div>
        <div class="parking-slot booked"><strong>Slot B-1</strong><br><small>Occupied</small></div>
        <div class="parking-slot" onclick="toggleSlot(this, 'B-2')"><strong>Slot B-2</strong><br><small>Available</small></div>
        <div class="parking-slot" onclick="toggleSlot(this, 'B-3')"><strong>Slot B-3</strong><br><small>Available</small></div>
        <div class="parking-slot booked"><strong>Slot B-4</strong><br><small>Occupied</small></div>
      </div>

      <div class="sim-controls">
        <span id="slotStatus">Status: Select a slot to reserve</span>
        <button class="btn btn-primary" onclick="showToast('Parking Slot Confirmed!')" style="padding: 6px 14px; font-size: 0.8rem;">
          Confirm Booking
        </button>
      </div>
    `;
  } else if (type === 'hostel') {
    modalTitle.innerHTML = `<i class="fa-solid fa-hotel"></i> Smart Hostel Management System — Portal Simulator`;

    modalBody.innerHTML = `
      <div class="portal-toggle">
        <button class="portal-btn active" onclick="switchHostelPortal('student', this)">Student Portal</button>
        <button class="portal-btn" onclick="switchHostelPortal('admin', this)">Admin Portal</button>
      </div>

      <div class="hostel-view-box" id="hostelViewContent">
        <div style="color: var(--primary); margin-bottom: 10px;">➜ STUDENT DASHBOARD (Likhith G P)</div>
        <div>Room No: <strong>A-304</strong> | Block: <strong>BCA Boys Block</strong></div>
        <div>Monthly Hostel Fee Status: <span style="color: var(--secondary)">PAID (Rs 6,500)</span></div>
        <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-color)">
          <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="showToast('Leave request submitted to Warden!')">
            <i class="fa-solid fa-paper-plane"></i> Apply for Outing Pass
          </button>
        </div>
      </div>
    `;
  }

  simModal.classList.add('active');
}

function toggleSlot(el, slotName) {
  if (el.classList.contains('booked')) {
    showToast(`Slot ${slotName} is already occupied.`);
    return;
  }
  el.classList.add('booked');
  el.innerHTML = `<strong>${slotName}</strong><br><small>Booked by You</small>`;
  document.getElementById('slotStatus').textContent = `Status: Slot ${slotName} reserved successfully!`;
  showToast(`Reserved ${slotName}!`);
}

function switchHostelPortal(portal, btn) {
  document.querySelectorAll('.portal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const content = document.getElementById('hostelViewContent');
  if (!content) return;

  if (portal === 'student') {
    content.innerHTML = `
      <div style="color: var(--primary); margin-bottom: 10px;">➜ STUDENT DASHBOARD (Likhith G P)</div>
      <div>Room No: <strong>A-304</strong> | Block: <strong>BCA Boys Block</strong></div>
      <div>Monthly Hostel Fee Status: <span style="color: var(--secondary)">PAID (Rs 6,500)</span></div>
      <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-color)">
        <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="showToast('Leave request submitted to Warden!')">
          <i class="fa-solid fa-paper-plane"></i> Apply for Outing Pass
        </button>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div style="color: var(--accent); margin-bottom: 10px;">➜ ADMIN MANAGEMENT DASHBOARD</div>
      <div>Total Registered Students: <strong>142</strong></div>
      <div>Occupied Rooms: <strong>48 / 50</strong></div>
      <div>Pending Maintenance Requests: <strong>2</strong></div>
      <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-color); display:flex; gap:10px;">
        <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="showToast('Room Allocation Processed!')">
          Allocate Room
        </button>
        <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="showToast('Fee Receipt Generated!')">
          Generate Receipt
        </button>
      </div>
    `;
  }
}

/* -------------------------------------------------------------
 * 10. UTILITIES & TOAST NOTIFICATION
 * ------------------------------------------------------------- */
function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg || 'Copied to clipboard!');
  });
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('formName').value;
  showToast(`Thank you, ${name}! Your message has been sent to Likhith G P.`);
  e.target.reset();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function openCommandPalette() {
  const cmdModal = document.getElementById('cmdModal');
  if (cmdModal) cmdModal.classList.add('active');
}

function initCommandPalette() {
  const cmdBtn = document.getElementById('cmdPaletteBtn');
  const cmdModal = document.getElementById('cmdModal');
  const cmdSearch = document.getElementById('cmdSearch');
  const cmdResults = document.getElementById('cmdResults');

  function openPalette() {
    if (!cmdModal) return;
    cmdModal.classList.add('active');
    if (cmdSearch) {
      cmdSearch.value = '';
      filterCmdItems('');
      setTimeout(() => cmdSearch.focus(), 60);
    }
  }

  function closePalette() {
    if (cmdModal) cmdModal.classList.remove('active');
  }

  if (cmdBtn) {
    cmdBtn.addEventListener('click', openPalette);
  }

  if (cmdModal) {
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) {
        closePalette();
      }
    });
  }

  function filterCmdItems(query) {
    if (!cmdResults) return;
    const items = cmdResults.querySelectorAll('.cmd-item');
    const cleanQ = query.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!cleanQ || text.includes(cleanQ)) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    let noResultsEl = cmdResults.querySelector('.cmd-no-results');
    if (visibleCount === 0) {
      if (!noResultsEl) {
        noResultsEl = document.createElement('div');
        noResultsEl.className = 'cmd-no-results';
        noResultsEl.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> No matching commands found';
        cmdResults.appendChild(noResultsEl);
      }
    } else if (noResultsEl) {
      noResultsEl.remove();
    }
  }

  if (cmdSearch) {
    cmdSearch.addEventListener('input', (e) => {
      filterCmdItems(e.target.value);
    });

    cmdSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstVisible = cmdResults ? cmdResults.querySelector('.cmd-item:not(.hidden)') : null;
        if (firstVisible) {
          firstVisible.click();
          closePalette();
        }
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdModal) {
        if (cmdModal.classList.contains('active')) {
          closePalette();
        } else {
          openPalette();
        }
      }
    }
  });
}
