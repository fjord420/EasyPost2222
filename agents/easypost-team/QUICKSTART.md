# Quick Start Guide

Get your multi-agent team up and running in 5 minutes!

## Prerequisites

✅ Node.js 16+ installed
✅ API keys ready (see below)
✅ 5 minutes of setup time

## Step 1: Install Dependencies

```bash
cd agents/easypost-team
npm install
```

## Step 2: Configure Environment

```bash
# Copy the environment template
cp .env.sample .env

# Edit .env and add your keys
nano .env
```

Required keys:
- `ANTHROPIC_API_KEY` - Get from https://console.anthropic.com
- `EASYPOST_TEST_API_KEY` - Get from https://www.easypost.com/account/api-keys

## Step 3: Start Observability (Optional but Recommended!)

This lets you watch your agents work in real-time:

```bash
# In a new terminal
cd ../../claude-code-hooks-multi-agent-observability
./scripts/start-system.sh

# Open http://localhost:5173 in your browser
```

## Step 4: Launch the Team!

```bash
cd agents/easypost-team
npm start
```

You'll see:
```
🏗️  Planning Agent starting...
⚙️  Backend Agent starting...
🎨 Frontend Agent starting...
📦 EasyPost Shipping Agent starting...
✅ All agents ready!
🎭 Orchestrator online

═════════════════════════════════════════
  🤖 EASYPOST MULTI-AGENT DEVELOPMENT TEAM
═════════════════════════════════════════

🎭 >
```

## Step 5: Give Commands!

Try these example commands:

### Example 1: Design an Application
```
🎭 > Design a shipping application architecture
```

The Planning Agent will create:
- System architecture
- Technology stack recommendations
- Database schema
- API specifications
- Development roadmap

### Example 2: Create Backend APIs
```
🎭 > Create API endpoints for shipments
```

The Backend Agent will:
- Generate Next.js API routes
- Create service layer code
- Add database models
- Write tests

### Example 3: Build UI
```
🎭 > Build a shipment form UI with Builder.io
```

The Frontend Agent will:
- Create React components
- Generate form logic
- Add Tailwind CSS styling
- Set up Builder.io integration

### Example 4: Create Shipping Label
```
🎭 > Create a shipping label for a package from San Francisco to New York
```

The EasyPost Agent will:
- Validate addresses
- Calculate rates
- Create shipment
- Purchase label
- Return tracking info

### Example 5: Full Stack App
```
🎭 > Build a complete shipping dashboard with authentication
```

The Orchestrator will:
1. Delegate architecture to Planning Agent
2. Assign backend work to Backend Agent
3. Assign frontend work to Frontend Agent
4. Assign shipping features to EasyPost Agent
5. Coordinate all agents
6. Report complete results

## Useful Commands

While the orchestrator is running:

- `status` - Check agent status
- `tasks` - View active tasks
- `help` - Show help
- `exit` - Quit

## Watch Agents in Real-Time

If you started the observability system (Step 3):

1. Open http://localhost:5173
2. You'll see events streaming in real-time:
   - 🔧 PreToolUse - Agent starting a task
   - ✅ PostToolUse - Agent completed a task
   - 💬 Messages between agents
3. Filter by agent: `planning-agent`, `backend-agent`, `frontend-agent`, `easypost-agent`

## Run Individual Agents

You can also run agents independently for testing:

```bash
# Run just the Planning Agent
npm run planning

# Run just the Backend Agent
npm run backend

# Run just the Frontend Agent
npm run frontend

# Run just the EasyPost Shipping Agent
npm run shipping
```

## Troubleshooting

### "API key not found"
- Make sure you copied `.env.sample` to `.env`
- Make sure you added your actual API keys
- Keys should not have quotes around them

### "Cannot find module"
- Run `npm install` in the `agents/easypost-team` directory
- Make sure you're using Node.js 16 or higher

### "Port already in use"
- The observability system uses ports 4000 and 5173
- Stop it with: `cd claude-code-hooks-multi-agent-observability && ./scripts/reset-system.sh`

### Agents not responding
- Check that all agents started successfully
- Look for error messages in the console
- Try running individual agents to isolate the issue

## Next Steps

1. **Read the docs**: Check `README.md` for detailed information
2. **Customize agents**: Edit agent prompts in `*/prompt.js` files
3. **Add new agents**: Follow the template pattern
4. **Integrate with your project**: Use the generated code
5. **Deploy**: Agents can run as services

## Advanced Usage

### Custom Agent Configuration

Edit `shared/config/team.json` to:
- Enable/disable specific agents
- Change concurrent task limits
- Adjust timeout settings
- Configure observability

### Add Your Own Agent

```bash
# Copy an existing agent as template
cp -R planning-agent my-custom-agent

# Edit the agent logic
nano my-custom-agent/index.js

# Register in orchestrator
# (Edit orchestrator/index.js to import and start your agent)
```

## Getting Help

- **Documentation**: See individual agent README files
- **Examples**: Check `EXAMPLES.md` for more scenarios
- **Issues**: Report at your project's issue tracker

## What's Next?

You now have a fully functional multi-agent development team!

Try:
1. Building a complete application
2. Watching agents collaborate via observability
3. Customizing agent behaviors
4. Adding your own specialized agents
5. Integrating with your CI/CD pipeline

Happy building! 🚀
