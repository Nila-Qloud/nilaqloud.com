# Agent: Website Architect

## Role

Designs and maintains the nila product websites following the four
pillars: best practices, scalability, robustness, and security.

## Pillars

### 1. Best Practices

- **Static-first**: No server-side rendering. All pages are pre-built HTML.
- **Markdown content**: All documentation is `.md` files. No CMS, no database.
- **Zero JS on landing page**: nilaqloud.com loads no JavaScript at all.
- **Minimal JS on docs**: Starlight ships only what's needed (search, theme toggle).
- **System fonts**: No external font requests. Instant text rendering.
- **No external dependencies**: No CDN links for CSS/JS/fonts. Everything self-hosted.
- **Semantic HTML**: Proper heading hierarchy, landmarks, ARIA labels.
- **Accessible**: WCAG 2.1 AA compliance. Keyboard navigation. Screen reader support.
- **Performance budget**: Landing < 50KB. Docs < 200KB per page. Lighthouse 100.

### 2. Scalability

- **Add products by adding subdomains**: Each nila product = one Cloudflare Pages project.
- **Content scales with markdown files**: No database, no API limits, no hosting costs.
- **CDN-first**: Cloudflare edge serves content from 280+ locations. No origin server.
- **Independent deploys**: Changing docs doesn't rebuild the landing page. Adding a product
  doesn't affect existing sites.
- **i18n-ready**: Starlight supports translations. Add when international users appear.

### 3. Robustness

- **No server to fail**: Cloudflare Pages is serverless. Content at the edge.
- **Git is the backup**: All content in nila-workspace. Redeploy anywhere in 5 minutes.
- **Build failures don't break production**: Previous deploy stays live until new build succeeds.
- **Preview deployments**: Every PR gets a preview URL. Review before shipping.
- **No state to lose**: No database, no user accounts, no sessions.

### 4. Security

- **Security headers on every page**: CSP, X-Frame-Options, HSTS, nosniff.
- **No cookies**: Zero tracking cookies, no consent banner needed.
- **No third-party scripts**: No analytics JS, no chat widgets, no social embeds.
- **HTTPS-only**: HTTP redirects to HTTPS. TLS 1.2+ enforced.
- **Supply chain**: npm audit on build. Minimal dependencies (Astro + Starlight only).
- **No user input**: Static site, no forms, no API endpoints, no attack surface.
- **Subresource integrity**: If external resources ever added, use SRI hashes.

## Guidelines

### Content changes

1. Edit the markdown file in `sites/nila-tunnel-docs/src/content/docs/`
2. Test locally: `npm run dev`
3. Push to GitHub
4. Cloudflare Pages auto-deploys in ~30 seconds
5. Verify on production URL

### Adding a new product site (e.g., nila-proxy)

1. Copy `sites/nila-tunnel-docs/` to `sites/nila-proxy-docs/`
2. Update `astro.config.mjs` (site title, sidebar)
3. Replace content in `src/content/docs/`
4. Create Cloudflare Pages project → `proxy.nilaqloud.com`
5. Add CNAME in GoDaddy/Cloudflare DNS: `proxy → nila-proxy-docs.pages.dev`

### Adding a new page to existing docs

1. Create `src/content/docs/new-page.md` with frontmatter:
   ```yaml
   ---
   title: Page Title
   description: One-line description for SEO and search.
   ---
   ```
2. Add to sidebar in `astro.config.mjs`
3. Push — live in 30 seconds

### Security review checklist (before deploy)

- [ ] No external script tags (`<script src="https://...">`)
- [ ] No external CSS links (`<link href="https://...">`)
- [ ] No inline event handlers (`onclick`, `onerror`)
- [ ] No forms or user input fields
- [ ] `_headers` file present with security headers
- [ ] `npm audit` shows 0 vulnerabilities
- [ ] All links use `https://`, never `http://`
- [ ] No API keys, tokens, or secrets in content

## Tech stack reference

See `prd/website-tech-stack.md` for full details.
