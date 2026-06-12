# Security Policy

We take the security of IE100 and our members' information seriously.

## Reporting a vulnerability
If you believe you have found a security vulnerability in this website or its
admin portal, please **do not open a public issue**. Instead, email us privately:

- **Contact:** 1796734768@qq.com
- Please include a description, steps to reproduce, and any relevant URLs.

We will acknowledge your report, investigate, and keep you informed of the
resolution. We appreciate responsible disclosure and will not pursue action
against good-faith research that respects member privacy and avoids data
destruction or service disruption.

## Scope
- The public website (GitHub Pages).
- The admin portal at `/admin/` and its Supabase backend (Auth, Database, Storage,
  Edge Functions).

## Out of scope
- Third-party services we rely on (Supabase, Cloudflare, Google, Web3Forms,
  GitHub) — report those to the respective vendors.
- Findings requiring physical access to an administrator's device.

For configuration and operational hardening, see `admin/SECURITY-SETUP.md`.
