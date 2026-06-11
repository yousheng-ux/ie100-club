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

    // ===== Forms (membership / contact) — live submission via Web3Forms =====
    document.querySelectorAll('form[data-form]').forEach((form) => {
      form.setAttribute('novalidate', ''); // we handle validation ourselves for clear CN messages
      const ok = form.querySelector('.form-success');
      if (ok && !ok.dataset.successText) ok.dataset.successText = ok.textContent;

      const showMsg = (text, isError) => {
        if (!ok) return;
        ok.textContent = text;
        ok.classList.toggle('error', !!isError);
        ok.classList.add('show');
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };

      // label text for a field (for readable error lists)
      const labelOf = (el) => {
        if (el.closest('.field-check')) return '章程确认（请勾选同意）';
        const f = el.closest('.field');
        const l = f && f.querySelector('label');
        if (!l) return el.name || '必填项';
        return l.textContent.replace('*', '').trim();
      };

      // clear red border as soon as user fixes a field
      form.querySelectorAll('input, select, textarea').forEach((el) => {
        el.addEventListener('input', () => el.classList.remove('invalid'));
        el.addEventListener('change', () => el.classList.remove('invalid'));
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // ---- custom validation with explicit feedback ----
        const invalid = [];
        form.querySelectorAll('input, select, textarea').forEach((el) => {
          if (el.type === 'hidden' || el.type === 'submit' || el.name === 'botcheck') return;
          el.classList.remove('invalid');
          if (!el.checkValidity()) { invalid.push(el); el.classList.add('invalid'); }
        });
        if (invalid.length) {
          const items = invalid.map(labelOf);
          showMsg('✗ 请完善以下栏目后再提交：' + items.join('、'), true);
          invalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          try { invalid[0].focus({ preventScroll: true }); } catch (_) {}
          return;
        }

        // ---- compose payload ----
        // Web3Forms' email template garbles non-ASCII field NAMES (values are fine),
        // so we keep ASCII keys and put a fully Chinese summary into the message body.
        const lines = [];
        form.querySelectorAll('input, select, textarea').forEach((el) => {
          if (el.type === 'hidden' || el.type === 'submit' || el.name === 'botcheck') return;
          if (el.type === 'checkbox') {
            if (el.checked) lines.push('章程确认：已阅读并同意俱乐部章程');
            return;
          }
          const v = (el.value || '').trim();
          if (v) lines.push(labelOf(el) + '：' + v);
        });
        const fd = new FormData();
        ['access_key', 'subject', 'from_name'].forEach((k) => {
          const h = form.querySelector('input[name="' + k + '"]');
          if (h) fd.append(k, h.value);
        });
        const hp = form.querySelector('input[name="botcheck"]');
        if (hp && hp.checked) fd.append('botcheck', 'on'); // honeypot still trips for bots
        const nameEl = form.querySelector('[name="name"]');
        const emailEl = form.querySelector('[name="email"]');
        if (nameEl) fd.append('name', nameEl.value);
        if (emailEl) fd.append('email', emailEl.value); // keeps Reply-To = applicant
        fd.append('message', lines.join('\n'));

        // ---- parallel: record application to Google Sheet (fire-and-forget) ----
        // Only membership applications (identified by the gender field) are archived.
        if (form.querySelector('[name="gender"]')) {
          try {
            const record = { source: '官网入会表单' };
            form.querySelectorAll('input, select, textarea').forEach((el) => {
              if (el.type === 'hidden' || el.type === 'submit' || el.name === 'botcheck' || !el.name) return;
              if (el.type === 'checkbox') record[el.name] = el.checked;
              else record[el.name] = (el.value || '').trim();
            });
            fetch('https://script.google.com/macros/s/AKfycbwUAd7m9GZDytnIKpFFofNhWeoUw7k8xR8bVytp6awfKM-fz-JFxzMh6petlzTu4q6gaw/exec', {
              method: 'POST',
              mode: 'no-cors', // Apps Script doesn't send CORS headers; opaque response is fine
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(record),
            }).catch(function () {});
          } catch (_) {}
        }

        // ---- submit ----
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = '提交中…'; }
        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: fd,
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message || 'submit failed');
          showMsg(ok ? ok.dataset.successText : '', false);
          // reset visible fields only — keep hidden Web3Forms fields intact
          form.querySelectorAll('input, select, textarea').forEach((el) => {
            if (el.type === 'hidden' || el.type === 'submit') return;
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
            else el.value = '';
          });
        } catch (err) {
          showMsg('✗ 提交失败，请稍后重试，或直接发送电邮至 1796734768@qq.com', true);
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
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