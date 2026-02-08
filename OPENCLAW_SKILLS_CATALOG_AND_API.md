# OpenClaw Skills — Full Catalog & API Reference

## The 52 Bundled Skills

Skills follow the Anthropic Agent Skill convention — an open standard for
AI coding assistants. A skill is fundamentally just a `SKILL.md` file
injected into the agent's system prompt, optionally with helper scripts
and assets.

### Catalog

| # | Skill | Category | What It Does |
|---|-------|----------|-------------|
| 1 | **1password** | Security | Query and manage 1Password vault entries |
| 2 | **apple-notes** | Productivity | Create/search/edit Apple Notes (macOS) |
| 3 | **apple-reminders** | Productivity | Manage Apple Reminders (macOS) |
| 4 | **bear-notes** | Productivity | Interface with Bear note-taking app (macOS) |
| 5 | **blogwatcher** | Utilities | Monitor blogs/RSS feeds for new posts |
| 6 | **blucli** | System | Bluetooth device management via CLI |
| 7 | **bluebubbles** | Communication | iMessage bridge via BlueBubbles server |
| 8 | **camsnap** | Media | Capture photos from webcam/camera |
| 9 | **canvas** | Visual | Create visual workspaces with A2UI framework |
| 10 | **clawhub** | Meta | Browse and install skills from ClawHub registry |
| 11 | **coding-agent** | Development | Run coding agents (Codex CLI, Claude Code, Pi) with PTY support |
| 12 | **discord** | Communication | Discord server management, messaging, moderation |
| 13 | **eightctl** | System | Control EightSleep smart mattress |
| 14 | **food-order** | Utilities | Place food delivery orders |
| 15 | **gemini** | AI/LLM | Interact with Google Gemini models |
| 16 | **gifgrep** | Media | Search and find GIFs |
| 17 | **github** | Development | GitHub CLI wrapper (`gh`) for issues, PRs, CI, API |
| 18 | **gog** | Utilities | GOG.com game library management |
| 19 | **goplaces** | Utilities | Location/places lookup and recommendations |
| 20 | **healthcheck** | System | Monitor system and service health |
| 21 | **himalaya** | Communication | Terminal email client (IMAP/SMTP) |
| 22 | **imsg** | Communication | Send/receive iMessages (macOS) |
| 23 | **local-places** | Utilities | Find nearby businesses, restaurants, etc. |
| 24 | **mcporter** | Development | MCP (Model Context Protocol) server management |
| 25 | **model-usage** | AI/LLM | Track and report LLM token usage/costs |
| 26 | **nano-banana-pro** | Media | Banana.dev image generation |
| 27 | **nano-pdf** | Media | Read, summarize, and extract content from PDFs |
| 28 | **notion** | Productivity | Create/query/edit Notion pages and databases |
| 29 | **obsidian** | Productivity | Interface with Obsidian vaults |
| 30 | **openai-image-gen** | AI/LLM | Generate images via OpenAI DALL-E |
| 31 | **openai-whisper-api** | Voice | Transcribe audio via OpenAI Whisper API |
| 32 | **openai-whisper** | Voice | Transcribe audio via local Whisper model |
| 33 | **openhue** | Home Automation | Control Philips Hue lights |
| 34 | **oracle** | AI/LLM | Query/compare multiple LLM providers |
| 35 | **ordercli** | Utilities | Command-line ordering interface |
| 36 | **peekaboo** | Media | Take screenshots and screen captures |
| 37 | **sag** | Development | Source code analysis and grep |
| 38 | **session-logs** | System | View and manage agent session transcripts |
| 39 | **sherpa-onnx-tts** | Voice | Local text-to-speech via Sherpa-ONNX |
| 40 | **skill-creator** | Meta | Create new skills (meta-skill with scaffold scripts) |
| 41 | **slack** | Communication | Slack messaging and workspace interaction |
| 42 | **songsee** | Media | Music recognition (Shazam-like) |
| 43 | **sonoscli** | Home Automation | Control Sonos speakers |
| 44 | **spotify-player** | Media | Control Spotify playback (Premium required) |
| 45 | **summarize** | Utilities | Summarize articles, documents, web pages |
| 46 | **things-mac** | Productivity | Manage Things 3 tasks (macOS) |
| 47 | **tmux** | Development | Terminal multiplexer session management |
| 48 | **trello** | Productivity | Manage Trello boards, lists, and cards |
| 49 | **video-frames** | Media | Extract and analyze frames from video files |
| 50 | **voice-call** | Voice | Make and receive voice calls |
| 51 | **wacli** | Communication | WhatsApp CLI for direct message management |
| 52 | **weather** | Utilities | Weather lookup via wttr.in + Open-Meteo (no API key) |

### Community Skills (via ClawHub)

Beyond the 52 bundled skills, ClawHub (OpenClaw's skill registry) hosts
**5,705 community skills** (3,009 curated). Categories include DevOps & Cloud,
Marketing & Sales, Search & Research, Healthcare, IoT, Gaming, and more.

Install community skills with:
```bash
npx clawhub@latest install <skill-slug>
```

---

## Skill API — How Skills Work

### A Skill Is Just a SKILL.md File

The fundamental insight: **a skill is a markdown file with YAML frontmatter
that gets injected into the LLM's system prompt.** That's it. There's no
compiled code, no TypeScript SDK, no build step. The LLM reads the markdown
instructions and uses them to know how to accomplish things — typically by
calling shell commands via its bash tool.

```
skills/
  weather/
    SKILL.md          ← The only required file

  github/
    SKILL.md          ← Instructions + CLI examples

  skill-creator/
    SKILL.md          ← Instructions for creating skills
    scripts/          ← Helper scripts the agent can run
      init_skill.py
      package_skill.py
      quick_validate.py
    license.txt
```

### SKILL.md Format

Every skill follows the same format — YAML frontmatter + markdown body:

```markdown
---
name: my-skill
description: "Short description of what this skill does"
metadata:
  {
    "openclaw":
      {
        "emoji": "🔧",
        "requires": { "bins": ["some-cli-tool"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "some-cli-tool",
              "bins": ["some-cli-tool"],
              "label": "Install via Homebrew"
            },
            {
              "id": "apt",
              "kind": "apt",
              "package": "some-cli-tool",
              "bins": ["some-cli-tool"],
              "label": "Install via apt"
            }
          ]
      }
  }
---

# My Skill

Instructions for the agent on how to use this skill.

## Common Operations

Run this command to do X:

```bash
some-cli-tool action --flag value
```

To do Y:

```bash
some-cli-tool other-action "query"
```
```

### Frontmatter Fields

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique skill identifier (kebab-case) |
| `description` | string | What the skill does (shown in skill listings) |

#### Optional Metadata (`metadata.openclaw`)

| Field | Type | Description |
|-------|------|-------------|
| `emoji` | string | Display emoji for the skill |
| `homepage` | string | URL to skill documentation |
| `skillKey` | string | Override key for skill registry |
| `primaryEnv` | string | Primary env var the skill needs |
| `os` | string[] | Supported OS list (e.g., `["macos", "linux"]`) |
| `requires.bins` | string[] | CLI binaries that must be installed |
| `requires.envs` | string[] | Environment variables that must be set |
| `requires.configs` | string[] | Config files that must exist |
| `install` | InstallSpec[] | How to install dependencies |
| `user-invocable` | boolean | Can the user trigger this skill directly? (default: true) |
| `disable-model-invocation` | boolean | Prevent the LLM from auto-invoking? (default: false) |

#### Install Spec Types

Skills can declare how to install their dependencies:

```yaml
install:
  - id: "brew"
    kind: "brew"        # Homebrew
    formula: "gh"
    bins: ["gh"]

  - id: "apt"
    kind: "apt"         # Debian/Ubuntu apt
    package: "gh"
    bins: ["gh"]

  - id: "npm"
    kind: "node"        # npm/pnpm/yarn/bun
    package: "some-tool"
    bins: ["some-tool"]

  - id: "go"
    kind: "go"          # Go install
    module: "github.com/user/tool@latest"
    bins: ["tool"]

  - id: "uv"
    kind: "uv"          # Python uv
    package: "some-tool"

  - id: "download"
    kind: "download"    # Direct URL download
    url: "https://example.com/tool.tar.gz"
    extract: true
    targetDir: "/usr/local/bin"
```

### Skill Loading — Three-Level Progressive Disclosure

Skills are loaded into the agent's context using a three-level system to
manage the context window efficiently:

```
Level 1: Skill List
  The agent sees a list of available skills with names + descriptions.
  Minimal context cost (~1 line per skill).

Level 2: SKILL.md Body
  When a skill is activated (by user command or model decision), the
  full SKILL.md body is injected into the system prompt. The agent
  now has the detailed instructions.

Level 3: Bundled Resources
  If the skill has scripts/, references/, or assets/ directories,
  the agent can read/execute them as needed during the conversation.
```

### Skill Resolution Priority

When multiple locations have skills with the same name:

```
1. Workspace skills    (./skills/ in current project)    ← Highest priority
2. Local user skills   (~/.openclaw/skills/)
3. Bundled skills      (openclaw repo skills/)           ← Lowest priority
```

### Skill Loading Internals (`src/agents/skills/`)

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript types: SkillEntry, SkillInstallSpec, SkillCommandSpec, SkillInvocationPolicy, SkillSnapshot, SkillEligibilityContext |
| `frontmatter.ts` | Parses YAML frontmatter from SKILL.md files, resolves metadata, install specs, and invocation policies |
| `bundled-dir.ts` | Discovers skills in the bundled `skills/` directory |
| `workspace.ts` | Discovers skills in workspace `./skills/` directories |
| `config.ts` | Reads skill configuration from `openclaw.json` |
| `env-overrides.ts` | Handles environment variable overrides for skills |
| `plugin-skills.ts` | Loads skills from plugins |
| `refresh.ts` | Refreshes skill list (hot-reload) |
| `serialize.ts` | Serializes skill loading with per-key task queues |
| `bundled-context.ts` | Prepares skill context for system prompt injection |

### Eligibility Checking

Before a skill is activated, OpenClaw checks:

1. **Platform** — Is the OS in the skill's `os` list?
2. **Binaries** — Are required CLI tools installed?
3. **Environment** — Are required env vars set?
4. **Config** — Do required config files exist?

If checks fail, the skill is marked unavailable and the agent won't try to
use it.

---

## How to Create a New Skill

### Option 1: By Hand (Simplest)

Create a single file:

```bash
mkdir -p ~/.openclaw/skills/my-skill
cat > ~/.openclaw/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: "Does something useful via the my-tool CLI"
metadata:
  {
    "openclaw":
      {
        "emoji": "🛠️",
        "requires": { "bins": ["my-tool"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "my-tool",
              "bins": ["my-tool"],
              "label": "Install my-tool via Homebrew"
            }
          ]
      }
  }
---

# My Skill

Use `my-tool` to do useful things.

## Search

```bash
my-tool search "query"
```

## Create

```bash
my-tool create --name "item name" --body "content"
```

## List

```bash
my-tool list --format json | jq '.items[] | .name'
```
EOF
```

That's it. Restart the gateway and the skill is live.

### Option 2: Via the skill-creator Meta-Skill

Ask OpenClaw itself to create a skill:

> "Create a skill for managing my Jira tickets using the jira CLI"

The `skill-creator` skill includes scaffold scripts:
- `init_skill.py` — Initialize skill directory structure
- `package_skill.py` — Package for distribution
- `quick_validate.py` — Validate SKILL.md format

### Option 3: Publish to ClawHub

After creating and testing locally, publish for others:

```bash
npx clawhub@latest publish ./skills/my-skill
```

### Skill Writing Best Practices

From the skill-creator guidelines:

1. **The context window is a public good** — Keep instructions concise. The
   SKILL.md shares space with conversation history, tools, and other skills.

2. **Assume the agent is intelligent** — Don't over-explain. Show command
   examples, not paragraphs of explanation.

3. **Use progressive disclosure** — Put the most common operations first.
   Put edge cases at the bottom or in reference files.

4. **Show concrete examples** — Bash command examples are the core of a
   skill. The agent learns by example.

5. **Declare dependencies** — Always fill in `requires.bins` so the agent
   (and the user) knows what needs to be installed.

6. **Include install specs** — Provide install instructions for multiple
   package managers so the agent can auto-install dependencies.

---

## Real Skill Examples

### Minimal (weather)

Just two free APIs, no dependencies, no config:

```markdown
---
name: weather
description: "Look up weather using free services (no API key needed)"
---

# Weather Skill

## wttr.in (preferred)

```bash
curl -s "wttr.in/London?format=3"
```

Formats: %c conditions, %t temp, %h humidity, %w wind.
Metric: ?m  Current only: ?0  Today only: ?1

## Open-Meteo (fallback, JSON)

```bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"
```
```

### CLI Wrapper (github)

Wraps the `gh` CLI with examples and install specs:

```markdown
---
name: github
description: "Interact with GitHub using the gh CLI"
metadata:
  {
    "openclaw":
      {
        "emoji": "🐙",
        "requires": { "bins": ["gh"] },
        "install":
          [
            { "id": "brew", "kind": "brew", "formula": "gh", "bins": ["gh"] },
            { "id": "apt", "kind": "apt", "package": "gh", "bins": ["gh"] }
          ]
      }
  }
---

# GitHub Skill

Use `gh` CLI for GitHub operations.

## PRs
```bash
gh pr checks 55 --repo owner/repo
gh run list --repo owner/repo --limit 10
gh run view <run-id> --repo owner/repo --log-failed
```

## API
```bash
gh api repos/owner/repo/pulls/55 --jq '.title, .state'
```

## JSON output
```bash
gh issue list --repo owner/repo --json number,title --jq '.[] | "\(.number): \(.title)"'
```
```

### Complex (skill-creator)

Includes helper scripts for scaffolding:

```
skills/skill-creator/
├── SKILL.md              # Instructions for creating skills
├── scripts/
│   ├── init_skill.py     # Scaffold new skill directory
│   ├── package_skill.py  # Package skill for distribution
│   └── quick_validate.py # Validate SKILL.md format
└── license.txt
```

### Complex (coding-agent)

Teaches the agent how to run sub-agents (Claude Code, Codex CLI, etc.)
with PTY mode, background sessions, and process management. No external
binary required — it orchestrates other AI coding tools.
