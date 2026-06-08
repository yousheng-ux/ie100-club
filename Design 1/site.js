// ===== Hero slideshow (crossfade + Ken Burns) =====
    (function () {
      const slides = Array.from(document.querySelectorAll('#heroSlides .hero-slide'));
      const dotsWrap = document.getElementById('heroDots');
      if (!slides.length) return;

      const INTERVAL = 6000; // ms each slide is visible
      let current = 0;
      let timer = null;

      // build dot indicators (index number + progress track)
      const dots = slides.map((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', '切换到第 ' + (i + 1) + ' 张');
        b.innerHTML = '<span class="track"><span class="fill"></span></span>';
        b.addEventListener('click', () => go(i, true));
        dotsWrap.appendChild(b);
        return b;
      });

      function show(i) {
        slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
        dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
        current = i;
      }
      function next() { show((current + 1) % slides.length); }
      function go(i, manual) {
        show(i);
        if (manual) restart();
      }
      function restart() {
        clearInterval(timer);
        timer = setInterval(next, INTERVAL);
      }

      show(0);
      restart();

      // pause when tab is hidden, resume when visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(timer);
        else restart();
      });
    })();

    // Sticky nav + subtle hero parallax (content drifts up & fades on scroll)
    const header = document.getElementById('header');
    const heroInner = document.querySelector('.hero-inner');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      header.classList.toggle('solid', y > 60);
      if (heroInner && !reduceMotion && y < window.innerHeight) {
        heroInner.style.transform = 'translateY(' + (y * 0.18) + 'px)';
        heroInner.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.7));
      }
      ticking = false;
    }
    onScroll();
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    });

    // Mobile menu
    const menu = document.getElementById('mobileMenu');
    document.getElementById('burger').addEventListener('click', () => menu.classList.add('open'));
    document.getElementById('closeMenu').addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

    // Reveal on scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // ===== Forms (membership / contact) — sample handling, no backend =====
    // In production this would POST to the server / send to the designated mailbox.
    document.querySelectorAll('form[data-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ok = form.querySelector('.form-success');
        if (ok) ok.classList.add('show');
        form.querySelectorAll('input, select, textarea').forEach((el) => {
          if (el.type !== 'submit') el.value = '';
        });
        if (ok) ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    // ===== Events filter tabs =====
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length) {
      const events = document.querySelectorAll('.events-grid .event');
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          const cat = tab.getAttribute('data-cat');
          events.forEach((ev) => {
            const show = cat === 'all' || ev.getAttribute('data-cat') === cat;
            ev.classList.toggle('hide', !show);
          });
        });
      });
    }