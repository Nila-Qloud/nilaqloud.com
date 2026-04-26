---
title: Configuration
description: nila.yaml reference, CLI commands, and proxy settings.
---

## Config file

`~/.nila-tunnel/nila.yaml` — managed by `register` / `deregister` commands.

```yaml
nila: "1.0.0"
logging:
  max_size_mb: 50
  max_files: 1
services:
  - name: app.test
    host: app.test
    paths:
      /:
        target: 127.0.0.1:3000
  - name: ai.test
    host: ai.test
    request_timeout: 30000
    paths:
      /v1/chat:
        target: 127.0.0.1:8000
        request_timeout: 120000
      /health:
        target: 127.0.0.1:8000
        request_timeout: 5000
```

Paths are matched by **longest prefix**. Timeout priority: path > service.

## Logging config

| Field | Default | Description |
|---|---|---|
| `max_size_mb` | `50` | Rotate log files when they exceed this size (MB) |
| `max_files` | `1` | Number of rotated files to keep (.1, .2, etc.) |

## Request timeout

Set per-path via CLI or per-service in nila.yaml:

```bash
nila-tunnel register -d ai.test -p 8000 --path /v1/chat --request-timeout 120000
```

Timeout in milliseconds. Returns `504 Gateway Timeout` on expiry. WebSocket connections are excluded.

## CLI commands

### register

```bash
nila-tunnel register -d app.test -p 3000
nila-tunnel register -d ai.test --path /v1/chat -p 8000 --request-timeout 120000
nila-tunnel register -d app.com -p 3000 --allow-unsafe    # non-safe TLD
```

| Flag | Default | Description |
|---|---|---|
| `-p, --port` | `3000` | Local port to proxy |
| `-d, --domain` | `localhost.test` | Domain name |
| `--path` | `/` | URL path prefix to route |
| `-t, --target` | `127.0.0.1:<port>` | Backend target address |
| `--request-timeout` | — | Request timeout in ms |
| `--allow-unsafe` | off | Allow non-reserved TLDs (.com, .io) |

### deregister

```bash
nila-tunnel deregister -d api.test
```

### start / restart / stop

```bash
nila-tunnel start                     # launch proxy (daemon)
nila-tunnel start -F                  # foreground mode
nila-tunnel start --mode privileged   # ports 80/443 (needs root)
nila-tunnel restart                   # stop + start
nila-tunnel stop                      # stop the proxy
```

| Flag | Default | Description |
|---|---|---|
| `-F, --foreground` | off | Run in foreground |
| `--mode` | `auto` | `auto`, `privileged`, `unprivileged` |
| `--bind` | `127.0.0.1` | Bind address |

### status / log

```bash
nila-tunnel status                    # human-readable
nila-tunnel status --json             # machine-readable (AI agents)
nila-tunnel log                       # daemon logs
nila-tunnel log requests              # structured request logs (JSONL)
nila-tunnel log requests -f           # follow in real time
```

## WebSocket support

WebSocket connections are tunneled transparently. The proxy detects the `Upgrade: websocket` header and switches to bidirectional piping.

```bash
nila-tunnel register -d ws.test -p 5000
# Connect to wss://ws.test:8443/ws
```

## SSE (Server-Sent Events)

SSE streams pass through without buffering — events arrive in real time.

```bash
nila-tunnel register -d sse.test -p 7000
curl -Nsk https://sse.test:8443/events
```

## Unix socket control API

JSON-RPC 2.0 at `~/.nila-tunnel/nila-tunnel.sock`:

| Method | Params | Description |
|---|---|---|
| `proxy_status` | — | Running state, PID, version |
| `list_services` | — | All registered services |
| `add_service` | `{host, port, path?}` | Register a service |
| `remove_service` | `{host}` | Deregister a service |
| `reload_config` | — | Reload routing table |

```bash
echo '{"jsonrpc":"2.0","method":"proxy_status","id":1}' \
  | socat - UNIX:~/.nila-tunnel/nila-tunnel.sock
```

## Data directory

```
~/.nila-tunnel/
├── ca.crt, ca.key        Root CA (10-year validity)
├── nila-tunnel.pid        Running proxy PID
├── nila-tunnel.log        Daemon logs (rotated)
├── nila-tunnel.sock       Unix socket (JSON-RPC)
├── nila.yaml              Service config
├── logs/requests.jsonl    Request logs (JSONL, rotated)
└── certs/<domain>/        Per-domain leaf certs (825-day validity)
```

## Supported TLDs

RFC 6761 reserved TLDs are resolved automatically. Non-safe TLDs require `--allow-unsafe`.

- `.test`, `.localhost`, `.example`, `.invalid`
