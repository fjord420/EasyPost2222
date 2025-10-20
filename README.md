# EasyPost Agents

This directory contains autonomous agents built to work with the EasyPost API using the easypost-node library.

## Directory Structure

```
agents/
├── README.md                    # This file
├── templates/                   # Agent templates and examples
│   └── basic-agent/            # Basic agent template
├── shipment-automation/         # Example: Shipment creation agent
├── address-validation/          # Example: Address validation agent
└── shared/                      # Shared utilities across agents
    ├── config/                 # Shared configuration
    └── utils/                  # Shared helper functions
```

## Creating a New Agent

### 1. Use the Template
```bash
cp -R agents/templates/basic-agent agents/your-agent-name
cd agents/your-agent-name
```

### 2. Set Up Environment
```bash
# Copy environment template
cp .env.sample .env

# Add your EasyPost API keys
nano .env
```

### 3. Install Dependencies
```bash
# If using Node.js
npm install

# If using Python
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uv pip install -r requirements.txt
```

### 4. Configure Observability
Each agent should have a `.claude/` directory copied from the observability system:
```bash
cp -R ../claude-code-hooks-multi-agent-observability/.claude ./
```

Update the `source_app` in `.claude/settings.json` to uniquely identify your agent.

## Agent Types

### Automation Agents
Automate EasyPost workflows (shipment creation, batch processing, etc.)

### Monitoring Agents
Monitor shipments, track packages, send notifications

### Validation Agents
Validate addresses, verify shipment data, check rates

### Integration Agents
Connect EasyPost with other services (webhooks, databases, APIs)

## Best Practices

1. **Unique Source App**: Each agent should have a unique `source_app` identifier in its `.claude/settings.json`
2. **Environment Variables**: Never commit `.env` files, always use `.env.sample` templates
3. **Error Handling**: Implement proper error handling for API calls
4. **Logging**: Use the observability system to track agent behavior
5. **Documentation**: Add a README.md to each agent explaining its purpose and usage

## Observability

All agents can send events to the central observability system:
- Server: http://localhost:4000
- UI: http://localhost:5173

Make sure the observability system is running:
```bash
cd ../claude-code-hooks-multi-agent-observability
./scripts/start-system.sh
```

## Shared Resources

The `shared/` directory contains utilities used across multiple agents:
- Configuration management
- Common EasyPost operations
- Utility functions
- Type definitions

## Example Usage

```javascript
// Example: Using easypost-node in an agent
const EasyPostClient = require('../../easypost-node/dist/easypost.js');

const client = new EasyPostClient(process.env.EASYPOST_API_KEY);

async function createShipment(shipmentData) {
  try {
    const shipment = await client.Shipment.create(shipmentData);
    console.log('Shipment created:', shipment.id);
    return shipment;
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
}
```

## Resources

- [EasyPost API Docs](https://docs.easypost.com)
- [easypost-node Library](../easypost-node/README.md)
- [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Observability System](../claude-code-hooks-multi-agent-observability/README.md)
