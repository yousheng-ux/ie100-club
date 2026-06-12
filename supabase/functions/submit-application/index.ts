// IE100 · submit-application Edge Function (Deno)
// Single gated ingestion endpoint for the public membership + contact forms.
// Flow: CORS allowlist -> size guard -> honeypot -> Turnstile verify ->
//       per-IP rate limit -> strict field validation -> fan out to
//       Supabase (membership only) + email (Web3Forms) + Google Sheet (membership only).
//
// Secrets to set (Supabase → Edge Functions → submit-application → Secrets):
//   TURNSTILE_SECRET   Cloudflare Turnstile secret key (if unset, verification is skipped — DEV ONLY)
//   WEB3FORMS_KEY      Web3Forms access key (server-side email)
//   APPS_SCRIPT_URL    Google Apps Script exec URL (chairman's Sheet)
//   ALLOWED_ORIGINS    comma list, e.g. "https://ie100.example,https://<user>.github.io"
// Auto-provided by the platform: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET") || "";
const WEB3FORMS_KEY = Deno.env.get("WEB3FORMS_KEY") || "";
const APPS_SCRIPT_URL = Deno.env.get("APPS_SCRIPT_URL") || "";
const APPS_SCRIPT_TOKEN = Deno.env.get("APPS_SCRIPT_TOKEN") || ""; // shared secret the Apps Script verifies
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "")
  .split(",").map((s) => s.trim()).filter(Boolean);
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// rate limits
const HOURLY_LIMIT = 5;          // per IP
const DAILY_LIMIT = 20;          // per IP
const GLOBAL_HOURLY_LIMIT = 60;  // circuit breaker across ALL IPs (bounds spoofed-IP abuse)
// Turnstile is fail-closed: if no secret is set the request is rejected, UNLESS
// DEV_SKIP_TURNSTILE=true is explicitly set (local testing only).
const DEV_SKIP_TURNSTILE = (Deno.env.get("DEV_SKIP_TURNSTILE") || "") === "true";

// allowed fields per form (whitelist — anything else is dropped)
const MEMBERSHIP_FIELDS = [
  "name", "gender", "email", "wechat", "company", "companyWebsite",
  "companyAddress", "businessScope", "referrer", "secretaryName",
  "secretaryPhone", "secretaryEmail", "secretaryWechat",
];
const CONTACT_FIELDS = ["name", "company", "email", "phone", "topic", "message"];
const LABELS: Record<string, string> = {
  name: "姓名", gender: "性别", email: "电邮", wechat: "微信号", company: "公司名称",
  companyWebsite: "公司网址", companyAddress: "公司地址", businessScope: "公司生意范围",
  referrer: "推荐会员姓名", secretaryName: "秘书姓名", secretaryPhone: "秘书电话",
  secretaryEmail: "秘书电邮", secretaryWechat: "秘书微信号", phone: "联系电话",
  topic: "咨询主题", message: "留言内容",
};
const MAX_LEN: Record<string, number> = { businessScope: 2000, message: 4000 };
const DEFAULT_MAX = 300;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cors(origin: string | null) {
  const ok = origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin));
  return {
    "Access-Control-Allow-Origin": ok ? origin! : (ALLOWED_ORIGINS[0] || "null"),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Vary": "Origin",
  };
}
const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...cors(origin) } });

// Best-available client IP. cf-connecting-ip is trustworthy behind Cloudflare;
// x-forwarded-for is client-spoofable without a trusted proxy, so the GLOBAL
// circuit breaker (not just per-IP) is what actually bounds spoofed-IP abuse
// until Cloudflare fronts the domain and cf-connecting-ip becomes reliable.
function clientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = (req.headers.get("x-forwarded-for") || "").split(",").map((s) => s.trim()).filter(Boolean);
  return xff[0] || "";
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return DEV_SKIP_TURNSTILE; // fail-closed unless explicitly allowed for local dev
  if (!token) return false;
  const form = new FormData();
  form.append("secret", TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const d = await r.json();
    return !!d.success;
  } catch { return false; }
}

// PostgREST helpers using the service role (server-side only)
function sbHeaders(extra: Record<string, string> = {}) {
  return { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}`, "content-type": "application/json", ...extra };
}
// count rows matching a PostgREST filter without pulling them (uses Content-Range)
async function countSince(filter: string): Promise<number> {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rate_limits?${filter}&select=id`, { headers: sbHeaders({ Prefer: "count=exact", Range: "0-0" }) });
    const cr = r.headers.get("content-range") || "";
    const total = cr.split("/")[1];
    return total ? parseInt(total, 10) : 0;
  } catch { return 0; }
}
async function rateLimited(ip: string): Promise<boolean> {
  const hourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
  // 1) global circuit breaker — caps total submissions/hour even if IPs are spoofed
  if (await countSince(`created_at=gte.${hourAgo}`) >= GLOBAL_HOURLY_LIMIT) return true;
  // 2) per-IP limits (reliable once cf-connecting-ip is available behind Cloudflare)
  if (ip) {
    const dayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    if (await countSince(`ip=eq.${encodeURIComponent(ip)}&created_at=gte.${hourAgo}`) >= HOURLY_LIMIT) return true;
    if (await countSince(`ip=eq.${encodeURIComponent(ip)}&created_at=gte.${dayAgo}`) >= DAILY_LIMIT) return true;
  }
  await fetch(`${SB_URL}/rest/v1/rate_limits`, { method: "POST", headers: sbHeaders({ Prefer: "return=minimal" }), body: JSON.stringify({ ip: ip || null }) });
  return false;
}

function clean(fields: Record<string, unknown>, allow: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of allow) {
    const raw = fields[k];
    if (raw == null) continue;
    let v = String(raw).trim();
    if (!v) continue;
    const max = MAX_LEN[k] || DEFAULT_MAX;
    if (v.length > max) v = v.slice(0, max);
    out[k] = v;
  }
  return out;
}
function summary(rec: Record<string, string>, agree: boolean) {
  const lines = Object.keys(rec).map((k) => `${LABELS[k] || k}：${rec[k]}`);
  if (agree) lines.push("章程确认：已阅读并同意俱乐部章程");
  return lines.join("\n");
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "method" }, 405, origin);
  if (ALLOWED_ORIGINS.length && (!origin || !ALLOWED_ORIGINS.includes(origin))) return json({ error: "origin" }, 403, origin);

  const raw = await req.text();
  if (raw.length > 16000) return json({ error: "too large" }, 413, origin);
  let body: any;
  try { body = JSON.parse(raw); } catch { return json({ error: "bad json" }, 400, origin); }

  if (body.website) return json({ ok: true }, 200, origin); // honeypot filled -> pretend success
  const formType = body.formType === "contact" ? "contact" : "membership";
  const ip = clientIp(req);

  if (!(await verifyTurnstile(String(body.turnstileToken || ""), ip))) return json({ error: "verification" }, 403, origin);
  if (await rateLimited(ip)) return json({ error: "rate" }, 429, origin);

  const fields = (body.fields && typeof body.fields === "object") ? body.fields : {};
  const allow = formType === "membership" ? MEMBERSHIP_FIELDS : CONTACT_FIELDS;
  const rec = clean(fields, allow);

  // required-field + format validation
  const required = formType === "membership" ? ["name", "gender", "email", "company"] : ["name", "email", "message"];
  for (const k of required) if (!rec[k]) return json({ error: `missing:${k}` }, 422, origin);
  if (!EMAIL_RE.test(rec.email)) return json({ error: "email" }, 422, origin);
  const agree = body.agree === true || fields.agree === true || String(fields.agree || "").length > 0;
  if (formType === "membership" && !agree) return json({ error: "agree" }, 422, origin);

  // ---- fan out ----
  // 1) Supabase insert (membership only)
  if (formType === "membership") {
    const row = { ...rec, agree: true, source: "官网入会表单" };
    try {
      await fetch(`${SB_URL}/rest/v1/applications`, { method: "POST", headers: sbHeaders({ Prefer: "return=minimal" }), body: JSON.stringify(row) });
    } catch { /* non-fatal */ }
    // 2) Google Sheet (membership only)
    if (APPS_SCRIPT_URL) {
      try {
        await fetch(APPS_SCRIPT_URL, { method: "POST", headers: { "content-type": "text/plain;charset=utf-8" }, body: JSON.stringify({ ...row, source: "官网入会表单", token: APPS_SCRIPT_TOKEN }) });
      } catch { /* non-fatal */ }
    }
  }

  // 3) Email via Web3Forms (both forms) — canonical notification
  if (WEB3FORMS_KEY) {
    const fd = new FormData();
    fd.append("access_key", WEB3FORMS_KEY);
    fd.append("subject", formType === "membership" ? "IE100官网 · 新会员入会申请" : "IE100官网 · 联系表单留言");
    fd.append("from_name", formType === "membership" ? "IE100 官网入会申请表" : "IE100 官网联系表单");
    fd.append("name", rec.name || "");
    fd.append("email", rec.email || "");
    fd.append("message", summary(rec, formType === "membership" && agree));
    try {
      const r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const d = await r.json();
      if (!d.success) return json({ ok: true, emailWarning: true }, 200, origin);
    } catch { return json({ ok: true, emailWarning: true }, 200, origin); }
  }

  return json({ ok: true }, 200, origin);
});
