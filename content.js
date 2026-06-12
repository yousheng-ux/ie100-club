// ===== IE100 · public-site content hydration =====
// Reads editable content from Supabase and overrides tagged DOM nodes.
// The hardcoded HTML stays as the fallback: if Supabase is unreachable or
// not yet configured, nothing breaks and the committed content shows.
// Tagging conventions:
//   data-cms="key"       -> plain text  (newlines become <br>)
//   data-cms-html="key"  -> rich text   (sanitized: p/br/strong/b/em/span/cite)
//   data-cms-img="key"   -> <img> src, or background-image on other elements
// Events grids (.events-grid) are rebuilt from the `events` table.
// Load this in <head>, before site.js.
(function () {
  'use strict';

  var CFG = window.IE100_SUPABASE || {};
  var READY = !!(CFG.url && CFG.url.indexOf('YOUR-PROJECT') === -1 &&
                 CFG.anonKey && CFG.anonKey.indexOf('YOUR-') === -1);
  var DOC_CACHE = 'ie100_doc_v1';
  var EV_CACHE  = 'ie100_events_v1';
  var CAT_LABELS = { annual: '年度大会', quarterly: '季度交流会', visit: '企业走访', retreat: '领袖研修' };
  var catLabels = null; // overridden from doc.events.categoryLabels

  // ---------------------------------------------------------------
  // rich-text sanitizer — DOMPurify (vendored, loaded before this file).
  // Allowlist: p/br/strong/b/em/span/cite + class only. NO style attribute.
  // Falls back to plain-text stripping if the library failed to load.
  // ---------------------------------------------------------------
  var PURIFY_CFG = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'span', 'cite'],
    ALLOWED_ATTR: ['class'],
    FORBID_ATTR: ['style'],
    ALLOW_DATA_ATTR: false,
  };
  function sanitize(html) {
    var s = String(html == null ? '' : html);
    if (window.DOMPurify && window.DOMPurify.sanitize) return window.DOMPurify.sanitize(s, PURIFY_CFG);
    var d = document.createElement('div'); // hard fallback: strip everything to text
    d.textContent = s.replace(/<[^>]*>/g, '');
    return d.innerHTML;
  }

  // ---------------------------------------------------------------
  // apply a content doc to the DOM
  // ---------------------------------------------------------------
  function setPlain(el, value) {
    value = String(value);
    if (value.indexOf('\n') === -1) { el.textContent = value; return; }
    el.textContent = '';
    var parts = value.split('\n');
    parts.forEach(function (p, i) {
      el.appendChild(document.createTextNode(p));
      if (i < parts.length - 1) el.appendChild(document.createElement('br'));
    });
  }

  function applyDoc(doc) {
    if (!doc) return;
    catLabels = (doc.events && doc.events.categoryLabels) || null;

    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var key = el.getAttribute('data-cms');
      var v = doc[key];
      if (v == null || typeof v === 'object') return;
      setPlain(el, v);
    });

    document.querySelectorAll('[data-cms-html]').forEach(function (el) {
      var v = doc[el.getAttribute('data-cms-html')];
      if (v && typeof v === 'object' && typeof v.html === 'string') el.innerHTML = sanitize(v.html);
      else if (typeof v === 'string') el.innerHTML = sanitize(v);
    });

    document.querySelectorAll('[data-cms-img]').forEach(function (el) {
      var v = doc[el.getAttribute('data-cms-img')];
      if (!v || typeof v !== 'string') return;
      if (el.tagName === 'IMG') el.src = v;
      else el.style.backgroundImage = 'url("' + v.replace(/"/g, '%22') + '")';
    });

    applyForms(doc.forms);
  }

  // ---------------------------------------------------------------
  // form wording (label / placeholder / options / required) — structure stays static
  // ---------------------------------------------------------------
  function applyForms(forms) {
    if (!forms) return;
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      var which = form.querySelector('[name="gender"]') ? 'membership' : 'contact';
      var cfg = forms[which];
      if (!cfg || !cfg.fields) return;
      Object.keys(cfg.fields).forEach(function (name) {
        var f = cfg.fields[name] || {};
        var el = form.querySelector('[name="' + name.replace(/"/g, '') + '"]');
        if (!el) return;
        var field = el.closest('.field');
        if (f.label && field) {
          var label = field.querySelector('label');
          if (label) {
            var req = label.querySelector('.req');
            label.textContent = f.label + (req ? ' ' : '');
            if (req) label.appendChild(req);
          }
        }
        if (f.placeholder != null && 'placeholder' in el) el.placeholder = f.placeholder;
        if (typeof f.required === 'boolean') el.required = f.required;
        if (el.tagName === 'SELECT' && Array.isArray(f.options) && f.options.length) {
          var keepEmpty = el.querySelector('option[value=""]');
          el.innerHTML = '';
          if (keepEmpty) el.appendChild(keepEmpty);
          f.options.forEach(function (opt) {
            var o = document.createElement('option');
            o.textContent = opt;
            el.appendChild(o);
          });
        }
      });
    });
  }

  // ---------------------------------------------------------------
  // events rendering
  // ---------------------------------------------------------------
  function labelFor(cat) { return (catLabels && catLabels[cat]) || CAT_LABELS[cat] || cat || ''; }

  function buildCard(r, isFull) {
    var art = document.createElement('article');
    art.className = 'event reveal in';
    art.setAttribute('data-cat', r.category || '');

    var media = document.createElement('div'); media.className = 'media';
    var img = document.createElement('img');
    img.src = r.image_url || ''; img.alt = labelFor(r.category); img.loading = 'lazy';
    media.appendChild(img);

    var body = document.createElement('div'); body.className = 'event-body';
    body.appendChild(make('span', 'cat', labelFor(r.category)));
    body.appendChild(make('h3', '', r.title || ''));
    var metaText = [r.status === 'past' ? '回顾' : '预告', r.location, r.date_label].filter(Boolean).join(' · ');
    body.appendChild(make('p', 'meta', metaText));
    body.appendChild(make('p', '', r.summary || ''));
    var a = document.createElement('a'); a.className = 'learn';
    a.href = isFull ? (r.detail_url || '#') : 'events.html';
    a.textContent = '查看详情';
    body.appendChild(a);

    art.appendChild(media); art.appendChild(body);
    return art;
  }
  function make(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  function renderEvents(rows) {
    var grid = document.querySelector('.events-grid');
    if (!grid || !rows || !rows.length) return; // keep fallback HTML on empty
    var isFull = !!document.querySelector('.tabs .tab');
    var list = rows.slice();
    if (!isFull) {
      var feat = list.filter(function (r) { return r.featured; });
      list = (feat.length ? feat : list).slice(0, 4);
    }
    grid.innerHTML = '';
    list.forEach(function (r) { grid.appendChild(buildCard(r, isFull)); });
  }

  // tab filter — owned here (moved out of site.js) so it works after a rebuild.
  function bindTabs() {
    var tabs = document.querySelectorAll('.tabs .tab');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      if (tab.__ie100Bound) return;
      tab.__ie100Bound = true;
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.getAttribute('data-cat');
        document.querySelectorAll('.events-grid .event').forEach(function (ev) {
          var show = cat === 'all' || ev.getAttribute('data-cat') === cat;
          ev.classList.toggle('hide', !show);
        });
      });
    });
  }

  // ---------------------------------------------------------------
  // fetch + cache
  // ---------------------------------------------------------------
  function rest(path) {
    return fetch(CFG.url + '/rest/v1/' + path, {
      headers: { apikey: CFG.anonKey, Authorization: 'Bearer ' + CFG.anonKey }
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }
  function readCache(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function writeCache(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function start() {
    bindTabs();
    var needEvents = !!document.querySelector('.events-grid');

    // 1) apply last-known content immediately (reduces flash for repeat visitors)
    var cachedDoc = readCache(DOC_CACHE);
    if (cachedDoc) applyDoc(cachedDoc);
    if (needEvents) { var ce = readCache(EV_CACHE); if (ce) renderEvents(ce); }

    if (!READY) return;

    // 2) revalidate from Supabase
    rest('site_content?id=eq.1&select=doc,updated_at').then(function (rows) {
      var doc = rows && rows[0] && rows[0].doc;
      if (doc) { writeCache(DOC_CACHE, doc); applyDoc(doc); }
    }).catch(function () {});

    if (needEvents) {
      rest('events?published=eq.true&order=sort_order.asc,created_at.asc&select=*').then(function (rows) {
        if (Array.isArray(rows)) { writeCache(EV_CACHE, rows); renderEvents(rows); }
      }).catch(function () {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
