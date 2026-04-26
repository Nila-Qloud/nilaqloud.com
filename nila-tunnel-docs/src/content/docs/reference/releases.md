---
title: Releases
description: Download nila-tunnel for your platform.
---

## Latest: v0.8.1

### Install

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-installer.sh | sh

# Homebrew
brew install b-rajesh/nila-tunnel/nila-tunnel

# Windows PowerShell
powershell -ExecutionPolicy Bypass -c "irm https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-installer.ps1 | iex"
```

### Direct download

| Platform | Architecture | Download |
|---|---|---|
| macOS | Apple Silicon | [nila-tunnel-aarch64-apple-darwin.tar.xz](https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-aarch64-apple-darwin.tar.xz) |
| macOS | Intel | [nila-tunnel-x86_64-apple-darwin.tar.xz](https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-x86_64-apple-darwin.tar.xz) |
| Linux | x64 | [nila-tunnel-x86_64-unknown-linux-gnu.tar.xz](https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-x86_64-unknown-linux-gnu.tar.xz) |
| Linux | x64 (static/musl) | [nila-tunnel-x86_64-unknown-linux-musl.tar.xz](https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-x86_64-unknown-linux-musl.tar.xz) |
| Linux | ARM64 | [nila-tunnel-aarch64-unknown-linux-gnu.tar.xz](https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-aarch64-unknown-linux-gnu.tar.xz) |
| Windows | x64 | [nila-tunnel-x86_64-pc-windows-msvc.zip](https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-x86_64-pc-windows-msvc.zip) |

### Checksums

Each download has a corresponding `.sha256` checksum file. Verify:

```bash
curl -LO https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-aarch64-apple-darwin.tar.xz
curl -LO https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-aarch64-apple-darwin.tar.xz.sha256
shasum -a 256 -c nila-tunnel-aarch64-apple-darwin.tar.xz.sha256
```

### All releases

[View all releases on GitHub](https://github.com/b-rajesh/nila-releases/releases)
