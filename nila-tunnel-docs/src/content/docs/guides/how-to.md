---
title: How-to Guides
description: Common workflows for nila-tunnel — multi-service, WebSocket, SSE, timeouts, and more.
---

## Run multiple services

```bash
nila-tunnel register -d app.test -p 3000       # frontend
nila-tunnel register -d api.test -p 4000       # API
nila-tunnel register -d llm.test -p 8000       # LLM gateway
nila-tunnel register -d ws.test -p 5000        # WebSocket server
nila-tunnel start
```

All services share one proxy, one Root CA, one DNS resolver.

## WebSocket services

No special configuration. Register like any HTTP service:

```bash
nila-tunnel register -d ws.test -p 5000
```

The proxy detects `Upgrade: websocket` headers and switches to
bidirectional tunneling automatically. WebSocket connections are
excluded from request timeouts.

## SSE streaming (LLM responses)

SSE streams pass through without buffering:

```bash
nila-tunnel register -d sse.test -p 7000
curl -Nsk https://sse.test:8443/events    # events stream in real time
```

No configuration needed — the proxy's passthrough mode never buffers
response bodies.

## Per-path request timeouts

Different paths can have different timeouts:

```bash
# LLM chat: 2 minutes (model inference is slow)
nila-tunnel register -d ai.test -p 8000 --path /v1/chat --request-timeout 120000

# Health check: 5 seconds
nila-tunnel register -d ai.test -p 8000 --path /health --request-timeout 5000
```

Timeout in milliseconds. Returns `504 Gateway Timeout` on expiry.
Paths are matched by longest prefix.

## Hot-reload (register while running)

Register or deregister services without restarting:

```bash
nila-tunnel register -d new.test -p 9000    # takes effect immediately
nila-tunnel deregister -d old.test          # removed immediately
```

The proxy reloads configuration via SIGHUP — no downtime.

## Machine-readable status for scripts

```bash
nila-tunnel status --json | python3 -m json.tool
```

Output:
```json
{
  "running": true,
  "pid": 12345,
  "version": "0.8.1",
  "services": [
    {
      "host": "app.test",
      "paths": [{ "path": "/", "target": "127.0.0.1:3000" }]
    }
  ]
}
```

## Structured request logs

Request logs are written in JSONL format with API key masking:

```bash
nila-tunnel log requests --lines 5
```

Sensitive headers (`Authorization`, `X-Api-Key`) are automatically masked:
`Bearer sk-test123...` → `Bearer sk-te****123`

## Run in foreground (debugging)

```bash
nila-tunnel start -F
```

Logs go to stderr instead of the log file. Useful for debugging
connection issues.

## Clean URLs (ports 80/443)

```bash
nila-tunnel start --mode privileged
# https://app.test/ instead of https://app.test:8443/
```

Requires root. Without root, use high ports (8080/8443) — the default.

## Diagnostics

```bash
nila-tunnel doctor
```

Checks: Root CA presence and trust, DNS resolver, port availability,
config file validity.

## Uninstall completely

```bash
nila-tunnel stop
nila-tunnel uninstall
```

Removes: CA trust from keychain, DNS resolver, all certificates,
config, logs, and data directory.
