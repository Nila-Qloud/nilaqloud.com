---
title: Quick Start
description: Get HTTPS for local development in 60 seconds.
---

## 1. Install nila-tunnel

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-installer.sh | sh

# Or via Homebrew
brew install b-rajesh/nila-tunnel/nila-tunnel
```

## 2. Set up

```bash
nila-tunnel install
```

Generates a Root CA and default config. No password prompt.

## 3. Start your app

```bash
node server.js         # port 3000
python manage.py       # port 8000
cargo run              # whatever port
```

## 4. Register and start

```bash
nila-tunnel register -d app.test -p 3000     # register a service
nila-tunnel start                            # start the proxy
```

First run prompts for your password once to trust the Root CA.

## 5. Open your browser

Navigate to `https://app.test:8443/` — green lock, no warnings.

## 6. Register more services

Services are hot-reloaded — register while the proxy is running:

```bash
nila-tunnel register -d api.test -p 4000
nila-tunnel register -d ai.test --path /v1/chat -p 8000 --request-timeout 120000
```

## 7. Check status

```bash
nila-tunnel status                    # human-readable
nila-tunnel status --json             # for AI agents and scripts
```

## 8. View logs

```bash
nila-tunnel log                       # daemon logs
nila-tunnel log requests              # structured request logs (JSONL)
nila-tunnel log requests -f           # follow in real time
```

## 9. Manage services

```bash
nila-tunnel deregister -d api.test    # remove (hot-reloaded)
nila-tunnel restart                   # full restart if needed
nila-tunnel stop                      # stop the proxy
```

## Clean URLs (with sudo)

```bash
nila-tunnel start --mode privileged   # https://app.test/ (port 443)
```

## Next steps

- [Installation](/getting-started/installation/) — all install methods and platform support
- [Configuration](/guides/configuration/) — nila.yaml reference and CLI commands
- [MCP Integration](/guides/mcp/) — set up AI agent access
