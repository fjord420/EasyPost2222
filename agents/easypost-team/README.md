# EasyPost Multi-Agent Development Team

A coordinated team of AI agents that work together to plan, develop, and deploy a full-stack application with EasyPost integration.

## 🤖 Agent Team Members

### 1. **Orchestrator** (Team Lead)
- **Role**: Manages all agents, routes tasks, converses with user
- **Responsibilities**:
  - Understand user requirements
  - Delegate tasks to appropriate agents
  - Coordinate agent communication
  - Track progress and report status
  - Resolve conflicts between agents

### 2. **Planning Agent** (Architect)
- **Role**: System architecture and planning
- **Responsibilities**:
  - Design system architecture
  - Create technical specifications
  - Plan database schemas
  - Define API contracts
  - Create development roadmaps

### 3. **Backend Agent** (API Developer)
- **Role**: Backend API development with Next.js API routes and Express
- **Responsibilities**:
  - Implement API endpoints
  - Database integration
  - Authentication/authorization
  - Server-side logic
  - API documentation

### 4. **Frontend Agent** (UI Developer)
- **Role**: Frontend development with Next.js, Builder.io, and Figma
- **Responsibilities**:
  - Build UI components
  - Implement Builder.io integration
  - Convert Figma designs to code
  - State management
  - User experience optimization

### 5. **EasyPost Shipping Agent** (Shipping Specialist)
- **Role**: Package management and shipping label creation
- **Responsibilities**:
  - Create shipping labels via EasyPost API
  - Validate addresses
  - Calculate shipping rates
  - Track shipments
  - Manage carrier accounts

## 🏗️ Architecture

```
User Input
    ↓
┌─────────────────┐
│  Orchestrator   │ ← Central coordinator
└─────────────────┘
    ↓ ↓ ↓ ↓ ↓
    ↓ ↓ ↓ ↓ └──→ ┌──────────────────┐
    ↓ ↓ ↓ └──────→ │ Planning Agent   │
    ↓ ↓ └────────→ │ Backend Agent    │
    ↓ └──────────→ │ Frontend Agent   │
    └────────────→ │ EasyPost Agent   │
                   └──────────────────┘
                           ↓
                   Shared Message Queue
                           ↓
                   Observability System
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd agents/easypost-team
npm install
```

### 2. Configure Environment
```bash
cp .env.sample .env
# Edit .env and add:
# - ANTHROPIC_API_KEY
# - EASYPOST_TEST_API_KEY
# - EASYPOST_PROD_API_KEY
# - FIGMA_API_KEY (optional)
# - BUILDER_IO_API_KEY (optional)
```

### 3. Start Observability System (Recommended)
```bash
cd ../../claude-code-hooks-multi-agent-observability
./scripts/start-system.sh
```

### 4. Run the Orchestrator
```bash
cd agents/easypost-team
npm start

# Or run specific agent directly
node planning-agent/index.js
```

## 💬 Communication Protocol

Agents communicate via a **Message Queue** system:

### Message Format
```javascript
{
  id: "msg_123",
  from: "orchestrator",
  to: "backend-agent",
  type: "task" | "query" | "response" | "status",
  priority: "high" | "medium" | "low",
  payload: {
    task: "Create REST API endpoint",
    details: { ... },
    context: { ... }
  },
  timestamp: 1234567890,
  conversationId: "conv_456"
}
```

### Message Types
- **task**: Request an agent to perform work
- **query**: Ask for information or clarification
- **response**: Reply to a task or query
- **status**: Report progress or completion

## 📋 Usage Examples

### Example 1: Build a Shipping Application

```bash
# Start the orchestrator
npm start

# Then interact via CLI:
> User: "Create a shipping application with user authentication and EasyPost integration"

# Orchestrator delegates:
# 1. Planning Agent → Creates architecture
# 2. Backend Agent → Builds API endpoints
# 3. Frontend Agent → Creates UI
# 4. EasyPost Agent → Implements shipping features
```

### Example 2: Create a Shipping Label

```bash
# Run EasyPost agent directly
node easypost-shipping-agent/index.js create-label --from "address1" --to "address2"
```

### Example 3: Watch Agents Work (Observability)

1. Start observability system: `../../claude-code-hooks-multi-agent-observability/scripts/start-system.sh`
2. Open http://localhost:5173
3. Run orchestrator: `npm start`
4. Watch agents communicate in real-time!

## 🔧 Configuration

### Agent Coordination Settings

Edit `shared/config/team.json`:
```json
{
  "orchestrator": {
    "maxConcurrentTasks": 5,
    "taskTimeout": 300000,
    "retryAttempts": 3
  },
  "agents": {
    "planning-agent": {
      "enabled": true,
      "capabilities": ["architecture", "planning", "design"]
    },
    "backend-agent": {
      "enabled": true,
      "capabilities": ["api", "database", "server"]
    },
    "frontend-agent": {
      "enabled": true,
      "capabilities": ["ui", "components", "styling"]
    },
    "easypost-shipping-agent": {
      "enabled": true,
      "capabilities": ["shipping", "labels", "tracking"]
    }
  }
}
```

## 📊 Monitoring

All agents send events to the observability system with unique `source_app` identifiers:

- `orchestrator` - Team coordinator
- `planning-agent` - Architecture planner
- `backend-agent` - API developer
- `frontend-agent` - UI developer
- `easypost-agent` - Shipping specialist

## 🔄 Workflow Example

```
1. User Request → Orchestrator
   "Build a shipping dashboard"

2. Orchestrator → Planning Agent
   "Create architecture for shipping dashboard"

3. Planning Agent → Orchestrator
   Returns: Architecture document, API specs, DB schema

4. Orchestrator → Backend Agent
   "Implement these API endpoints: [specs]"

5. Orchestrator → Frontend Agent
   "Build UI for shipping dashboard using [Figma URL]"

6. Orchestrator → EasyPost Agent
   "Integrate shipping label creation"

7. All Agents → Orchestrator
   Report progress and completion

8. Orchestrator → User
   "Shipping dashboard complete! Here's the summary..."
```

## 🛠️ Development

### Adding New Agents

1. Create agent directory: `mkdir new-agent`
2. Copy template: `cp -R templates/basic-agent/* new-agent/`
3. Implement agent logic with message handlers
4. Register in `shared/config/team.json`
5. Update orchestrator routing

### Testing Agent Communication

```javascript
// Test message passing
const { sendMessage } = require('./shared/communication');

await sendMessage({
  from: 'orchestrator',
  to: 'backend-agent',
  type: 'task',
  payload: { task: 'Test task' }
});
```

## 📚 Documentation

- [Orchestrator Guide](./orchestrator/README.md)
- [Planning Agent Guide](./planning-agent/README.md)
- [Backend Agent Guide](./backend-agent/README.md)
- [Frontend Agent Guide](./frontend-agent/README.md)
- [EasyPost Agent Guide](./easypost-shipping-agent/README.md)
- [Communication Protocol](./shared/communication/README.md)

## 🎯 Next Steps

1. Run `npm install` to install dependencies
2. Configure `.env` with your API keys
3. Start the observability system (recommended)
4. Run `npm start` to launch the orchestrator
5. Begin issuing commands!

## 💡 Tips

- Use the observability UI to watch agents work in real-time
- Each agent can run independently for testing
- The orchestrator handles retries and error recovery
- All agent communication is logged for debugging
- Agents use Claude Code hooks for maximum visibility
