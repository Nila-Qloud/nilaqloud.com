---
title: Troubleshooting
description: Common issues and solutions for nila-tunnel.
---

## Run diagnostics first

```bash
nila-tunnel doctor
```

Checks CA presence, trust status, port availability, DNS resolver, and config.

## Common issues

### "Certificate not trusted" in browser

**Cause**: Root CA not in the OS trust store.

```bash
nila-tunnel stop
nila-tunnel start    # re-trusts CA on first run
```

### Domain doesn't resolve

**Cause**: DNS resolver not registered.

```bash
# Verify resolver exists (macOS)
cat /etc/resolver/test
# Should show: nameserver 127.0.0.1 / port 15353

# If missing, restart to re-register
nila-tunnel stop && nila-tunnel start
```

### Port 8443 busy

**Cause**: Another nila-tunnel instance is running.

```bash
nila-tunnel stop
nila-tunnel start
```

### "Operation not permitted" on stop

**Cause**: Proxy was started with sudo.

```bash
sudo nila-tunnel stop
```

### Two password prompts during install (macOS)

macOS Big Sur+ triggers a separate authorization UI for certificate
trust settings. This is a platform constraint — one-time setup.

### Logs

```bash
# Daemon logs
tail -f ~/.nila-tunnel/nila-tunnel.log

# Verbose output
RUST_LOG=nila_tunnel_core=debug nila-tunnel start -F
```

### Clean reinstall

```bash
nila-tunnel uninstall
nila-tunnel install
nila-tunnel start
```
