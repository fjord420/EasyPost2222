# Complete Setup Guide - EasyPost Multi-Agent Team

This guide walks you through **every step** needed to set up and run the EasyPost Multi-Agent Development Team from scratch.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: System Requirements](#step-1-system-requirements)
- [Step 2: Get API Keys](#step-2-get-api-keys)
- [Step 3: Install Dependencies](#step-3-install-dependencies)
- [Step 4: Configure Environment](#step-4-configure-environment)
- [Step 5: Set Up EasyPost Node SDK](#step-5-set-up-easypost-node-sdk)
- [Step 6: Optional - Observability System](#step-6-optional---observability-system)
- [Step 7: Verify Installation](#step-7-verify-installation)
- [Step 8: First Run](#step-8-first-run)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Prerequisites

Before starting, ensure you have:

- **Operating System**: Linux, macOS, or Windows (with WSL2)
- **Terminal Access**: Command line interface
- **Internet Connection**: For downloading dependencies and API access
- **Text Editor**: For editing configuration files (VS Code, nano, vim, etc.)

---

## Step 1: System Requirements

### Install Node.js (v18 or higher)

**Check if Node.js is installed:**
```bash
node --version
```

If you see `v18.x.x` or higher, you're good to go!

**If not installed, install Node.js:**

**macOS (using Homebrew):**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/)

### Verify npm is installed

```bash
npm --version
```

Should show version 9.x or higher.

---

## Step 2: Get API Keys

You'll need API keys from the following services:

### Required Keys

#### 1. Anthropic API Key (Required)
This powers the AI agents using Claude.

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-...`)
6. **Save it securely** - you'll need it in Step 4

**Note**: You'll need credits in your Anthropic account. Check [pricing](https://www.anthropic.com/pricing).

#### 2. EasyPost API Keys (Required)
This enables shipping label creation and tracking.

1. Go to [easypost.com](https://www.easypost.com/)
2. Sign up for a free account
3. Log in to your dashboard
4. Navigate to **API Keys** section
5. Copy both keys:
   - **Test API Key** (starts with `EZTEST...`)
   - **Production API Key** (starts with `EZAK...`) - optional for now
6. **Save both keys** - you'll need them in Step 4

**Note**: Test mode is free and perfect for development!

### Optional Keys

#### 3. Builder.io API Key (Optional)
For visual page building integration.

1. Go to [builder.io](https://www.builder.io/)
2. Sign up for free account
3. Get your API key from Settings

#### 4. Figma API Key (Optional)
For converting Figma designs to code.

1. Log in to [Figma](https://www.figma.com/)
2. Go to Settings > Personal Access Tokens
3. Generate a new token

---

## Step 3: Install Dependencies

### Navigate to the Project Directory

```bash
cd /home/fjord420/EasyPost/agents/easypost-team
```

Or if you're starting from the EasyPost root:
```bash
cd agents/easypost-team
```

### Install npm Packages

```bash
npm install
```

This will install:
- `@easypost/api` - EasyPost SDK (local version)
- `dotenv` - Environment variable management
- `uuid` - Unique ID generation

**Expected output:**
```
added 3 packages, and audited 4 packages in 2s
```

**If you see errors**, check the [Troubleshooting](#troubleshooting) section below.

---

## Step 4: Configure Environment

### Create Environment File

The `.env.sample` file is a template. Copy it to create your actual configuration:

```bash
cp .env.sample .env
```

### Edit the Environment File

Open `.env` in your text editor:

```bash
nano .env
# or
code .env
# or
vim .env
```

### Add Your API Keys

Replace the placeholder values with your actual API keys from Step 2:

```bash
# API Keys
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here

# EasyPost Configuration
EASYPOST_TEST_API_KEY=EZTEST-your-actual-test-key-here
EASYPOST_PROD_API_KEY=EZAK-your-actual-prod-key-here
EASYPOST_MODE=test

# Optional: Builder.io & Figma
BUILDER_IO_API_KEY=
FIGMA_API_KEY=

# Observability
OBSERVABILITY_SERVER=http://localhost:4000
ENABLE_OBSERVABILITY=true
```

**Important Notes:**
- Keep `EASYPOST_MODE=test` while developing
- Leave optional keys blank if you don't have them
- **Never commit `.env` to git** (it's already in `.gitignore`)

### Save the File

- **nano**: Press `Ctrl+X`, then `Y`, then `Enter`
- **vim**: Press `Esc`, type `:wq`, press `Enter`
- **VS Code**: Just save normally (`Cmd+S` or `Ctrl+S`)

---

## Step 5: Set Up EasyPost Node SDK

The project uses a **local version** of the EasyPost Node SDK.

### Verify the SDK Location

```bash
ls -la ../../easypost-node/
```

You should see a directory with `package.json`, `src/`, etc.

### Install SDK Dependencies (if needed)

If the easypost-node directory exists but hasn't been set up:

```bash
cd ../../easypost-node
npm install
cd -
```

### Verify the Link

Back in the `easypost-team` directory, check that the link works:

```bash
npm list @easypost/api
```

Should show:
```
easypost-agent-team@1.0.0 /path/to/easypost-team
└── @easypost/api@... -> ./../easypost-node
```

---

## Step 6: Optional - Observability System

The observability system lets you **watch agents work in real-time** through a web UI.

### Prerequisites

The observability system is located at:
```bash
../../claude-code-hooks-multi-agent-observability
```

### Install Observability Dependencies

```bash
cd ../../claude-code-hooks-multi-agent-observability
```

**Check if the scripts are executable:**
```bash
ls -la scripts/start-system.sh
```

**If not executable, make it executable:**
```bash
chmod +x scripts/start-system.sh
```

### Configure Observability (if needed)

Check if `.env` exists:
```bash
ls -la .env
```

If not, create it from the sample:
```bash
cp .env.sample .env
```

### Start the Observability System

```bash
./scripts/start-system.sh
```

This will start:
1. **Redis** - Message queue (port 6379)
2. **Backend** - Event processor (port 4000)
3. **Frontend** - Web UI (port 5173)

**Expected output:**
```
Starting observability system...
✓ Redis running on port 6379
✓ Backend running on port 4000
✓ Frontend running on port 5173
→ Open http://localhost:5173 to view
```

### Access the UI

Open in your browser:
```
http://localhost:5173
```

You should see the observability dashboard!

### Return to Agent Directory

```bash
cd ../../agents/easypost-team
```

---

## Step 7: Verify Installation

Before running the system, let's verify everything is set up correctly.

### Check Environment Variables

```bash
# Check .env exists and has content
cat .env | grep -v "^#" | grep -v "^$"
```

Should show your configured keys (sensitive parts hidden).

### Check Dependencies

```bash
npm list --depth=0
```

Should show:
```
easypost-agent-team@1.0.0
├── @easypost/api@...
├── dotenv@16.4.5
└── uuid@11.1.0
```

### Check Agent Files

```bash
ls -1 */index.js
```

Should show:
```
backend-agent/index.js
easypost-shipping-agent/index.js
frontend-agent/index.js
orchestrator/index.js
planning-agent/index.js
```

### Verify Configuration

```bash
cat shared/config/team.json
```

Should show the team configuration with all 4 agents enabled.

---

## Step 8: First Run

Now let's start the system!

### Start the Orchestrator

```bash
npm start
```

**Expected output:**
```
🎭 Orchestrator online

═════════════════════════════════════════
  🤖 EASYPOST MULTI-AGENT DEVELOPMENT TEAM
═════════════════════════════════════════

Team Status:
  ✓ Planning Agent - Ready
  ✓ Backend Agent - Ready
  ✓ Frontend Agent - Ready
  ✓ EasyPost Agent - Ready

Observability: http://localhost:5173
Type 'help' for commands, 'exit' to quit

🎭 >
```

### Try Your First Command

At the prompt, type:
```
Design a shipping application architecture
```

Press Enter and watch the Planning Agent work!

### Monitor in Observability UI

If you set up observability (Step 6), open:
```
http://localhost:5173
```

You'll see the agent's actions in real-time!

### Exit the System

To stop the orchestrator:
```
exit
```

Or press `Ctrl+C`.

---

## Troubleshooting

### Problem: "Cannot find module"

**Error:**
```
Error: Cannot find module '@easypost/api'
```

**Solution:**
```bash
npm install
# If that doesn't work:
cd ../../easypost-node && npm install && cd -
npm install
```

---

### Problem: "API key not found"

**Error:**
```
Error: ANTHROPIC_API_KEY not found
```

**Solution:**
1. Check `.env` file exists: `ls -la .env`
2. Check it has content: `cat .env`
3. Verify the key format:
   - Anthropic: `sk-ant-...`
   - EasyPost Test: `EZTEST...`
4. Make sure no extra spaces around the `=` sign

---

### Problem: "Permission denied" on start-system.sh

**Error:**
```bash
bash: ./scripts/start-system.sh: Permission denied
```

**Solution:**
```bash
chmod +x scripts/start-system.sh
./scripts/start-system.sh
```

---

### Problem: Port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**

Find what's using the port:
```bash
lsof -i :4000
# or
lsof -i :5173
```

Kill the process:
```bash
kill -9 <PID>
```

Or change the port in `.env`:
```bash
OBSERVABILITY_SERVER=http://localhost:4001
```

---

### Problem: easypost-node not found

**Error:**
```
npm ERR! Could not install from "../../easypost-node"
```

**Solution:**

Check if the directory exists:
```bash
ls -la ../../easypost-node
```

If it doesn't exist, you may need to:
1. Clone it from the EasyPost repository
2. Or update `package.json` to use the published npm package instead:
```bash
npm install @easypost/api@latest --save
```

---

### Problem: Node version too old

**Error:**
```
error @easypost/api: The engine "node" is incompatible
```

**Solution:**

Update Node.js to v18 or higher (see Step 1).

---

### Still having issues?

1. Check the full error message
2. Review the relevant section in this guide
3. Check environment variable spelling
4. Ensure all dependencies are installed
5. Try removing `node_modules` and reinstalling:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## Next Steps

### Learn by Example

1. **Read the Quick Start**: `START_HERE.md`
2. **Try Examples**: `EXAMPLES.md` has 10 real-world examples
3. **Understand Architecture**: `ARCHITECTURE.md` explains how it works

### Run Individual Agents

You can test each agent separately:

```bash
# Test Planning Agent
npm run planning

# Test Backend Agent
npm run backend

# Test Frontend Agent
npm run frontend

# Test EasyPost Agent
npm run shipping
```

### Customize the System

1. **Modify Agent Behavior**: Edit the prompt in each agent's `index.js`
2. **Change Team Config**: Edit `shared/config/team.json`
3. **Add New Agents**: Follow the pattern in existing agents
4. **Adjust Timeouts**: Modify `maxConcurrentTasks` and `taskTimeout` in config

### Example Commands to Try

**Simple Tasks:**
```
Validate this address: 123 Main St, San Francisco, CA 94105
Calculate shipping rates from NYC to LA for a 5lb package
Create a shipping label from SF to NYC
```

**Development Tasks:**
```
Design a shipping dashboard architecture
Create API endpoints for shipment management
Build a shipping form UI with address validation
```

**Full-Stack Projects:**
```
Build a complete e-commerce shipping integration
Create a returns management portal
Design a multi-carrier rate comparison tool
```

### Monitor Performance

Watch the observability UI to:
- See agent communication in real-time
- Track task completion times
- Debug issues
- Understand agent decision-making

### Production Checklist

Before deploying to production:

- [ ] Switch `EASYPOST_MODE=prod` in `.env`
- [ ] Use production EasyPost API key
- [ ] Review and test all generated code
- [ ] Set up proper error handling
- [ ] Configure rate limiting
- [ ] Add monitoring and logging
- [ ] Secure API keys (use secret management)
- [ ] Test with production data
- [ ] Set up backup and recovery

---

## Success!

You now have a fully functional AI agent development team ready to build shipping applications!

**Quick Reference:**

| Command | Purpose |
|---------|---------|
| `npm start` | Start the orchestrator |
| `npm run planning` | Run planning agent only |
| `npm run backend` | Run backend agent only |
| `npm run frontend` | Run frontend agent only |
| `npm run shipping` | Run EasyPost agent only |
| `exit` | Quit orchestrator |
| `status` | Check agent status (while running) |
| `help` | Show commands (while running) |

**Documentation:**

| File | Description |
|------|-------------|
| `START_HERE.md` | Quick 5-minute start |
| `QUICKSTART.md` | Guided tutorial |
| `EXAMPLES.md` | 10 real-world examples |
| `ARCHITECTURE.md` | Technical deep dive |
| `README.md` | Full documentation |
| `SETUP.md` | This file |

**Resources:**

- EasyPost API Docs: [docs.easypost.com](https://docs.easypost.com/)
- Anthropic Claude Docs: [docs.anthropic.com](https://docs.anthropic.com/)
- Observability Guide: `../../claude-code-hooks-multi-agent-observability/README.md`

---

Happy shipping! 🚀📦
