---
title: MCP Integration
description: Set up nila-tunnel's MCP server for Claude Code, Cursor, and Claude Desktop.
---

nila-tunnel includes a Model Context Protocol (MCP) server that lets AI
agents manage your local development proxy programmatically.

## Quick Setup

### Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "nila-tunnel": {
      "command": "nila-tunnel",
      "args": ["mcp"]
    }
  }
}
```

Or add globally in `~/.claude/mcp.json`.

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nila-tunnel": {
      "command": "/path/to/nila-tunnel",
      "args": ["mcp"]
    }
  }
}
```

On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

### Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "nila-tunnel": {
      "command": "nila-tunnel",
      "args": ["mcp"]
    }
  }
}
```

---

## Available Tools

### `proxy_status`

Get the current proxy state: running, PID, version, service count.

**Parameters**: none

**Example response**:
```json
{
  "running": true,
  "pid": 12345,
  "version": "0.8.0",
  "services": 3
}
```

**Use case**: Check if the proxy is running before making requests.

---

### `list_services`

List all registered services with hosts, paths, targets, and timeouts.

**Parameters**: none

**Example response**:
```json
[
  {
    "host": "app.test",
    "paths": [
      { "path": "/", "target": "127.0.0.1:3000" }
    ]
  },
  {
    "host": "api.test",
    "paths": [
      { "path": "/v1/chat", "target": "127.0.0.1:8000", "request_timeout": 120000 },
      { "path": "/health", "target": "127.0.0.1:8000", "request_timeout": 5000 }
    ]
  }
]
```

**Use case**: Discover what services are available and their URLs.

---

### `add_service`

Register a new service route. The domain must use a safe TLD (`.test`,
`.localhost`, `.example`, `.invalid`).

**Parameters**:

| Name | Type | Required | Description |
|---|---|---|---|
| `host` | string | yes | Domain name (e.g. `api.test`) |
| `port` | integer | yes | Backend port (e.g. `4000`) |
| `path` | string | no | Path prefix (default: `/`) |

**Example**:
```json
{ "host": "api.test", "port": 4000 }
```

**Response**: `"Registered: api.test/ → 127.0.0.1:4000"`

**Use case**: An agent starting a new backend service can register it
automatically so it's accessible via HTTPS.

**Note**: Takes effect immediately if the proxy is running (hot-reload
via SIGHUP). No restart needed.

---

### `remove_service`

Deregister a service by host name.

**Parameters**:

| Name | Type | Required | Description |
|---|---|---|---|
| `host` | string | yes | Domain to remove (e.g. `api.test`) |

**Response**: `"Removed: api.test"`

**Use case**: Clean up services when an agent stops a backend.

---

### `get_request_logs`

Get recent structured request logs (JSONL format). Shows method, host,
path, status, latency, and masked headers.

**Parameters**:

| Name | Type | Required | Description |
|---|---|---|---|
| `limit` | integer | no | Number of entries (default: 20) |

**Example response**:
```json
[
  {
    "ts": "1776080280",
    "method": "POST",
    "host": "api.test",
    "path": "/v1/chat/completions",
    "status": 200,
    "latency_ms": 1234,
    "bytes_up": 2048,
    "bytes_down": 8192,
    "headers": [
      ["authorization", "Bearer sk-ab****xyz"],
      ["content-type", "application/json"]
    ]
  }
]
```

**Use case**: Debug failed requests, check latencies, verify routing.

**Security**: API keys in `Authorization`, `X-Api-Key`, `Api-Key`, and
`X-Api-Token` headers are automatically masked (middle characters replaced
with `****`).

---

## Architecture

```
AI Agent (Claude Code / Cursor / Claude Desktop)
    │
    │  stdio (JSON-RPC 2.0)
    ▼
nila-tunnel mcp (separate process, not root)
    │
    │  reads/writes ~/.nila-tunnel/nila.yaml
    │  reads ~/.nila-tunnel/nila-tunnel.pid
    │  reads ~/.nila-tunnel/logs/requests.jsonl
    ▼
nila-tunnel proxy (may run as root for ports 80/443)
```

The MCP server runs as a **separate process** from the proxy:
- The proxy may run as root (for privileged ports). The MCP server does not.
- The MCP server reads config files and PID status directly.
- No network connection between MCP server and proxy is needed.

### Protocol stack

```
nila-core    McpHandler trait (&[u8] → Vec<u8>)   raw byte transport
nila-mcp     ToolProvider trait + JSON-RPC dispatch protocol layer
nila-tunnel  tool implementations                  business logic
```

---

## Security

### What is NOT exposed via MCP

- Certificate private keys (`ca.key`, `key.pem`)
- CA management operations (install, trust, uninstall)
- Domains outside safe TLDs — `add_service` rejects `.com`, `.io`, etc.

### Why safe TLDs only

The `add_service` tool only accepts RFC 6761 reserved TLDs:
`.test`, `.localhost`, `.example`, `.invalid`

This prevents a compromised AI agent from using nila-tunnel to intercept
real traffic by registering `google.com → 127.0.0.1:9999`.

### Log masking

Request logs automatically mask sensitive headers:
- `Authorization: Bearer sk-test123456789` → `Bearer sk-te****789`
- `X-Api-Key: key_abc123` → `key_****123`

Full API keys are never exposed via the `get_request_logs` tool.

---

## Examples

### Agent workflow: start a service and verify it works

```
Agent: Use add_service to register my-api.test on port 4000
Agent: Use proxy_status to confirm the proxy is running
Agent: Use get_request_logs to check if requests are flowing
```

### Debugging: find why requests fail

```
Agent: Use list_services to check routing
Agent: Use get_request_logs with limit 5 to see recent requests
Agent: The last request to api.test/v1/chat returned 503 — the upstream
       at 127.0.0.1:8000 is unreachable. Start the backend.
```

### Multi-service setup

```
Agent: Use add_service for app.test:3000
Agent: Use add_service for api.test:4000
Agent: Use add_service for llm.test:8000
Agent: All three services registered. Access via:
       https://app.test:8443/
       https://api.test:8443/
       https://llm.test:8443/
```

---

## Troubleshooting

### MCP server not found

Ensure `nila-tunnel` is in your PATH:
```bash
which nila-tunnel
```

If not, use the full path in your MCP config:
```json
{ "command": "/usr/local/bin/nila-tunnel", "args": ["mcp"] }
```

### Tools return errors

The MCP server reads from `~/.nila-tunnel/nila.yaml`. If the file doesn't
exist, run `nila-tunnel install` first.

### Proxy not running

`proxy_status` shows `running: false`. Start the proxy:
```bash
nila-tunnel start
```

The MCP server works independently of the proxy — you can register
services and check config even when the proxy is stopped.

### add_service rejected

Domain must use a safe TLD. Use `.test`:
```
Bad:  api.com      → rejected
Good: api.test     → accepted
Good: api.localhost → accepted
```
