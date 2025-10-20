# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A real-time observability system for monitoring Claude Code agents through comprehensive hook event tracking. This system captures, stores, and visualizes Claude Code [Hook events](https://docs.anthropic.com/en/docs/claude-code/hooks) enabling monitoring of multiple concurrent agents with session tracking, event filtering, and live updates.

**Architecture Flow**: `Claude Agents → Hook Scripts → HTTP POST → Bun Server → SQLite → WebSocket → Vue Client`

## Key Concept: Agent Identification

**CRITICAL**: Every hook event uses `source_app` + `session_id` to uniquely identify an agent.
- Display format: `"source_app:session_id"` with session_id truncated to first 8 characters
- This combination allows tracking multiple agents across different projects simultaneously

## Development Commands

### Quick Start
```bash
# Start entire system (server + client)
./scripts/start-system.sh

# Stop entire system
./scripts/reset-system.sh

# Test system health
./scripts/test-system.sh

# Access UI
# http://localhost:5173
```

### Server (Bun + TypeScript)
```bash
cd apps/server

# Development with hot reload
bun run dev           # Runs on port 4000

# Production
bun run start

# Type checking
bun run typecheck
```

### Client (Vue 3 + Vite)
```bash
cd apps/client

# Development server
bun run dev          # or: npm run dev (runs on port 5173)

# Build for production
bun run build

# Preview production build
bun run preview
```

### Testing
```bash
# System validation
./scripts/test-system.sh

# Manual event test
curl -X POST http://localhost:4000/events \
  -H "Content-Type: application/json" \
  -d '{
    "source_app": "test",
    "session_id": "test-123",
    "hook_event_type": "PreToolUse",
    "payload": {"tool_name": "Bash", "tool_input": {"command": "ls"}}
  }'
```

## Technology Preferences

**IMPORTANT**: This project uses **Bun** as the default runtime and package manager (see `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`).

### Bun Defaults
- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun install` instead of `npm install` or `yarn install`
- Use `bun run <script>` instead of `npm run <script>`
- Use `bun:sqlite` for SQLite (NOT `better-sqlite3`)
- Use built-in `WebSocket` (NOT `ws` package)
- Prefer `Bun.file` over `node:fs` readFile/writeFile
- Bun automatically loads `.env` files (no need for `dotenv` package)

### Bun APIs Used in This Project
- `Bun.serve()` with WebSocket support (server)
- `bun:sqlite` Database class (database layer)
- Built-in WebSocket for real-time communication

## Architecture

### Components

1. **Hook Scripts** (`.claude/hooks/`, Python with uv):
   - `send_event.py` - Universal event sender to server
   - `pre_tool_use.py` - Tool validation & blocking before execution
   - `post_tool_use.py` - Result logging after tool execution
   - `user_prompt_submit.py` - User prompt logging & validation
   - `notification.py` - User interaction events
   - `stop.py` - Session completion
   - `subagent_stop.py` - Subagent completion
   - `pre_compact.py` - Context compaction tracking
   - `session_start.py` - Session initialization
   - `session_end.py` - Session termination

2. **Server** (`apps/server/`, Bun + TypeScript):
   - **Database** (`src/db.ts`): SQLite with WAL mode for concurrent access
   - **Main Server** (`src/index.ts`): HTTP + WebSocket endpoints
   - **Types** (`src/types.ts`): TypeScript interfaces
   - **Ports**: 4000 (HTTP/WebSocket)

3. **Client** (`apps/client/`, Vue 3 + TypeScript):
   - **App.vue**: Main app with theme & WebSocket management
   - **EventTimeline.vue**: Event list with auto-scroll
   - **EventRow.vue**: Individual event display
   - **FilterPanel.vue**: Multi-select filters
   - **LivePulseChart.vue**: Real-time activity chart
   - **Ports**: 5173 (Vite dev server)

### Database Schema

**Events Table** (`events.db`):
```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_app TEXT NOT NULL,           -- Project identifier
  session_id TEXT NOT NULL,           -- Claude session ID
  hook_event_type TEXT NOT NULL,      -- Event type (PreToolUse, PostToolUse, etc.)
  payload TEXT NOT NULL,              -- JSON payload with event data
  chat TEXT,                          -- Optional chat transcript
  summary TEXT,                       -- Optional AI-generated summary
  humanInTheLoop TEXT,                -- HITL data (optional)
  humanInTheLoopStatus TEXT,          -- HITL status (pending/approved/rejected)
  model_name TEXT,                    -- Model used (e.g., claude-sonnet-4.5)
  timestamp INTEGER NOT NULL
);
```

**Indexes**: source_app, session_id, hook_event_type, timestamp

### Server Endpoints

- `POST /events` - Receive events from agents
- `GET /events/recent?limit=100&source_app=X&session_id=Y&hook_event_type=Z` - Paginated event retrieval with filters
- `GET /events/filter-options` - Available filter values
- `WS /stream` - Real-time event broadcasting to clients
- `POST /events/:id/hitl-response` - Submit human-in-the-loop responses

### Event Types

| Event Type       | Emoji | Purpose                |
| ---------------- | ----- | ---------------------- |
| PreToolUse       | 🔧     | Before tool execution  |
| PostToolUse      | ✅     | After tool completion  |
| Notification     | 🔔     | User interactions      |
| Stop             | 🛑     | Response completion    |
| SubagentStop     | 👥     | Subagent finished      |
| PreCompact       | 📦     | Context compaction     |
| UserPromptSubmit | 💬     | User prompt submission |
| SessionStart     | 🚀     | Session started        |
| SessionEnd       | 🏁     | Session ended          |

## Hook System Integration

### Setting Up Hooks in Other Projects

1. Copy the `.claude` directory to your project:
   ```bash
   cp -R .claude /path/to/your/project/
   ```

2. Update `.claude/settings.json` with your project's `source_app`:
   ```json
   {
     "hooks": {
       "PreToolUse": [{
         "matcher": "",
         "hooks": [{
           "type": "command",
           "command": "uv run .claude/hooks/send_event.py --source-app YOUR_PROJECT_NAME --event-type PreToolUse --summarize"
         }]
       }]
     }
   }
   ```

3. Ensure observability server is running (`./scripts/start-system.sh`)

### Hook Script Arguments

`send_event.py` supports:
- `--source-app` - Project identifier (required)
- `--event-type` - Hook event type (required)
- `--summarize` - Enable AI summarization of event
- `--add-chat` - Include conversation history

## Environment Variables

**Project Root** (`.env`):
```bash
ANTHROPIC_API_KEY=      # Required for AI features
ENGINEER_NAME=          # Your name (for logging)
OPENAI_API_KEY=         # Optional for multi-model support
ELEVENLABS_API_KEY=     # Optional for audio features
```

**Client** (`apps/client/.env`):
```bash
VITE_MAX_EVENTS_TO_DISPLAY=100  # Max events shown (removes oldest)
```

## Data Flow

1. **Event Generation**: Claude Code executes action → Hook triggers
2. **Data Collection**: Hook script gathers context (tool name, inputs, outputs, session ID)
3. **Transmission**: `send_event.py` sends JSON to `POST /events`
4. **Server Processing**: Validates → Stores in SQLite → Broadcasts via WebSocket
5. **Client Update**: Vue app receives event → Updates timeline in real-time

## Troubleshooting

### Hook Scripts Not Working

If hooks don't execute, it may be due to relative paths in `.claude/settings.json`. Use absolute paths for reliability.

**Solution**: Run the slash command:
```bash
/convert_paths_absolute
```

This auto-converts all relative hook paths to absolute paths and creates a backup.

## Client Features

- **Real-time Updates**: WebSocket-based live event streaming
- **Multi-criteria Filtering**: By app, session, event type
- **Live Pulse Chart**: Session-colored bars with event type indicators
- **Time Ranges**: 1m, 3m, 5m with data aggregation
- **Chat Transcripts**: View full conversation history
- **Auto-scroll**: With manual override
- **Theme Support**: Dark/light mode
- **Dual-color System**: App colors (left border) + Session colors (second border)

## Security Features

- Blocks dangerous commands (`rm -rf`, etc.) in `pre_tool_use.py`
- Prevents access to sensitive files (`.env`, private keys)
- Validates all inputs before execution
- Scrubs sensitive data in hook scripts

## Adding New Hook Types

When adding a new hook type:

1. Create hook script in `.claude/hooks/` (follow existing patterns)
2. Add to `.claude/settings.json` hooks configuration
3. Update `src/types.ts` with new event type
4. Update `useEventEmojis.ts` for emoji mapping (client)
5. Test with manual curl or `./scripts/test-system.sh`

## Database Management

Database file: `apps/server/events.db` (gitignored)

The database uses **automatic migrations** in `db.ts`:
- Checks for missing columns on startup
- Adds new columns via `ALTER TABLE` if needed
- Safe to run on existing databases

To reset the database:
```bash
rm apps/server/events.db
# Restart server - it will recreate tables
```
