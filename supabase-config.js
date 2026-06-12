// ===== Supabase connection (PUBLIC values — safe to commit) =====
// The anon key is designed to be public; Row Level Security (RLS) protects all data.
// NEVER put the service_role key (or any "secret"/SMTP key) here — those live ONLY
// in Supabase Edge Function secrets. This file is publicly served.
//
// After creating your Supabase project (see admin/SETUP.md), paste the two values
// from  Project Settings → API  below, then commit.
window.IE100_SUPABASE = {
  url: 'https://lqqzqehtdfgymifymxmx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcXpxZWh0ZGZneW1pZnlteG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMTc5MjUsImV4cCI6MjA5Njc5MzkyNX0.EgW5y_dMGtn0reIdo3Y3bVc6p8RFiceFnoppRj9u_2I',
};

// Cloudflare Turnstile public SITE key for the public forms (safe to commit).
// Get it from Cloudflare dashboard → Turnstile → add site. See admin/SECURITY-SETUP.md.
// Leave as the placeholder during setup; the form shows the widget once a real key is set.
window.IE100_TURNSTILE_SITEKEY = 'YOUR-TURNSTILE-SITE-KEY';
