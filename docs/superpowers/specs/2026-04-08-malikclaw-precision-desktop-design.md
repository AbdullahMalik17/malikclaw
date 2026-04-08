# Design Spec: MalikClaw Precision Desktop App

**Date:** 2026-04-08
**Status:** Approved
**Topic:** High-Performance Offline AI Agent Desktop Application

## 1. Objective
Transform MalikClaw from a terminal/browser-based utility into a unified, high-precision desktop application. The goal is to provide a "Proper Capability" experience, specifically optimized for **High-Performance Offline Operations** using local models (Ollama, vLLM, etc.).

## 2. Architecture
The application uses **Wails v2** to bridge a high-performance **Go** backend with a modern **React** frontend.

- **Backend (Go):** Handles the "Agent Loop," process management, direct communication with local LLM providers, and native OS integrations (Tray, Notifications, Resource Monitoring).
- **Frontend (React + Tailwind):** Provides a high-precision, low-latency interface for interaction, parameter tuning, and performance visualization.
- **Bridge:** Wails Bindings replace traditional HTTP REST calls for internal communication, reducing overhead and improving security.

## 3. Core Components

### 3.1 Precision Performance Dashboard
- **Real-time Metrics:** Streaming display of Tokens Per Second (TPS), VRAM usage, and GPU/CPU utilization.
- **Streaming UI:** Optimized message rendering for "typewriter" style streaming from local models.
- **Thought/Action Logs:** An expandable "under-the-hood" view showing exactly what tools the agent is calling and what files it's reading.

### 3.2 Parameter Tuning & Model Management
- **Live Tuning:** Adjust `Temperature`, `Top-P`, and `Repeat Penalty` via native sliders during a conversation.
- **Model Switcher:** One-click switching between local models (e.g., Llama-3 to DeepSeek) with visual feedback on "Load Time."
- **Context Management:** Visual indicator of current context window usage and "Context Reset" controls.

### 3.3 System Integration
- **System Tray Companion:** Minimize-to-tray support to keep models "warmed up" in the background.
- **Native Notifications:** Alerts for completed long-running tasks or agent-initiated interventions.
- **Global Shortcut:** A configurable hotkey (e.g., `Alt+Space`) to quickly summon/hide the agent window.

## 4. User Experience (UX)
- **RTL Support:** Native Right-to-Left (RTL) support for Urdu-first interactions.
- **Dark/Light Themes:** High-contrast themes designed for long-term engineering and research tasks.
- **Drag-and-Drop:** Native file handling to provide the agent with local context instantly.

## 5. Implementation Strategy
1. **Scaffold:** Initialize Wails v2 project in `cmd/malikclaw-desktop`.
2. **Backend Bridge:** Port existing `web/backend` logic to Wails Bindings.
3. **Frontend Port:** Move `web/frontend` to the Wails `frontend` directory and update API calls to use Wails Runtime.
4. **Precision Features:** Implement the Performance Monitor and Parameter Tuning Panel.
5. **Native Polish:** Add Tray icons, Window lifecycle management, and Shortcuts.

## 6. Success Criteria
- The application runs as a single static binary.
- Real-time performance metrics (TPS) are accurate to within 100ms.
- Switching local models takes fewer than 3 clicks.
- The app remains responsive even when the GPU is under 100% load from the LLM.
