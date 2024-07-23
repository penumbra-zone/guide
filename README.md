# Penumbra Guide

This repo holds the end-user documentation for Penumbra, hosted at [https://guide.penumbra.zone](https://guide.penumbra.zone).

## Contributing

1. Install [nix](https://nixos.org/download/).
2. Run `nix develop --enable-experimental-features "nix-command flake"`
3. Run `just dev` for a livereload environment.

## Directory layout

The documentation source resides in `pages/`. Docs files are written in [Markdown](https://www.markdownguide.org/),
and served via [Nextra](https://nextra.site/).
