// ===== 企业参访 (Company Visits) — list on visits.html =====
// Add one entry per published visit, newest first. The featured visit is the cover
// (hard-coded in visits.html); the filter bar + list only appear once there are
// LIST_MIN visits, so the page never shows a lonely filter or a "1 篇" count.
//
// ind must be one of INDUSTRIES; reg is the region label shown on cards/filters.
(function () {
  var VISITS = [
    {
      href: 'visit-black-sesame.html',
      title: 'IE100会员企业参访系列之走进黑芝麻智能科技',
      company: '黑芝麻智能科技',
      host: '徐劲博士 · 黑芝麻智能科技（新加坡）总经理',
      ind: '科技创新',
      reg: '',
      date: '9月18日',
      img: 'Event%20Photos/企业参访/visit-3-web.jpg',
      featured: true
    }
  ];

  var INDUSTRIES = ['制造工业', '地产建筑', '金融投资', '科技创新', '消费品牌', '医疗健康', '贸易物流', '酒店文旅', '教育培训', '专业服务'];
  var LIST_MIN = 6;

  var root = document.getElementById('visitList');
  if (!root || VISITS.length < LIST_MIN) return;

  var early = document.querySelector('.visit-early');
  if (early) early.hidden = true;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function uniq(a) { return a.filter(function (v, i) { return v && a.indexOf(v) === i; }); }
  function tags(v) { return [v.ind, v.reg].filter(Boolean).map(esc).join(' · '); }

  // only industries / regions that already have a visit get a filter
  var inds = INDUSTRIES.filter(function (n) { return VISITS.some(function (v) { return v.ind === n; }); });
  var regs = uniq(VISITS.map(function (v) { return v.reg; }));

  root.innerHTML =
    '<div class="visit-tools">' +
      '<div class="visit-chips" role="group" aria-label="按行业筛选">' +
        '<button type="button" class="visit-chip" aria-pressed="true" data-ind="">全部行业</button>' +
        inds.map(function (n) { return '<button type="button" class="visit-chip" aria-pressed="false" data-ind="' + esc(n) + '">' + esc(n) + '</button>'; }).join('') +
      '</div>' +
      '<div class="row">' +
        '<span class="visit-status" id="visitStatus"></span>' +
        '<div class="right">' +
          (regs.length > 1 ? '<label class="sr-only" for="visitRegion">按地区筛选</label><select class="visit-select" id="visitRegion"><option value="">全部地区</option>' +
            regs.map(function (r) { return '<option value="' + esc(r) + '">' + esc(r) + '</option>'; }).join('') + '</select>' : '') +
          '<div class="visit-views" role="group" aria-label="显示方式">' +
            '<button type="button" data-view="grid" aria-pressed="true">画册</button>' +
            '<button type="button" data-view="list" aria-pressed="false">名录</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="visitResults"></div>';

  var state = { ind: '', reg: '', view: 'grid' };
  try { var saved = localStorage.getItem('ie100_visit_view'); if (saved === 'grid' || saved === 'list') state.view = saved; } catch (e) {}

  function card(v) {
    return '<article class="visit-card"><a class="media" href="' + esc(v.href) + '"><img src="' + esc(v.img) + '" alt="' + esc(v.company) + '" loading="lazy" /></a>' +
      '<span class="cat">' + tags(v) + '</span>' +
      '<h3><a href="' + esc(v.href) + '">' + esc(v.title) + '</a></h3>' +
      '<span class="who">' + esc(v.company) + (v.host ? ' · ' + esc(v.host) : '') + '</span></article>';
  }
  function row(v) {
    return '<tr><td class="co"><a href="' + esc(v.href) + '">' + esc(v.company) + '</a></td><td>' + esc(v.title) + '</td><td>' + esc(v.ind) + '</td><td>' + esc(v.reg) + '</td><td>' + esc(v.date) + '</td></tr>';
  }
  function render() {
    var filtered = state.ind || state.reg;
    var rows = VISITS.filter(function (v) {
      return (!state.ind || v.ind === state.ind) && (!state.reg || v.reg === state.reg);
    });
    // the featured visit is already the cover above; keep it out of the unfiltered list
    if (!filtered) rows = rows.filter(function (v) { return !v.featured; });
    document.getElementById('visitStatus').innerHTML = filtered
      ? '筛选：<b>' + [state.ind, state.reg].filter(Boolean).map(esc).join(' · ') + '</b>'
      : '按参访时间排列';
    var out = document.getElementById('visitResults');
    if (!rows.length) { out.innerHTML = '<p class="visit-empty">这个组合暂时没有参访，换一个行业或地区看看。</p>'; return; }
    out.innerHTML = state.view === 'grid'
      ? '<div class="visit-grid">' + rows.map(card).join('') + '</div>'
      : '<div class="visit-ledger-wrap"><table class="visit-ledger"><thead><tr><th>企业</th><th>标题</th><th>行业</th><th>地区</th><th>日期</th></tr></thead><tbody>' + rows.map(row).join('') + '</tbody></table></div>';
  }

  root.addEventListener('click', function (e) {
    var chip = e.target.closest('.visit-chip');
    if (chip) {
      state.ind = chip.getAttribute('data-ind');
      root.querySelectorAll('.visit-chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      render();
      return;
    }
    var vb = e.target.closest('.visit-views button');
    if (vb) {
      state.view = vb.getAttribute('data-view');
      try { localStorage.setItem('ie100_visit_view', state.view); } catch (err) {}
      root.querySelectorAll('.visit-views button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === vb)); });
      render();
    }
  });
  var sel = document.getElementById('visitRegion');
  if (sel) sel.addEventListener('change', function () { state.reg = sel.value; render(); });
  root.querySelectorAll('.visit-views button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === state.view)); });

  root.hidden = false;
  render();
})();
