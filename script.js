/* ============================================================
   MITHAS ICE CREAM — INTERACTIVE JAVASCRIPT
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. ICE CREAM PRELOADER ── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.body.classList.add('preloader-active');
    // Allow the cone-rise + scoop animations to play (≈2.2s total), then fade out
    const preloaderTimeout = setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.remove('preloader-active');
    }, 2400);

    // Also dismiss on click/tap for impatient users
    preloader.addEventListener('click', () => {
      clearTimeout(preloaderTimeout);
      preloader.classList.add('loaded');
      document.body.classList.remove('preloader-active');
    });
  }


  /* ── 1. ACTIVE PAGE NAVIGATION LINK ── */
  const currentPath = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('header nav a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    // Highlight links if they map to the current HTML file
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active-link');
    } else {
      link.classList.remove('active-link');
    }
  });

  /* ── 2. HEADER SCROLL & PROGRESS BAR ── */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');
  const toTop = document.getElementById('toTop');

  window.addEventListener('scroll', () => {
    // Scroll progress bar width calculation
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const pct = (window.scrollY / totalScroll) * 100;
      progressBar.style.width = pct + '%';
    }

    // Header compression toggle
    header.classList.toggle('scrolled', window.scrollY > 30);

    // Show/hide back to top button
    toTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  // Back to top click event
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 3. MOBILE NAVIGATION DRAWER ── */
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  const navCtaMobile = navList.querySelector('.nav-cta-mobile');

  const updateNavForScreenSize = () => {
    const isMobile = window.innerWidth <= 768;
    if (navCtaMobile) {
      navCtaMobile.style.display = isMobile ? 'inline-flex' : 'none';
    }
    if (!isMobile) {
      navList.classList.remove('open');
      menuToggle.classList.remove('active');
    }
  };

  updateNavForScreenSize();
  window.addEventListener('resize', updateNavForScreenSize);

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navList.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  // Close nav when links are clicked
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });

  // Close nav when clicking outside header
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      navList.classList.remove('open');
      menuToggle.classList.remove('active');
    }
  });

  /* ── 4. SCROLL REVEAL ANIMATIONS ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });

  // Stagger delays for children of stagger containers
  document.querySelectorAll('.reveal-stagger').forEach(container => {
    Array.from(container.children).forEach((child, idx) => {
      child.style.transitionDelay = (idx * 0.08) + 's';
    });
  });

  /* ── 5. NUMERICAL COUNTER ANIMATIONS ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const duration = 1200; // Total duration in ms
        const fps = 60;
        const steps = duration / (1000 / fps);
        const increment = target / steps;

        const countTick = () => {
          current += increment;
          if (current >= target) {
            el.textContent = target.toLocaleString();
            return;
          }
          el.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(countTick);
        };
        countTick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(cnt => {
    counterObserver.observe(cnt);
  });

  /* ── 6. HONEY DRIP CURSOR PARTICLES ── */
  const canvas = document.getElementById('drip-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let cw = canvas.width = window.innerWidth;
    let ch = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      cw = canvas.width = window.innerWidth;
      ch = canvas.height = window.innerHeight;
    });

    const isTouch = window.matchMedia('(hover:none)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    let particles = [];
    let lastSpawn = 0;
    const brandColors = [
      '227, 30, 36',   // Brand Red
      '255, 92, 97',   // Light Red
      '46, 49, 146',   // Brand Blue
      '0, 131, 62'     // Brand Green
    ];

    function spawnDrip(x, y) {
      if (particles.length > 50) return;
      const color = brandColors[Math.floor(Math.random() * brandColors.length)];
      const radius = 2.5 + Math.random() * 3.5;
      particles.push({
        x, y,
        vy: 1.0 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.5,
        r: radius,
        life: 1.0,
        color,
        elongation: 1.0 + Math.random() * 1.6
      });
    }

    if (!isTouch && !prefersReducedMotion) {
      window.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastSpawn > 35) {
          spawnDrip(e.clientX, e.clientY);
          lastSpawn = now;
        }
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, cw, ch);
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.life -= 0.018;
        const alpha = Math.max(p.life, 0) * 0.65;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * p.life, p.r * p.life * p.elongation, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${p.color}, ${alpha * 0.4})`;
        ctx.fill();
        ctx.restore();
      });

      particles = particles.filter(p => p.life > 0);
      requestAnimationFrame(animateParticles);
    }

    if (!prefersReducedMotion) {
      animateParticles();
    }
  }

  /* ── 7. HERO PARALLAX MOUSE EFFECT ── */
  const heroSection = document.getElementById('home');
  const heroVisual = document.querySelector('.hero-visual');
  if (heroSection && heroVisual) {
    heroSection.addEventListener('mousemove', (e) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
      heroVisual.style.transform = `translate(${xPercent * 16}px, ${yPercent * 16}px)`;
    }, { passive: true });
  }

  /* ── 8. HERO ORBITING HEXAGON DOTS ── */
  const orbitRing = document.getElementById('orbitRing');
  if (orbitRing) {
    const dotsCount = 6;
    const radius = 180;
    for (let i = 0; i < dotsCount; i++) {
      const angle = (i / dotsCount) * Math.PI * 2;
      const dot = document.createElement('div');
      const size = 8 + Math.random() * 5;
      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: calc(50% + ${Math.cos(angle) * radius}px - ${size / 2}px);
        top: calc(50% + ${Math.sin(angle) * radius}px - ${size / 2}px);
        background: linear-gradient(135deg, var(--primary-light), var(--primary-dark));
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        opacity: ${0.4 + Math.random() * 0.3};
      `;
      orbitRing.appendChild(dot);
    }
  }

  /* ── 9. FLAVOUR MIXER GAME LOGIC ── */
  const scoop = document.getElementById('icecreamScoop');
  const stream = document.getElementById('syrupStream');
  const syrupLayer = document.getElementById('syrupLayer');
  const toppingsDisplay = document.getElementById('toppingsDisplay');
  const drizzleBtn = document.getElementById('mixerDrizzleBtn');
  const creationToast = document.getElementById('creationToast');

  if (drizzleBtn && scoop) {
    let currentBase = 'vanilla';
    let currentSyrup = 'honey';
    let toppingsList = { almond: false, cookie: false };

    // Base selection
    document.querySelectorAll('[data-base]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.parentElement.querySelector('.active').classList.remove('active');
        btn.classList.add('active');

        const baseVal = btn.dataset.base;
        scoop.className = 'icecream-scoop-display';
        scoop.classList.add('scoop-flavour-' + baseVal);
        currentBase = baseVal;

        scoop.innerHTML = '';
        if (baseVal === 'kesarpista') {
          for (let i = 0; i < 8; i++) {
            const nut = document.createElement('div');
            nut.className = 'kesarpista-nut';
            nut.style.left = (20 + Math.random() * 60) + '%';
            nut.style.top = (20 + Math.random() * 50) + '%';
            nut.style.transform = `rotate(${Math.random() * 360}deg)`;
            scoop.appendChild(nut);
          }
          for (let i = 0; i < 4; i++) {
            const saff = document.createElement('div');
            saff.className = 'kesarpista-saffron';
            saff.style.left = (30 + Math.random() * 40) + '%';
            saff.style.top = (15 + Math.random() * 60) + '%';
            saff.style.transform = `rotate(${Math.random() * 90}deg)`;
            scoop.appendChild(saff);
          }
        }
        resetDrizzle();
      });
    });

    // Syrup selection
    document.querySelectorAll('[data-syrup]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.parentElement.querySelector('.active').classList.remove('active');
        btn.classList.add('active');
        currentSyrup = btn.dataset.syrup;
        resetDrizzle();
      });
    });

    // Toppings selection
    document.querySelectorAll('[data-topping]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const topVal = btn.dataset.topping;
        toppingsList[topVal] = btn.classList.contains('active');
        updateToppingsVisual();
      });
    });

    function resetDrizzle() {
      syrupLayer.className = 'syrup-layer-scoop';
      syrupLayer.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
      drizzleBtn.disabled = false;
    }

    function updateToppingsVisual() {
      toppingsDisplay.innerHTML = '';
      if (toppingsList.almond) {
        for (let i = 0; i < 12; i++) {
          const alm = document.createElement('div');
          alm.className = 'almond-shaving visible';
          alm.style.left = (15 + Math.random() * 70) + '%';
          alm.style.top = (10 + Math.random() * 55) + '%';
          alm.style.setProperty('--rot', (Math.random() * 360) + 'deg');
          toppingsDisplay.appendChild(alm);
        }
      }
      if (toppingsList.cookie) {
        for (let i = 0; i < 16; i++) {
          const crb = document.createElement('div');
          crb.className = 'cookie-crumb visible';
          crb.style.left = (12 + Math.random() * 76) + '%';
          crb.style.top = (8 + Math.random() * 60) + '%';
          crb.style.setProperty('--rot', (Math.random() * 360) + 'deg');
          toppingsDisplay.appendChild(crb);
        }
      }
    }

    drizzleBtn.addEventListener('click', () => {
      if (currentSyrup === 'none') {
        triggerSuccessToast();
        return;
      }
      
      drizzleBtn.disabled = true;
      stream.className = 'syrup-stream pour-active stream-' + currentSyrup;
      
      setTimeout(() => {
        syrupLayer.className = 'syrup-layer-scoop drizzle-active syrup-' + currentSyrup;
        const scoopWrapper = document.getElementById('scoopWrapper') || scoop;
        scoopWrapper.style.transform = 'translateY(22px) scale(1.05)';
        setTimeout(() => {
          scoopWrapper.style.transform = 'translateY(15px) scale(1)';
        }, 250);
        stream.className = 'syrup-stream';
        triggerSuccessToast();
      }, 1000);
    });

    function triggerSuccessToast() {
      const baseNames = { vanilla: 'Vanilla', chocolate: 'Chocolate', kesarpista: 'Kesar Pista', mango: 'Mango Ripple' };
      const syrupNames = { honey: 'Raw Honey Drizzle', chocolate: 'Choco Syrup', caramel: 'Caramel Sauce', none: 'No Syrup' };
      let toppingsText = '';
      const selectedTops = Object.keys(toppingsList).filter(k => toppingsList[k]);
      if (selectedTops.length === 1) {
        toppingsText = ' with ' + (selectedTops[0] === 'almond' ? 'Almond flakes' : 'Cookies');
      } else if (selectedTops.length === 2) {
        toppingsText = ' with Almonds & Cookies';
      }

      const description = `${baseNames[currentBase]} Scoop coated in ${syrupNames[currentSyrup]}${toppingsText}!`;
      creationToast.querySelector('.toast-msg').textContent = `Drizzled! ${description}`;
      creationToast.classList.add('show');

      setTimeout(() => {
        creationToast.classList.remove('show');
      }, 4000);
    }
  }

  /* ── 10. ACCORDION CATALOG & FILTER/SEARCH (MENU PAGE) ── */
  const searchInput = document.getElementById('catalogSearch');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const catSections = document.querySelectorAll('.cat-section');

  // Accordion Toggle
  document.querySelectorAll('.cat-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.cat-section');
      const isOpen = section.classList.contains('open');

      // Toggle the section
      section.classList.toggle('open');
      header.setAttribute('aria-expanded', !isOpen);

      // Smooth scroll to opened section on mobile
      if (!isOpen && window.innerWidth <= 768) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    });
  });

  // Tab Filter for Accordion Categories
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.tab-btn.active').classList.remove('active');
      btn.classList.add('active');
      filterAccordionCatalog();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', filterAccordionCatalog);
  }

  function filterAccordionCatalog() {
    const activeTab = document.querySelector('.tab-btn.active');
    const filterCategory = activeTab ? activeTab.dataset.filter : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    catSections.forEach(section => {
      const sectionCat = section.dataset.cat;
      const catItems = section.querySelectorAll('.cat-item');
      let visibleCount = 0;

      // Category-level filter
      const categoryMatch = (filterCategory === 'all' || sectionCat === filterCategory);

      if (!categoryMatch) {
        section.style.display = 'none';
        return;
      }

      section.style.display = '';

      // Item-level search filter
      catItems.forEach(item => {
        const name = item.querySelector('.cat-item-name').textContent.toLowerCase();
        const size = item.querySelector('.cat-item-size').textContent.toLowerCase();
        const badge = item.querySelector('.item-badge');
        const badgeText = badge ? badge.textContent.toLowerCase() : '';

        const searchMatch = (
          searchQuery === '' ||
          name.includes(searchQuery) ||
          size.includes(searchQuery) ||
          badgeText.includes(searchQuery)
        );

        if (searchMatch) {
          item.style.display = '';
          item.style.opacity = '1';
          item.style.transform = '';
          visibleCount++;
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });

      // If no items visible in a section, hide the whole section
      if (visibleCount === 0 && searchQuery !== '') {
        section.style.display = 'none';
      }

      // Auto-open sections that have matching results when searching
      if (searchQuery !== '' && visibleCount > 0) {
        section.classList.add('open');
        section.querySelector('.cat-header').setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Mobile touch ripple effect for product items
  document.querySelectorAll('.cat-item').forEach(item => {
    item.addEventListener('touchstart', () => {
      item.style.transition = 'transform 0.15s ease';
      item.querySelector('.cat-item-img').style.animation = 'itemTapPulse 0.6s ease';
    }, { passive: true });

    item.addEventListener('touchend', () => {
      const imgEl = item.querySelector('.cat-item-img');
      imgEl.style.animation = '';
    }, { passive: true });
  });

  /* ── 11. BULK ORDER & INQUIRY FORM TABS (CONTACT PAGE) ── */
  const formTabBtns = document.querySelectorAll('.form-tab-btn');
  const formPanes = document.querySelectorAll('.form-pane');

  formTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Tab Active Classes
      document.querySelector('.form-tab-btn.active').classList.remove('active');
      btn.classList.add('active');

      // Toggle Display Pane Active Classes
      const targetPaneId = btn.dataset.formTab;
      formPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === targetPaneId);
      });
    });
  });

  /* ── 12. PARLOR FORM INQUIRY SUBMISSIONS (CONTACT PAGE) ── */
  const bookingForm = document.getElementById('bookingForm');
  const partnerForm = document.getElementById('partnerForm');
  const globalToast = document.getElementById('creationToast'); // Reuse toast container

  const handleFormSubmission = (e, formType) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get('name') || 'Guest';

    // Highlight console log
    console.log(`%c [Mithas Inquiry Form] Submitted: ${formType} from ${userName} `, 'background: #E8920A; color: #1A0C00; font-weight: bold; padding: 6px;');

    // Trigger Toast Notification
    if (globalToast) {
      globalToast.querySelector('.toast-msg').textContent = `Inquiry Submitted! Thank you, ${userName}. We will connect shortly.`;
      globalToast.classList.add('show');
      setTimeout(() => {
        globalToast.classList.remove('show');
      }, 5000);
    }

    // Reset Form fields
    e.target.reset();
  };

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => handleFormSubmission(e, 'Bulk Booking Order'));
  }
  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => handleFormSubmission(e, 'Distributorship Inquiry'));
  }

  /* ── 13. DRAGGABLE REEL SCROLLER FALLBACK CONTROLS ── */
  const reelTrack = document.getElementById('reelTrack');
  const reelPrev = document.getElementById('reelPrev');
  const reelNext = document.getElementById('reelNext');

  if (reelTrack && reelPrev && reelNext) {
    reelNext.addEventListener('click', () => {
      reelTrack.scrollBy({ left: 340, behavior: 'smooth' });
    });
    reelPrev.addEventListener('click', () => {
      reelTrack.scrollBy({ left: -340, behavior: 'smooth' });
    });
  }

  /* ── 14. FLOATING ICE CRYSTALS & ICE CREAM ANIMATIONS ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {

    // ── Ice Crystal Layer ──
    const iceLayer = document.createElement('div');
    iceLayer.className = 'ice-layer';
    document.body.appendChild(iceLayer);

    const crystalShapes = ['', 'hex', 'star'];
    const crystalColors = ['ic-sky1','ic-sky2','ic-sky3','ic-sky4','ic-sky5','ic-white'];
    const CRYSTAL_COUNT = 18;

    for (let i = 0; i < CRYSTAL_COUNT; i++) {
      const el = document.createElement('div');
      const shape = crystalShapes[Math.floor(Math.random() * crystalShapes.length)];
      const color = crystalColors[Math.floor(Math.random() * crystalColors.length)];
      const size  = 8 + Math.random() * 20;           // 8–28px
      const dur   = 12 + Math.random() * 22;           // 12–34s
      const delay = -(Math.random() * dur);             // pre-start offset
      const left  = Math.random() * 100;               // 0–100vw

      el.className = `ice-crystal ${shape} ${color}`;
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}vw;
        bottom: -60px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        opacity: 0;
      `;
      iceLayer.appendChild(el);
    }

    // ── Ice Emoji Layer ──
    const emojiLayer = document.createElement('div');
    emojiLayer.className = 'ice-emoji-layer';
    document.body.appendChild(emojiLayer);

    const iceEmojis  = ['🍦','🍧','🍨','🧊','❄️','🍡','🍭','🫐'];
    const EMOJI_COUNT = 10;

    for (let i = 0; i < EMOJI_COUNT; i++) {
      const el    = document.createElement('div');
      const emoji = iceEmojis[Math.floor(Math.random() * iceEmojis.length)];
      const dur   = 16 + Math.random() * 28;
      const delay = -(Math.random() * dur);
      const left  = Math.random() * 96;

      el.className    = 'ice-emoji';
      el.textContent  = emoji;
      el.style.cssText = `
        left: ${left}vw;
        bottom: -60px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        opacity: 0;
      `;
      emojiLayer.appendChild(el);
    }
  }

});
