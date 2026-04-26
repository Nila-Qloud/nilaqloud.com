---
title: Changelog
description: Version history for nila-tunnel.
---

## [0.8.1] — 2026-04-25

### Fixed
- **Security**: Idempotent CA trust by SHA-1 fingerprint (prevents duplicate certificates in keychain)
- **Security**: Uninstall removes ALL certificate copies by hash (fixes "ambiguous" delete error on macOS)
- **Linux**: `is_alive()` uses `/proc/<pid>` (works without `/usr/bin/kill` on minimal systems)
- **Linux**: `is_root()` falls back to `id -u` (works in Docker without `$USER`)
- **Windows**: Fixed missing `Command` import in untrust module

### Changed
- **Deferred trust**: `install` generates CA only (no sudo). `start` prompts once to trust CA + register DNS.
- **DNS registration**: Best-effort in containers (warns instead of aborting)
- CI workflows: manual trigger only on master push (auto on PRs)

### Added
- Docker smoke tests: Debian (glibc) + Alpine (musl), 43 steps each
- Multi-distro test runner (`docker-test-all.sh`)
- Smoke test plan document (20 phases, platform coverage matrix)

## [0.8.0] — 2026-04-14

### Added
- **MCP server**: `nila-tunnel mcp` with 5 tools (proxy_status, list_services, add_service, remove_service, get_request_logs)
- **Unix socket API**: JSON-RPC 2.0 at `~/.nila-tunnel/nila-tunnel.sock`
- **Domain scope restriction**: Only safe TLDs by default (`.test`, `.localhost`, `.example`, `.invalid`)
- **SSE streaming**: Verified pass-through without buffering
- **WebSocket tunneling**: Transparent upgrade + bidirectional pipe
- **Per-path request timeout**: Configurable per route in nila.yaml
- **Structured request logging**: JSONL with rotation
- **API key masking**: Authorization, X-Api-Key headers masked in logs
- **Log rotation**: Configurable `max_size_mb` and `max_files`
- **`status --json`**: Machine-readable proxy state for AI agents

### Changed
- **Proxy engine**: Migrated from Pingora+BoringSSL to nila-core (pure Rust, tokio+rustls)
- **Binary size**: 1.8 MB (down from ~15 MB with Pingora)

## [0.5.0] — 2026-04-11

### Added
- Daemon mode with `--foreground` / `-F` flag
- Embedded DNS resolver (no `/etc/hosts` editing)
- Per-domain leaf certificates (cached, 825-day validity)
- NSS trust store support (Firefox/Chromium)
- Port auto-detection (80/443 with root, 8080/8443 without)
- `nila-tunnel doctor` diagnostics
- Multi-service config via nila.yaml

## [0.4.0] — 2026-04-09

### Added
- Initial release with HTTPS reverse proxy and auto-generated certificates
