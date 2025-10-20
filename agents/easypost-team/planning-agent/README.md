# Planning Agent

The Planning Agent is responsible for system architecture design and technical planning.

## Capabilities

- **architecture-design**: Design system architectures
- **system-planning**: Create development roadmaps
- **api-specification**: Define API contracts
- **database-schema**: Design database schemas
- **roadmap-creation**: Break down projects into phases

## Usage

### Run Independently
```bash
node planning-agent/index.js
```

### Send Task via Message Queue
```javascript
import { sendMessage } from '../shared/communication/message-queue.js';
import { AgentType, MessageType } from '../shared/types/index.js';

await sendMessage({
  from: AgentType.ORCHESTRATOR,
  to: AgentType.PLANNING,
  type: MessageType.TASK,
  payload: {
    task: 'Design architecture for shipping application',
    details: {
      features: ['shipment creation', 'tracking', 'address validation'],
      constraints: ['must use Next.js', 'EasyPost integration required']
    },
    context: {
      userCount: '< 10,000',
      budget: 'startup'
    }
  }
});
```

## Output Format

The Planning Agent returns structured JSON responses:

```json
{
  "architecture": {
    "overview": "Description of system architecture",
    "layers": ["Frontend", "API", "Business Logic", "Data"],
    "patterns": ["MVC", "Repository Pattern"]
  },
  "technologyStack": {
    "frontend": ["Next.js", "React", "Tailwind CSS"],
    "backend": ["Next.js API Routes", "Express"],
    "database": ["PostgreSQL", "Prisma"]
  },
  "databaseSchema": {
    "tables": [...]
  },
  "apiEndpoints": [
    {
      "method": "POST",
      "path": "/api/shipments",
      "description": "Create new shipment"
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Foundation",
      "tasks": ["Setup", "Auth", "Database"]
    }
  ]
}
```

## Integration with Other Agents

- **Orchestrator**: Receives tasks and reports progress
- **Backend Agent**: Provides API specs and database schema
- **Frontend Agent**: Defines data contracts and UI architecture
- **EasyPost Agent**: Specifies EasyPost integration patterns

## Customization

Edit `prompt.js` to customize the agent's:
- Expertise areas
- Output format preferences
- Best practices
- Architectural patterns
