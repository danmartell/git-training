# OpenClaw AI Agent Architecture Analysis

OpenClaw (formerly Clawdbot, then Moltbot) is an open-source, self-hosted AI
agent by Peter Steinberger. It connects LLMs (Claude, GPT, Gemini, etc.) to
messaging platforms (WhatsApp, Telegram, Slack, Discord, etc.) so you can
interact with an AI assistant from the chat apps you already use.

Repository: https://github.com/openclaw/openclaw
License: MIT | Runtime: Node.js >= 22 | Language: TypeScript | Stars: 150,000+

---

## 1. High-Level Repository Structure

```
openclaw/
├── apps/                      # Native platform apps
│   ├── android/               #   Android client
│   ├── ios/                   #   iOS client
│   ├── macos/                 #   macOS native app
│   └── shared/OpenClawKit/    #   Shared native code
├── extensions/                # Channel adapters (31 platforms)
│   ├── whatsapp/              #   WhatsApp (Baileys library)
│   ├── telegram/              #   Telegram (grammY)
│   ├── slack/                 #   Slack (Bolt SDK)
│   ├── discord/               #   Discord (discord.js)
│   ├── signal/                #   Signal
│   ├── msteams/               #   Microsoft Teams
│   ├── matrix/                #   Matrix protocol
│   ├── imessage/              #   iMessage
│   ├── googlechat/            #   Google Chat
│   ├── bluebubbles/           #   BlueBubbles (iMessage bridge)
│   ├── line/                  #   LINE
│   ├── nostr/                 #   Nostr protocol
│   ├── twitch/                #   Twitch chat
│   ├── zalo/ & zalouser/      #   Zalo messaging
│   ├── feishu/                #   Feishu/Lark
│   ├── mattermost/            #   Mattermost
│   ├── nextcloud-talk/        #   Nextcloud Talk
│   ├── tlon/                  #   Tlon/Urbit
│   ├── memory-core/           #   Core memory extension
│   ├── memory-lancedb/        #   LanceDB vector memory
│   ├── voice-call/            #   Voice calling
│   ├── lobster/               #   Lobster (mascot features)
│   ├── llm-task/              #   LLM task delegation
│   ├── copilot-proxy/         #   GitHub Copilot proxy
│   ├── diagnostics-otel/      #   OpenTelemetry diagnostics
│   └── open-prose/            #   Prose editing
├── skills/                    # 52 bundled skills (plugins)
│   ├── coding-agent/          #   Code writing/editing
│   ├── github/                #   GitHub operations
│   ├── browser/               #   Web browsing (not in src/)
│   ├── slack/ discord/        #   Platform-specific skills
│   ├── notion/ obsidian/      #   Note-taking integrations
│   ├── spotify-player/        #   Spotify control
│   ├── weather/               #   Weather lookup
│   ├── food-order/            #   Food ordering
│   ├── trello/                #   Trello boards
│   ├── 1password/             #   1Password integration
│   ├── clawhub/               #   ClawHub skill registry
│   └── ... (52 total)         #   Many more
├── src/                       # *** Core source code ***
│   ├── gateway/               #   WebSocket control plane
│   ├── agents/                #   Agent execution engine
│   ├── channels/              #   Channel abstraction layer
│   ├── routing/               #   Message routing logic
│   ├── config/                #   Configuration (124 files)
│   ├── memory/                #   Persistent memory + embeddings
│   ├── providers/             #   LLM provider auth
│   ├── sessions/              #   Session management
│   ├── cli/                   #   CLI interface
│   ├── browser/               #   Browser automation
│   ├── canvas-host/           #   A2UI visual workspace
│   ├── cron/                  #   Scheduled tasks
│   ├── hooks/                 #   Lifecycle hooks
│   ├── plugins/               #   Plugin system
│   ├── security/              #   Security layer
│   ├── tts/                   #   Text-to-speech
│   ├── media/                 #   Media handling
│   ├── media-understanding/   #   Image/doc comprehension
│   ├── link-understanding/    #   URL content extraction
│   ├── whatsapp/ telegram/    #   Platform-specific logic
│   ├── discord/ slack/        #   Platform-specific logic
│   ├── signal/ imessage/      #   Platform-specific logic
│   ├── macos/                 #   macOS integration
│   ├── web/                   #   Web channel
│   ├── tui/                   #   Terminal UI
│   ├── entry.ts               #   Process bootstrap
│   ├── index.ts               #   Main init + exports
│   └── runtime.ts             #   Runtime configuration
├── ui/                        # Web dashboard (React + Vite)
├── vendor/a2ui/               # A2UI visual canvas framework
├── packages/
│   ├── clawdbot/              # Legacy package name
│   └── moltbot/               # Legacy package name
├── docs/                      # Documentation
├── scripts/                   # Build utilities
├── openclaw.json              # Main config file
└── pnpm-workspace.yaml        # Monorepo workspace
```

## 2. Technology Stack

| Concern              | Technology                                     |
|----------------------|------------------------------------------------|
| Runtime              | Node.js >= 22                                  |
| Language             | TypeScript                                     |
| Package manager      | pnpm (monorepo)                                |
| Build                | tsdown                                         |
| Testing              | vitest                                         |
| Web UI               | React + Vite                                   |
| Gateway protocol     | WebSocket (ws://127.0.0.1:18789)               |
| Config validation    | Zod schemas                                    |
| Memory / embeddings  | SQLite + sqlite-vec (vector search)            |
| Embedding providers  | OpenAI, Gemini, Voyage                         |
| LLM providers        | Anthropic Claude, OpenAI GPT, Google Gemini,   |
|                      | OpenRouter, Ollama (local), GitHub Copilot,    |
|                      | Qwen                                           |
| WhatsApp             | Baileys (unofficial API)                       |
| Telegram             | grammY                                         |
| Slack                | Bolt SDK                                       |
| Discord              | discord.js                                     |
| Voice / TTS          | ElevenLabs, Sherpa-ONNX, OpenAI Whisper        |

## 3. Core Architecture Pattern

OpenClaw uses a **Gateway-Agent-Channel** architecture. The Gateway is a local
WebSocket server that acts as the central hub. Channels connect messaging
platforms to the Gateway. The Agent engine runs LLM conversations and executes
tools. Everything runs on the user's own machine.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S MACHINE                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    GATEWAY SERVER                             │   │
│  │              (WebSocket control plane)                        │   │
│  │           ws://127.0.0.1:18789 (default)                     │   │
│  │                                                               │   │
│  │  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌───────────────┐   │   │
│  │  │ Node    │  │ Session  │  │ Chat   │  │ Config /      │   │   │
│  │  │ Registry│  │ Manager  │  │ Router │  │ Auth Manager  │   │   │
│  │  └─────────┘  └──────────┘  └────────┘  └───────────────┘   │   │
│  └──────────────────────┬───────────────────────────────────────┘   │
│                         │                                           │
│          ┌──────────────┼──────────────┐                            │
│          │              │              │                             │
│          ▼              ▼              ▼                             │
│  ┌──────────────┐ ┌──────────┐ ┌────────────┐                      │
│  │   CHANNELS   │ │  AGENT   │ │   SKILLS   │                      │
│  │              │ │  ENGINE  │ │            │                      │
│  │ WhatsApp     │ │          │ │ 52 bundled │                      │
│  │ Telegram     │ │ LLM Loop │ │ + ClawHub  │                      │
│  │ Slack        │ │ Tools    │ │ registry   │                      │
│  │ Discord      │ │ Memory   │ │            │                      │
│  │ Signal       │ │ Sessions │ │ github     │                      │
│  │ iMessage     │ │          │ │ browser    │                      │
│  │ Teams        │ │          │ │ coding     │                      │
│  │ Matrix       │ │          │ │ notion     │                      │
│  │ ... (31)     │ │          │ │ ... (52)   │                      │
│  └──────────────┘ └──────────┘ └────────────┘                      │
│                         │                                           │
│                         ▼                                           │
│                 ┌───────────────┐                                   │
│                 │  LLM PROVIDER │                                   │
│                 │               │                                   │
│                 │ Claude API    │                                   │
│                 │ OpenAI API    │                                   │
│                 │ Gemini API    │                                   │
│                 │ Ollama (local)│                                   │
│                 │ OpenRouter    │                                   │
│                 └───────────────┘                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Boot Sequence

```
1.  entry.ts
    a. Set process title to "openclaw"
    b. Suppress Node.js experimental warnings (respawn if needed)
    c. Normalize Windows argv quirks
    d. Parse CLI profile arguments
    e. Dynamically import and call runCli()

2.  index.ts (runCli / buildProgram)
    a. Load .env file
    b. Normalize environment config
    c. Ensure openclaw binary is on PATH
    d. Enable structured logging
    e. Validate Node.js version compatibility
    f. Install unhandledRejection + uncaughtException handlers
    g. Parse CLI command and dispatch

3.  Gateway startup (startGatewayServer)
    a. Load and validate openclaw.json config (Zod schemas)
    b. Initialize node registry, session manager, chat registry
    c. Start WebSocket server on configured port
    d. Attach WS handlers (server-ws-runtime.ts)
    e. Register channel extensions (WhatsApp, Telegram, etc.)
    f. Initialize plugin system
    g. Start listening for connections
```

## 5. Core Subsystems

### 5.1 Gateway Server (`src/gateway/`)

The Gateway is the **central nervous system** — a WebSocket server that all
components connect to. It is the largest subsystem (~70+ source files).

**Key components:**
- `server.impl.ts` — Server initialization, attaches WS handlers
- `server-ws-runtime.ts` — WebSocket connection handling
- `server-chat.ts` — Chat message processing + agent dispatch
- `server-channels.ts` — Channel lifecycle management
- `server-broadcast.ts` — Fan-out messaging to connected clients
- `node-registry.ts` — Tracks connected nodes (mobile, desktop, web)
- `session-utils.ts` — Session creation, persistence, and resolution
- `auth.ts` / `device-auth.ts` — Authentication and device pairing
- `hooks.ts` — Lifecycle hooks (before/after events)
- `config-reload.ts` — Hot config reloading
- `openai-http.ts` — OpenAI-compatible HTTP endpoint

**Communication patterns:**
- `broadcast()` — Send to all connected clients
- `nodeSendToSession()` — Target a specific session
- `nodeSendToAllSubscribed()` — Reach subscribed listeners

### 5.2 Agent Engine (`src/agents/`)

The agent engine is the **brain** — it runs LLM conversations with tool use.
This is the second-largest subsystem (~298 files).

**Execution flow:**

```
Incoming message
    │
    ▼
resolveAgentRoute()          ← Pick which agent handles this
    │
    ▼
runEmbeddedPiAgent()         ← Orchestration layer
    │
    ├─ Select model + auth profile
    ├─ Validate context window size
    ├─ Handle failover (rate limits, auth errors)
    │
    ▼
runEmbeddedAttempt()         ← Core conversation loop
    │
    ├─ Build system prompt (buildEmbeddedSystemPrompt)
    ├─ Send messages to LLM
    ├─ Process tool calls
    ├─ Handle context overflow (auto-compaction, up to 3 retries)
    ├─ Track tool metadata + errors
    └─ Return response
```

**Key files:**
- `pi-embedded-runner/run.ts` — Main agent execution orchestration
- `pi-embedded-runner/system-prompt.ts` — Dynamic system prompt construction
- `pi-embedded-runner/model.ts` — Model selection and capabilities
- `pi-embedded-runner/session-manager-init.ts` — Session initialization
- `pi-embedded-runner/history.ts` — Conversation history management
- `pi-embedded-runner/compact.ts` — Context window compaction
- `model-catalog.ts` — Model registry and capabilities
- `model-selection.ts` / `model-fallback.ts` — Model picking + fallback
- `bash-tools.ts` — Shell command execution for the agent
- `skills/` — Skill loading and management
- `sandbox/` — Sandboxed execution environment
- `cli-runner/` — Claude CLI integration

**Resilience features:**
- Auth profile rotation on rate limits
- Automatic thinking-level downgrade for unsupported models
- Context overflow auto-compaction (summarizes history, retries up to 3x)
- Transient vs permanent error classification

### 5.3 Routing (`src/routing/`)

Routes incoming messages to the correct agent using a **hierarchical matching
strategy**:

```
1. Peer binding      → Exact DM/user match
2. Parent peer       → Thread inheritance from parent conversation
3. Guild matching    → Discord server-level routing
4. Team matching     → Organization/team routing
5. Account-specific  → Account-level fallback
6. Wildcard channel  → Catch-all account bindings
7. Default agent     → System default (final fallback)
```

This enables **multi-agent deployments** — different agents for different
channels, teams, or individual conversations. Each route resolves to a
`sessionKey` for persistence and a `matchedBy` field for debugging.

### 5.4 Channels & Extensions (`src/channels/` + `extensions/`)

Channels are the **messaging platform adapters**. Each extension translates
between a platform's API and OpenClaw's internal message format.

**Channel abstraction layer (`src/channels/`):**
- `registry.ts` — Channel registration and discovery
- `channel-config.ts` — Per-channel configuration
- `sender-identity.ts` — Who sent the message
- `chat-type.ts` — DM vs group vs channel classification
- `allowlist-match.ts` — User/group allow/deny lists
- `mention-gating.ts` — Only respond when @mentioned
- `command-gating.ts` — Command prefix filtering
- `typing.ts` — Typing indicator management
- `ack-reactions.ts` — Read receipts and reactions

**31 platform extensions** including WhatsApp, Telegram, Slack, Discord,
Signal, iMessage, Teams, Matrix, Google Chat, LINE, Nostr, Twitch,
Mattermost, Nextcloud Talk, Feishu, Zalo, and more.

### 5.5 Memory System (`src/memory/`)

Provides **persistent, searchable memory** using vector embeddings:

```
User message → Embedding → SQLite + sqlite-vec → Similarity search
```

**Components:**
- `manager.ts` — Core memory CRUD operations
- `manager-search.ts` — Semantic search across stored memories
- `embeddings.ts` — Embedding generation abstraction
- `embeddings-openai.ts` / `embeddings-gemini.ts` / `embeddings-voyage.ts`
  — Provider-specific embedding implementations
- `sqlite.ts` + `sqlite-vec.ts` — SQLite storage with vector extensions
- `hybrid.ts` — Hybrid search (keyword + semantic)
- `session-files.ts` — Session transcript persistence
- `sync-session-files.ts` / `sync-memory-files.ts` — Sync mechanisms
- Batch processing for bulk embedding operations

### 5.6 Tools (`src/agents/tools/`)

The agent has access to **~60 tools** it can invoke during conversations:

| Category        | Tools                                                |
|-----------------|------------------------------------------------------|
| **Web**         | browser, web-fetch, web-search, image                |
| **Communication** | Discord (guild, message, moderation), Slack, Telegram, WhatsApp |
| **Sessions**    | list, send, spawn, history, status, announce         |
| **Execution**   | agent-step, gateway, cron, canvas                    |
| **Data**        | memory (store/retrieve with citations)               |
| **System**      | agents-list, nodes, TTS                              |

Tools are defined with schemas and exposed to the LLM as function-calling
definitions. The agent can chain tool calls autonomously.

### 5.7 Skills (`skills/`)

Skills are **higher-level plugins** — 52 bundled, plus a skill registry
(ClawHub) for discovering community skills at runtime.

**Categories:**
- **Productivity**: notion, obsidian, trello, apple-notes, apple-reminders,
  bear-notes, things-mac
- **Communication**: slack, discord, imsg, wacli (WhatsApp CLI)
- **Development**: coding-agent, github, tmux
- **AI/LLM**: gemini, clawhub, model-usage, openai-image-gen
- **Media**: spotify-player, songsee, video-frames, nano-pdf, peekaboo
  (screenshots)
- **Voice**: voice-call, sherpa-onnx-tts, openai-whisper
- **Utilities**: weather, food-order, healthcheck, summarize, blogwatcher
- **Home automation**: openhue (Philips Hue), sonoscli (Sonos)
- **Meta**: skill-creator (create new skills via the agent itself)

### 5.8 Configuration (`src/config/`)

Massive configuration system (124 files) using **Zod schemas** for validation:

- `openclaw.json` — Main config file
- Zod schemas: `zod-schema.core.ts`, `zod-schema.agents.ts`,
  `zod-schema.channels.ts`, `zod-schema.providers.ts`
- Per-channel type definitions for every supported platform
- `env-substitution.ts` — Environment variable interpolation in configs
- `merge-config.ts` — Deep config merging
- `legacy.ts` through `legacy.migrations.part-3.ts` — Config migration from
  Clawdbot/Moltbot eras
- Hot-reloading via `config-reload.ts` in the gateway

### 5.9 Web Dashboard (`ui/`)

A React + Vite web application for managing OpenClaw:

- Chat interface for web-based interaction
- Session monitoring and management
- Configuration UI
- Built with `pnpm ui:build`

### 5.10 Native Apps (`apps/`)

Platform-native clients for mobile and desktop:

- **macOS** — Native app with voice wake word detection
- **iOS** — Mobile client
- **Android** — Mobile client
- **OpenClawKit** — Shared native framework used by all three

## 6. Message Flow (End to End)

```
┌──────────┐     ┌────────────┐     ┌─────────┐     ┌──────────┐
│ WhatsApp │────▶│ Extension  │────▶│ Gateway │────▶│ Router   │
│ User msg │     │ (Baileys)  │     │ (WS)    │     │          │
└──────────┘     └────────────┘     └─────────┘     └────┬─────┘
                                                         │
                    resolveAgentRoute()                   │
                    ┌────────────────────────────────────┘
                    │
                    ▼
             ┌─────────────┐
             │ Agent Engine │
             │              │
             │ 1. Load session history
             │ 2. Build system prompt
             │ 3. Send to LLM ──────────────▶ Claude/GPT/Gemini API
             │ 4. Receive response ◀──────────
             │ 5. If tool_call:
             │    a. Execute tool (browser, memory, shell, etc.)
             │    b. Send result back to LLM
             │    c. Loop to step 3
             │ 6. Final text response
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐     ┌────────────┐     ┌──────────┐
             │ Gateway     │────▶│ Extension  │────▶│ WhatsApp │
             │ (broadcast) │     │ (Baileys)  │     │ Reply    │
             └─────────────┘     └────────────┘     └──────────┘
```

**Simultaneously**, the same message and response can be observed via:
- Web dashboard (WebSocket connection to Gateway)
- Native app (WebSocket connection to Gateway)
- CLI / TUI (direct process connection)

## 7. Multi-Agent Routing

OpenClaw supports running **multiple isolated agents** on one instance:

```yaml
# openclaw.json (simplified)
agents:
  work-agent:
    model: claude-sonnet-4-5-20250929
    systemPrompt: "You are a professional assistant..."
    bindings:
      - channel: slack
        account: work-slack

  personal-agent:
    model: gpt-4o
    systemPrompt: "You are a casual helper..."
    bindings:
      - channel: whatsapp
        peer: "+1234567890"

  coding-agent:
    model: claude-sonnet-4-5-20250929
    skills: [coding-agent, github]
    bindings:
      - channel: discord
        guild: "dev-server"
```

Each agent gets its own workspace, session store, model configuration, and
system prompt. The router matches incoming messages to agents by channel,
account, peer, guild, or team.

## 8. Key Design Patterns

| Pattern                | Where Used                                          |
|------------------------|-----------------------------------------------------|
| Gateway / Hub-and-Spoke| Central WebSocket server, all components connect    |
| Plugin / Extension     | 31 channel extensions, 52 skills, tool system       |
| Agent Loop             | LLM conversation with iterative tool execution      |
| Hierarchical Routing   | Multi-level message-to-agent resolution             |
| Embedding + Vector DB  | Semantic memory with SQLite-vec                     |
| Auto-Compaction        | Context window overflow recovery                    |
| Profile Failover       | Rotate auth profiles on rate limits                 |
| Zod Schema Validation  | Type-safe config with runtime validation            |
| Monorepo               | pnpm workspace with shared packages                 |
| Legacy Migration       | Config migration across Clawdbot/Moltbot/OpenClaw   |

## 9. Security Model

OpenClaw runs **entirely on the user's machine** — no cloud relay:

- Gateway binds to `127.0.0.1` (localhost only) by default
- Device authentication required for mobile/remote nodes
- Origin checking for WebSocket connections
- Sandbox mode available for agent tool execution
- Tool policies control what the agent can/cannot do

**Known concerns (per security researchers):**
- Unauthenticated WebSocket (CVE-2026-25253) — since patched
- Broad permissions required (file system, shell, messaging APIs)
- Supply chain risk from community skills
- Agent autonomy risks (can send messages, delete emails, browse web)

## 10. Project Statistics

- **GitHub Stars**: 150,000+
- **Forks**: 20,000+
- **Contributors**: 19+
- **License**: MIT
- **Language**: TypeScript (primary), with native Swift/Kotlin for mobile
- **Naming History**: warelay -> clawdis -> Clawdbot -> Moltbot -> OpenClaw
- **Creator**: Peter Steinberger (founder of PSPDFKit)
