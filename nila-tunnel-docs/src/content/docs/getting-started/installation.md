---
title: Installation
description: Install nila-tunnel on macOS, Linux, or Windows.
---

## Shell installer (recommended)

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-installer.sh | sh
```

Auto-detects your platform and installs the correct binary.

## Homebrew (macOS / Linux)

```bash
brew install b-rajesh/nila-tunnel/nila-tunnel
```

## PowerShell (Windows)

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://github.com/b-rajesh/nila-releases/releases/latest/download/nila-tunnel-installer.ps1 | iex"
```

## Manual download

Download the binary for your platform from the [Releases](/reference/releases/) page.

## From source

```bash
git clone https://github.com/b-rajesh/nila-workspace.git
cd nila-workspace
cargo build --release -p nila-tunnel
./target/release/nila-tunnel --version
```

### Build requirements

- Rust 1.94+ (2024 edition)
- No C dependencies (pure Rust build)

## Post-install setup

```bash
nila-tunnel install
```

This generates a Root CA at `~/.nila-tunnel/`. On first `nila-tunnel start`,
you'll be prompted once to trust the CA in your system keychain.

## Uninstall

```bash
nila-tunnel uninstall
```

Removes the Root CA, DNS resolver, certificates, and data directory.

## Platform support

| Platform | Architecture | Status |
|---|---|---|
| macOS | Apple Silicon (ARM64) | Verified |
| macOS | Intel (x86_64) | Verified |
| Linux | x86_64 (glibc) | Verified |
| Linux | x86_64 (musl/static) | Verified |
| Linux | ARM64 | Verified |
| Windows | x86_64 | Verified |
| Linux (Fedora/RHEL) | x86_64 | Untested |
| Linux (Arch/Manjaro) | x86_64 | Untested |
