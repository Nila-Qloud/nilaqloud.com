# Agent: Deploy & Operations

## Role

Manages deployment, DNS, SSL, and operational health of the nila
product websites on Cloudflare Pages.

## Infrastructure

### Cloudflare Pages projects

| Project | Domain | Source | Build |
|---|---|---|---|
| `nila-landing` | `nilaqloud.com` | `sites/nila-landing/` | None (static files) |
| `nila-tunnel-docs` | `tunnel.nilaqloud.com` | `sites/nila-tunnel-docs/` | `npm run build` |

### DNS records (GoDaddy → Cloudflare Pages)

```
Type    Name      Value                              TTL
CNAME   @         nila-landing.pages.dev             600
CNAME   www       nila-landing.pages.dev             600
CNAME   tunnel    nila-tunnel-docs.pages.dev         600
```

### Email routing (Cloudflare)

```
hello@nilaqloud.com      → personal email
security@nilaqloud.com   → personal email
```

## Deployment

### Auto-deploy (default)

Push to `master` → Cloudflare Pages builds and deploys automatically.
Each project watches its own directory via Cloudflare's root directory setting.

### Manual deploy

```bash
# Docs site
cd sites/nila-tunnel-docs
npm run build
npx wrangler pages deploy dist --project-name=nila-tunnel-docs

# Landing page
cd sites/nila-landing
npx wrangler pages deploy . --project-name=nila-landing
```

### Rollback

Cloudflare Pages dashboard → Deployments → click any previous deployment
→ "Rollback to this deployment". Instant, no rebuild.

## Security headers

Both sites must serve these headers via `_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; font-src 'self'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Monitoring

### Health checks

```bash
# Verify sites are up
curl -sI https://nilaqloud.com | head -1          # HTTP/2 200
curl -sI https://tunnel.nilaqloud.com | head -1    # HTTP/2 200

# Verify SSL
curl -sI https://nilaqloud.com | grep -i strict    # HSTS header present

# Verify security headers
curl -sI https://tunnel.nilaqloud.com | grep -i x-frame   # DENY
```

### Uptime monitoring (future)

Set up free UptimeRobot or Cloudflare health check:
- `https://nilaqloud.com` — check every 5 minutes
- `https://tunnel.nilaqloud.com` — check every 5 minutes
- Alert via email on downtime

## Operational runbook

### Site is down

1. Check Cloudflare status: https://www.cloudflarestatus.com/
2. Check Cloudflare Pages dashboard for failed deploys
3. If build failed: previous version is still live. Fix and push.
4. If DNS issue: verify CNAME records in GoDaddy
5. If SSL issue: Cloudflare dashboard → SSL/TLS → verify certificates

### Need to update content urgently

1. Edit markdown file
2. Push to master
3. Live in ~30 seconds

### Need to take site offline

Cloudflare Pages dashboard → Settings → Pause deployment.
Or: replace content with maintenance page, push.

### Adding a new product subdomain

1. Create new Cloudflare Pages project
2. Add CNAME record: `newproduct → nila-newproduct-docs.pages.dev`
3. Wait for SSL auto-provisioning (~2 minutes)
4. Verify: `curl -I https://newproduct.nilaqloud.com`

## Cost monitoring

Current: $0/month (Cloudflare free tier).
Alert threshold: if ever charged, investigate — free tier should cover
all static site needs.
