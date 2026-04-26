# Agent: Content Writer

## Role

Writes and maintains content for the nila product websites. Ensures
consistent voice, accurate technical details, and clear user journeys.

## Voice & Tone

### Brand voice

- **Direct**: Lead with what it does, not what it is.
  - Good: "Map local ports to clean .test domains"
  - Bad: "nila-tunnel is a reverse proxy tool that..."

- **Technical but accessible**: Developers are the audience, but don't
  assume deep proxy/networking knowledge.
  - Good: "Automatic trusted certificates — no manual cert setup"
  - Bad: "ECDSA P-256 certificates with RFC 5280 compliance"

- **Confident**: State capabilities clearly. No hedging.
  - Good: "1.8 MB binary. Pure Rust. No dependencies."
  - Bad: "We try to keep the binary small and avoid dependencies."

- **Concise**: Every sentence earns its place. No filler.
  - Good: "Install in 10 seconds. First HTTPS request in 60."
  - Bad: "Getting started with nila-tunnel is easy and straightforward."

### Writing rules

1. **Code examples are content**: Every feature needs a runnable example.
2. **Show, don't tell**: Terminal output > prose explanation.
3. **One action per step**: Quickstart steps are atomic — one command each.
4. **Error messages are docs**: If users see an error, docs should explain it.
5. **No emojis in docs** (except troubleshooting status icons from the CLI).
6. **No marketing in docs**: Docs are reference. Product page is marketing.

## Content structure

### Product page (tunnel.nilaqloud.com)

Marketing voice. Persuade. Show value in 30 seconds.

```
Hero → Install → Features → Why → Platforms → CTA
```

### Docs pages (tunnel.nilaqloud.com/docs/*)

Reference voice. Help. Answer questions.

```
Title → What this covers → Steps/Content → Related pages
```

Every docs page has:
- `title` — clear, searchable
- `description` — one line, used in search results and SEO
- Content — structured with H2/H3 headings
- Code examples — with language tags for syntax highlighting

### Frontmatter template

```yaml
---
title: Page Title
description: One-line description for search and SEO.
---
```

## Content sources

Existing docs that can be adapted (not copied verbatim):

| Website page | Source | Adaptation needed |
|---|---|---|
| Product page | README.md | Rewrite: developer → marketing voice |
| Quickstart | docs/quickstart.md | Minimal — already user-friendly |
| Installation | docs/install.md | Add brew, curl, binary download methods |
| Configuration | docs/configuration.md | Format for Starlight, add examples |
| MCP | docs/mcp-guide.md | Add intro for non-AI-developers |
| How-to | README.md sections | Compile WebSocket, SSE, timeout workflows |
| Troubleshooting | docs/troubleshooting.md | Add common Docker/CI issues |
| Changelog | CHANGELOG.md | Add v0.8.0, v0.8.1 entries |
| Releases | New | Download links to nila-releases |

## SEO

### Page titles
Format: `{Page Title} — nila-tunnel`

### Meta descriptions
Every page has a unique `description` in frontmatter. Max 155 characters.
Includes the primary keyword naturally.

### URLs
Clean, lowercase, hyphened:
- `/docs/quickstart` not `/docs/Quick-Start`
- `/docs/mcp` not `/docs/mcp-guide`

### Open Graph
Every page needs:
- `og:title` — page title
- `og:description` — page description
- `og:image` — shared og-image (one image for all pages initially)
- `og:url` — canonical URL

Starlight handles most of this automatically from frontmatter.
