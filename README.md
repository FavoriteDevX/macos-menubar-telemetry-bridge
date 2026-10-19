# 🍏 macOS MenuBar Telemetry Bridge (Extended Enterprise Edition)

<img width="2350" height="1332" alt="image" src="https://github.com/user-attachments/assets/af364c87-0506-48a9-b144-b19e62edd826" />

An enterprise-grade automation engine bridging JavaScript for Automation (JXA), Objective-C Cocoa framework components (`Foundation`/`AppKit`), and low-level POSIX Darwin shell abstractions. It implements atomic structural monitoring loops, persistent logging directly into system directory caches, and provides interactive control pipelines to manage memory leakage and system storage bloat.

## 🧠 Architectural Overview
The engine runs locally inside the standard Open Scripting Architecture (OSA) layer. Instead of consuming massive amounts of execution RAM via modern application packages, it handles native Cocoa events asynchronously under a minimal footprint.

### Telemetry Pipeline Schema
```text
[ JXA Runtime ] ──► [ Objective-C (NSFileHandle) ] ──► Real-Time System Log Matrix
       │
       ├──► [ POSIX Darwin Shell Commands ] ──► Hardware System State Parsing
       └──► [ Apple AppKit UI Modules ]     ──► Native Action Control Elements
```

## 🚀 Deployment Guide
No external dependencies or compilation layers required. Ensure you have file-writing privileges inside the default user application cache folders.

### Running via the Terminal Workspace
```bash
# Execute the source architecture framework using the raw OSA Script language configuration
osascript -l JavaScript telemetry_bridge.js
```

### Viewing Automated Telemetry Logs
To trace operational executions or diagnose faults, monitor the persistent background telemetry pipe logs:
```bash
tail -f ~/Library/Logs/telemetry_bridge.log
```
