---
author: beto.group
contributor: []
version: 1.0.0
id: open-application-583
name: OPEN APPLICATION
description: A macOS application launcher embedded inside Obsidian. Reads /Applications, renders a filterable grid of installed apps, and launches them natively — with optional admin escalation via osascript.
status: stable
complexity: simple
category:
  - utility
  - launcher
compatibility:
  - Obsidian >=1.5.0
  - macOS
repository:
  - https://github.com/beto-group/OpenApplication
missing: []
resources:
  - assets/open_application.webp
  - assets/openapplication.clip.gif
type: DatacoreComponent
target: Datacore
security:
  - Vault
  - NodeFS
storage:
  - File
network: Offline
runtime: React
entry_point: OPEN APPLICATION.md
logic: src/index.jsx
---

This file contains the machine-readable packaging manifest and indexing properties for this component.
