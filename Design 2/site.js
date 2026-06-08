// =====================================================================
// IE100 俱乐部 — Design 2 interactions
// =====================================================================

// ---- Sticky nav: transparent over hero, solid (ivory) on scroll ----
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('solid', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ---- Mobile menu ----
(function () {
  const menu = document.getElementById('mobileMenu');
  const burger = document.getElementById('burger');
  const close = document.getElementById('closeMenu');
  if (!menu || !burger) return;
  burger.addEventListener('click', () => menu.classList.add('open'));
  if (close) close.addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.classList.remove('open')));
})();

// ---- Reveal on scroll ----
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();

// ---- Services accordion (single open; first open by default) ----
(function () {
  const rows = Array.from(document.querySelectorAll('.accordion .acc-row'));
  if (!rows.length) return;
  function open(row) {
    rows.forEach((r) => r.classList.toggle('active', r === row));
  }
  rows.forEach((row) => {
    const head = row.querySelector('.acc-head');
    head.addEventListener('click', () => {
      if (row.classList.contains('active')) {
        row.classList.remove('active'); // allow collapse on re-click
      } else {
        open(row);
      }
    });
  });
  open(rows[0]); // first row expanded initially
})();

// ---- Events filter tabs ----
(function () {
  const tabs = document.querySelectorAll('.tab');
  if (!tabs.length) return;
  const cards = document.querySelectorAll('.ev-grid .ev-card');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-cat');
      cards.forEach((c) => {
        const show = cat === 'all' || c.getAttribute('data-cat') === cat;
        c.classList.toggle('hide', !show);
      });
    });
  });
})();

// ---- Forms (sample, no backend) ----
document.querySelectorAll('form[data-form]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = form.querySelector('.form-success');
    if (ok) { ok.classList.add('show'); ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    form.querySelectorAll('input, select, textarea').forEach((el) => { if (el.type !== 'submit') el.value = ''; });
  });
});
