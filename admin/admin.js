// ===== IE100 admin portal (Alpine component) =====
/* global Alpine, supabase, window */
function adminApp() {
  return {
    // ---- config / auth ----
    configured: false,
    sb: null,
    session: null,
    email: '', password: '', authError: '', loading: false,
    pw: { open: false, a: '', b: '', msg: '' },
    recovery: false,
    forgotMsg: '',

    // ---- ui ----
    tab: 'applications',
    toast: '',
    saving: false,
    dirty: false,
    open: {},
    curPage: 'index',

    // ---- data ----
    registry: { pages: [] },
    model: {},
    forms: { membership: { fields: {} }, contact: { fields: {} } },
    catLabels: {},
    applications: [], appSearch: '', appFilter: '',
    appDetail: null,
    events: [],
    mediaFiles: [], uploading: false, uploadFolder: 'general',
    usedUrls: new Set(),
    originalImages: [],
    picker: { open: false, target: null },

    // ---------------------------------------------------------
    init() {
      var CFG = window.IE100_SUPABASE || {};
      this.configured = !!(CFG.url && CFG.url.indexOf('YOUR-PROJECT') === -1 &&
                           CFG.anonKey && CFG.anonKey.indexOf('YOUR-') === -1);
      if (!this.configured) return;
      this.sb = supabase.createClient(CFG.url, CFG.anonKey);

      this.registry = window.IE100_REGISTRY || { pages: [] };
      this.forms = JSON.parse(JSON.stringify(window.IE100_FORMS_DEFAULT || this.forms));
      this.catLabels = Object.assign({}, this.registry.eventCategoryLabels);
      var imgs = []; for (var i = 1; i <= 25; i++) imgs.push('KV%20Image/FTU%20Image/Image' + i + '.jpg');
      this.originalImages = imgs;
      // default-open all accordion sections
      var self = this;
      this.registry.pages.forEach(function (p) { p.sections.forEach(function (_, si) { self.open[p.id + si] = true; }); });

      this.sb.auth.getSession().then(function (r) {
        self.session = r.data.session;
        if (self.session) self.afterLogin();
      });
      this.sb.auth.onAuthStateChange(function (_e, s) {
        self.session = s;
        if (_e === 'PASSWORD_RECOVERY') self.recovery = true; // arrived via reset-email link
      });
    },

    get userEmail() { return this.session && this.session.user ? this.session.user.email : ''; },

    afterLogin() {
      this.buildModel(null);
      this.loadDoc();
      this.loadApplications();
      this.startIdleWatch();
    },

    startIdleWatch() {
      var self = this;
      var IDLE_MS = 20 * 60 * 1000; // auto sign-out after 20 min of inactivity
      var reset = function () {
        if (self._idleTimer) clearTimeout(self._idleTimer);
        self._idleTimer = setTimeout(function () {
          if (self.session) { self.flash('因长时间未操作，已自动退出登录'); self.logout(); }
        }, IDLE_MS);
      };
      if (!self._idleBound) {
        self._idleBound = true;
        ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(function (ev) {
          window.addEventListener(ev, reset, { passive: true });
        });
      }
      reset();
    },

    async login() {
      this.loading = true; this.authError = '';
      var { error } = await this.sb.auth.signInWithPassword({ email: this.email.trim(), password: this.password });
      this.loading = false;
      if (error) { this.authError = '登录失败：' + (error.message || '请检查邮箱与密码'); return; }
      this.password = '';
      this.afterLogin();
    },
    async logout() { await this.sb.auth.signOut(); this.session = null; },

    // ---- password management ----
    async forgotPassword() {
      if (!this.email.trim()) { this.forgotMsg = '请先在上方填写邮箱，再点击找回密码'; return; }
      var redirect = window.location.href.split('#')[0];
      var { error } = await this.sb.auth.resetPasswordForEmail(this.email.trim(), { redirectTo: redirect });
      this.forgotMsg = error ? ('发送失败：' + error.message) : '✓ 重置邮件已发送，请到邮箱点击链接后回到本页设置新密码';
    },
    async changePassword() {
      this.pw.msg = '';
      if ((this.pw.a || '').length < 6) { this.pw.msg = '密码至少 6 位'; return; }
      if (this.pw.a !== this.pw.b) { this.pw.msg = '两次输入的密码不一致'; return; }
      var { error } = await this.sb.auth.updateUser({ password: this.pw.a });
      if (error) { this.pw.msg = '修改失败：' + error.message; return; }
      this.pw.a = ''; this.pw.b = ''; this.pw.open = false; this.flash('✓ 密码已修改');
    },
    async setNewPassword() {
      this.pw.msg = '';
      if ((this.pw.a || '').length < 6) { this.pw.msg = '密码至少 6 位'; return; }
      if (this.pw.a !== this.pw.b) { this.pw.msg = '两次输入的密码不一致'; return; }
      var { error } = await this.sb.auth.updateUser({ password: this.pw.a });
      if (error) { this.pw.msg = '设置失败：' + error.message; return; }
      this.pw.a = ''; this.pw.b = ''; this.recovery = false;
      this.flash('✓ 新密码已设置，请使用新密码登录');
    },

    go(t) {
      this.tab = t;
      if (t === 'events' && !this.events.length) this.loadEvents();
      if (t === 'media' && !this.mediaFiles.length) this.loadMedia();
    },
    tabTitle() {
      return { applications: '入会申请', content: '内容编辑', events: '活动管理', media: '图片库', forms: '表单设置' }[this.tab] || '';
    },
    toggle(k) { this.open[k] = !this.open[k]; },
    flash(m) { var self = this; this.toast = m; setTimeout(function () { if (self.toast === m) self.toast = ''; }, 2600); },

    // ---------------------------------------------------------
    // CONTENT
    // ---------------------------------------------------------
    buildModel(doc) {
      var m = {}; var self = this;
      this.registry.pages.forEach(function (p) {
        p.sections.forEach(function (sec) {
          sec.fields.forEach(function (f) {
            var v = doc ? doc[f.key] : undefined;
            if (f.type === 'rich') m[f.key] = (v && typeof v === 'object' && v.html != null) ? v.html : (typeof v === 'string' ? v : f.value);
            else m[f.key] = (v != null && typeof v !== 'object') ? v : f.value;
          });
        });
      });
      this.model = m;
    },
    async loadDoc(reset) {
      var self = this;
      var { data, error } = await this.sb.from('site_content').select('doc').eq('id', 1).maybeSingle();
      if (error) { this.flash('读取内容失败'); return; }
      var doc = (data && data.doc) || null;
      this.buildModel(doc);
      if (doc && doc.forms) this.forms = this.mergeForms(doc.forms);
      if (doc && doc.events && doc.events.categoryLabels) this.catLabels = doc.events.categoryLabels;
      this.dirty = false;
      this.computeUsed();
      if (reset) this.flash('已恢复到已保存的内容');
    },
    mergeForms(saved) {
      // overlay saved wording onto the default structure so new fields never disappear
      var base = JSON.parse(JSON.stringify(window.IE100_FORMS_DEFAULT));
      ['membership', 'contact'].forEach(function (fk) {
        if (!saved[fk] || !saved[fk].fields) return;
        Object.keys(base[fk].fields).forEach(function (name) {
          if (saved[fk].fields[name]) Object.assign(base[fk].fields[name], saved[fk].fields[name]);
        });
      });
      return base;
    },
    async saveDoc() {
      this.saving = true;
      var doc = {}; var self = this;
      this.registry.pages.forEach(function (p) {
        p.sections.forEach(function (sec) {
          sec.fields.forEach(function (f) {
            doc[f.key] = f.type === 'rich' ? { html: self.cleanRich(self.model[f.key] || '') } : (self.model[f.key] != null ? self.model[f.key] : '');
          });
        });
      });
      doc.forms = this.forms;
      doc.events = { categoryLabels: this.catLabels };
      var { error } = await this.sb.from('site_content').upsert({ id: 1, doc: doc, updated_at: new Date().toISOString() });
      this.saving = false;
      if (error) { this.flash('保存失败：' + error.message); return; }
      this.dirty = false; this.computeUsed();
      this.flash('✓ 已保存并发布，网站已更新');
    },
    cleanRich(html) {
      var cfg = { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'span', 'cite'], ALLOWED_ATTR: ['class'], FORBID_ATTR: ['style'], ALLOW_DATA_ATTR: false };
      return (window.DOMPurify && window.DOMPurify.sanitize) ? window.DOMPurify.sanitize(String(html || ''), cfg) : String(html || '').replace(/<[^>]*>/g, '');
    },
    preview(v) {
      if (!v) return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64"><rect width="96" height="64" fill="%23eee"/></svg>';
      return /^https?:\/\//.test(v) ? v : '../' + v;
    },
    rich(ev, kind) {
      var tb = ev.target.closest('.rt-toolbar');
      var editor = tb.parentElement.querySelector('.rt-edit');
      editor.focus();
      if (kind === 'strong') document.execCommand('bold');
      else if (kind === 'br') document.execCommand('insertHTML', false, '<br>');
      else if (kind === 'p') document.execCommand('formatBlock', false, 'p');
      else if (kind === 'muted') {
        var sel = window.getSelection().toString();
        document.execCommand('insertHTML', false, '<span class="muted">' + sel.replace(/</g, '&lt;') + '</span>');
      }
      editor.dispatchEvent(new Event('input'));
    },

    // ---------------------------------------------------------
    // IMAGE PICKER
    // ---------------------------------------------------------
    openPicker(target) { this.picker = { open: true, target: target }; if (!this.mediaFiles.length) this.loadMedia(); },
    choose(url) {
      var t = this.picker.target;
      if (t && t.indexOf('__event__') === 0) {
        var id = t.slice('__event__'.length);
        var e = this.events.find(function (x) { return String(x.id) === id; });
        if (e) e.image_url = url;
      } else if (t) { this.model[t] = url; this.dirty = true; }
      this.picker.open = false;
    },
    async uploadForPicker(ev) {
      var url = await this.doUpload(ev.target.files[0], this.uploadFolder);
      if (url) this.choose(url);
    },

    // ---------------------------------------------------------
    // MEDIA
    // ---------------------------------------------------------
    async loadMedia() {
      var folders = ['banners', 'events', 'team', 'general'];
      var out = []; var self = this;
      for (var i = 0; i < folders.length; i++) {
        var { data } = await this.sb.storage.from('media').list(folders[i], { limit: 200 });
        (data || []).forEach(function (f) {
          if (f.id === null && !f.name) return;
          var path = folders[i] + '/' + f.name;
          var url = self.sb.storage.from('media').getPublicUrl(path).data.publicUrl;
          out.push({ name: f.name, path: path, url: url });
        });
      }
      this.mediaFiles = out;
      this.computeUsed();
    },
    slug(name) {
      var dot = name.lastIndexOf('.'); var ext = dot > -1 ? name.slice(dot).toLowerCase() : '';
      var base = (dot > -1 ? name.slice(0, dot) : name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'img';
      return base + '-' + Date.now() + ext;
    },
    async isRealImage(file) {
      // verify by magic bytes, not the (spoofable) MIME/extension — blocks disguised SVG/HTML/scripts
      try {
        var buf = new Uint8Array(await file.slice(0, 12).arrayBuffer());
        var hex = Array.from(buf.slice(0, 4)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
        if (hex.indexOf('ffd8ff') === 0) return true;  // JPEG
        if (hex === '89504e47') return true;            // PNG
        if (hex === '47494638') return true;            // GIF
        if (hex === '52494646') return String.fromCharCode.apply(null, buf.slice(8, 12)) === 'WEBP'; // RIFF + WEBP
        return false;
      } catch (e) { return false; }
    },
    async doUpload(file, folder) {
      if (!file) return null;
      if (!(await this.isRealImage(file))) { this.flash('文件不是有效的图片（仅支持 JPG / PNG / WebP / GIF）'); return null; }
      this.uploading = true;
      var path = (folder || 'general') + '/' + this.slug(file.name);
      var { error } = await this.sb.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false });
      this.uploading = false;
      if (error) { this.flash('上传失败：' + error.message); return null; }
      var url = this.sb.storage.from('media').getPublicUrl(path).data.publicUrl;
      this.mediaFiles.unshift({ name: path.split('/').pop(), path: path, url: url });
      this.flash('✓ 上传成功');
      return url;
    },
    async uploadMedia(ev) {
      var files = Array.from(ev.target.files || []);
      for (var i = 0; i < files.length; i++) await this.doUpload(files[i], this.uploadFolder);
      ev.target.value = '';
    },
    async deleteMedia(m) {
      if (this.usedUrls.has(m.url)) { this.flash('该图片正在使用，不能删除'); return; }
      if (!confirm('确定删除图片：' + m.name + ' ？')) return;
      var { error } = await this.sb.storage.from('media').remove([m.path]);
      if (error) { this.flash('删除失败'); return; }
      this.mediaFiles = this.mediaFiles.filter(function (x) { return x.path !== m.path; });
      this.flash('已删除');
    },
    computeUsed() {
      var s = new Set(); var self = this;
      this.registry.pages.forEach(function (p) {
        p.sections.forEach(function (sec) {
          sec.fields.forEach(function (f) { if (f.type === 'image' && self.model[f.key]) s.add(self.model[f.key]); });
        });
      });
      this.events.forEach(function (e) { if (e.image_url) s.add(e.image_url); });
      this.usedUrls = s;
    },
    copy(url) { navigator.clipboard && navigator.clipboard.writeText(url); this.flash('已复制链接'); },
    fileName(u) { try { return decodeURIComponent(u.split('/').pop()); } catch (e) { return u; } },

    // ---------------------------------------------------------
    // APPLICATIONS
    // ---------------------------------------------------------
    async loadApplications() {
      var { data, error } = await this.sb.from('applications').select('*').order('created_at', { ascending: false });
      if (error) { this.flash('读取申请失败'); return; }
      this.applications = data || [];
    },
    filteredApps() {
      var q = this.appSearch.trim().toLowerCase(); var f = this.appFilter; var self = this;
      return this.applications.filter(function (a) {
        if (f && a.status !== f) return false;
        if (!q) return true;
        return [a.name, a.email, a.company, a.wechat].some(function (x) { return (x || '').toLowerCase().indexOf(q) > -1; });
      });
    },
    async setStatus(a, v) { a.status = v; await this.sb.from('applications').update({ status: v }).eq('id', a.id); this.flash('状态已更新'); },
    async setNotes(a, v) { a.notes = v; await this.sb.from('applications').update({ notes: v }).eq('id', a.id); this.flash('备注已保存'); },
    async deleteApp(a) {
      if (!confirm('确定删除这条申请记录？（不可恢复）')) return;
      await this.sb.from('applications').delete().eq('id', a.id);
      this.applications = this.applications.filter(function (x) { return x.id !== a.id; });
      this.flash('已删除');
    },
    viewApp(a) { this.appDetail = a; },
    appRows(a) {
      var L = (this.forms.membership && this.forms.membership.fields) || {};
      var order = ['name', 'gender', 'email', 'wechat', 'company', 'companyWebsite', 'companyAddress', 'businessScope', 'referrer', 'secretaryName', 'secretaryPhone', 'secretaryEmail', 'secretaryWechat'];
      var rows = [['提交时间', this.fmtDate(a.created_at)]];
      order.forEach(function (k) { if (a[k]) rows.push([(L[k] && L[k].label) || k, a[k]]); });
      rows.push(['同意章程', a.agree ? '是' : '否']);
      if (a.extra && Object.keys(a.extra).length) rows.push(['其他', JSON.stringify(a.extra)]);
      return rows;
    },
    fmtDate(s) { try { return new Date(s).toLocaleString('zh-CN', { hour12: false }); } catch (e) { return s || ''; } },
    exportCSV() {
      var L = (this.forms.membership && this.forms.membership.fields) || {};
      var cols = ['created_at', 'status', 'name', 'gender', 'email', 'wechat', 'company', 'companyWebsite', 'companyAddress', 'businessScope', 'referrer', 'secretaryName', 'secretaryPhone', 'secretaryEmail', 'secretaryWechat', 'notes'];
      var head = cols.map(function (c) { return c === 'created_at' ? '提交时间' : c === 'status' ? '状态' : c === 'notes' ? '备注' : ((L[c] && L[c].label) || c); });
      var esc = function (v) { v = (v == null ? '' : String(v)).replace(/"/g, '""'); return '"' + v + '"'; };
      var lines = [head.map(esc).join(',')];
      this.filteredApps().forEach(function (a) {
        lines.push(cols.map(function (c) { return esc(c === 'created_at' ? a.created_at : a[c]); }).join(','));
      });
      var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      var u = URL.createObjectURL(blob); var link = document.createElement('a');
      link.href = u; link.download = 'IE100-入会申请.csv'; link.click(); URL.revokeObjectURL(u);
    },

    // ---------------------------------------------------------
    // EVENTS
    // ---------------------------------------------------------
    async loadEvents() {
      var { data, error } = await this.sb.from('events').select('*').order('sort_order', { ascending: true });
      if (error) { this.flash('读取活动失败'); return; }
      this.events = data || [];
      this.computeUsed();
    },
    newEvent() {
      this.events.push({ id: 'new-' + Date.now(), category: 'annual', title: '新活动', status: 'upcoming', location: '', date_label: '', summary: '', image_url: '', detail_url: '', featured: false, sort_order: (this.events.length + 1), published: true, _new: true });
    },
    async saveEvent(e) {
      var row = { category: e.category, title: e.title, status: e.status, location: e.location, date_label: e.date_label, summary: e.summary, image_url: e.image_url, detail_url: e.detail_url || null, featured: !!e.featured, sort_order: e.sort_order || 0, published: !!e.published };
      if (e._new) {
        var { data, error } = await this.sb.from('events').insert(row).select().single();
        if (error) { this.flash('保存失败：' + error.message); return; }
        Object.assign(e, data); delete e._new;
      } else {
        var { error: er2 } = await this.sb.from('events').update(row).eq('id', e.id);
        if (er2) { this.flash('保存失败：' + er2.message); return; }
      }
      this.computeUsed();
      this.flash('✓ 活动已保存');
    },
    async deleteEvent(e) {
      if (!confirm('确定删除活动：' + (e.title || '') + ' ？')) return;
      if (!e._new) await this.sb.from('events').delete().eq('id', e.id);
      this.events = this.events.filter(function (x) { return x !== e; });
      this.flash('已删除');
    },
    async seedEvents() {
      if (!confirm('将网站当前的活动导入数据库？（仅在活动为空时使用一次）')) return;
      var seed = (window.IE100_EVENTS_SEED || []).map(function (s) { return Object.assign({}, s); });
      var { error } = await this.sb.from('events').insert(seed);
      if (error) { this.flash('初始化失败：' + error.message); return; }
      this.loadEvents();
      this.flash('✓ 已初始化活动');
    },
  };
}
window.adminApp = adminApp;
