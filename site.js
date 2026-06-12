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

        // ---- gather whitelisted field values (no secrets, no direct DB write) ----
        const formType = form.querySelector('[name="gender"]') ? 'membership' : 'contact';
        const fields = {};
        let agree = false;
        form.querySelectorAll('input, select, textarea').forEach((el) => {
          if (el.type === 'hidden' || el.type === 'submit' || !el.name || el.name === 'botcheck') return;
          if (el.type === 'checkbox') { if (el.name === 'agree') agree = el.checked; return; }
          const v = (el.value || '').trim();
          if (v) fields[el.name] = v;
        });
        const hpEl = form.querySelector('input[name="botcheck"]');
        const website = hpEl && hpEl.checked ? '1' : ''; // honeypot

        // Turnstile token, if a widget is mounted on this form
        let turnstileToken = '';
        try { if (window.turnstile && form.__tsWidget != null) turnstileToken = window.turnstile.getResponse(form.__tsWidget) || ''; } catch (_) {}

        const CFG = window.IE100_SUPABASE || {};
        const endpoint = (CFG.url && CFG.url.indexOf('YOUR-PROJECT') === -1)
          ? CFG.url.replace(/\/$/, '') + '/functions/v1/submit-application' : '';

        // ---- submit through the gated Edge Function (Turnstile + validation + fan-out server-side) ----
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = '提交中…'; }
        try {
          if (!endpoint) throw new Error('未配置提交服务');
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: CFG.anonKey, Authorization: 'Bearer ' + CFG.anonKey },
            body: JSON.stringify({ formType, fields, agree, website, turnstileToken }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok) {
            const map = { verification: '人机验证未通过，请重试。', rate: '提交过于频繁，请稍后再试。', origin: '来源校验失败。' };
            throw new Error((data && map[data.error]) || '提交失败');
          }
          showMsg(ok ? ok.dataset.successText : '', false);
          form.querySelectorAll('input, select, textarea').forEach((el) => {
            if (el.type === 'hidden' || el.type === 'submit') return;
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
            else el.value = '';
          });
          try { if (window.turnstile && form.__tsWidget != null) window.turnstile.reset(form.__tsWidget); } catch (_) {}
        } catch (err) {
          const m = (err && err.message && err.message !== '提交失败') ? err.message : '提交失败，请稍后重试，或直接发送电邮至 1796734768@qq.com';
          showMsg('✗ ' + m, true);
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
      });
    });

    // ===== Cloudflare Turnstile — render a managed widget on each form =====
    // Invoked by the Turnstile api.js (loaded with ?onload=ie100Turnstile&render=explicit).
    // No-op until a real site key is set in supabase-config.js.
    window.ie100Turnstile = function () {
      const key = window.IE100_TURNSTILE_SITEKEY;
      if (!window.turnstile || !key || key.indexOf('YOUR-') === 0) return;
      document.querySelectorAll('form[data-form]').forEach(function (form) {
        const mount = form.querySelector('.ts-mount');
        if (!mount || form.__tsWidget != null) return;
        try { form.__tsWidget = window.turnstile.render(mount, { sitekey: key }); } catch (_) {}
      });
    };

    // ===== Events filter tabs =====
    // The tab filter is owned by content.js (it rebuilds the events grid from
    // Supabase, so the binding must query fresh nodes on each click). Intentionally
    // not bound here to avoid stale-node handlers after a rebuild.