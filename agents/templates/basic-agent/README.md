# Basic Agent Template

A minimal template for creating EasyPost agents with Claude Code integration.

## Setup

1. **Copy this template**:
   ```bash
   cp -R agents/templates/basic-agent agents/your-agent-name
   cd agents/your-agent-name
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or for Python agents
   # uv venv && source .venv/bin/activate && uv pip install -r requirements.txt
   ```

3. **Configure environment**:
   ```bash
   cp .env.sample .env
   # Edit .env and add your EASYPOST_API_KEY
   ```

4. **Set up observability** (optional but recommended):
   ```bash
   cp -R ../../claude-code-hooks-multi-agent-observability/.claude ./
   # Edit .claude/settings.json and change source_app to your agent name
   ```

## Usage

```bash
# Run the agent
node index.js

# Or for Python
# python agent.py
```

## Customization

- `index.js` / `agent.py` - Main agent logic
- `.env.sample` - Environment variable template
- `package.json` - Node dependencies (if using Node.js)
- `requirements.txt` - Python dependencies (if using Python)

## Next Steps

1. Implement your agent logic
2. Add error handling
3. Test with the observability system running
4. Document your agent's purpose and usage
