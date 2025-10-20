/**
 * Backend Development Agent
 * Specializes in API development with Next.js and Express
 */

import { subscribeAgent, completeMessage, failMessage, sendMessage } from '../shared/communication/message-queue.js';
import { AgentType, MessageType, AgentBase } from '../shared/types/index.js';
import { BACKEND_PROMPT } from './prompt.js';

class BackendAgent extends AgentBase {
  constructor() {
    super(AgentType.BACKEND, 'Backend Agent');
  }

  async start() {
    console.log('⚙️  Backend Agent starting...');
    console.log('🔧 Capabilities:', this.capabilities.join(', '));

    subscribeAgent(AgentType.BACKEND, async (message) => {
      await this.handleMessage(message);
    });

    console.log('✅ Backend Agent ready!\n');
  }

  async handleMessage(message) {
    console.log(`\n📨 Received ${message.type} from ${message.from}`);
    this.setStatus('busy');

    try {
      const response = await this.handleTask(message.payload);

      await sendMessage({
        from: AgentType.BACKEND,
        to: message.from,
        type: MessageType.RESPONSE,
        payload: response,
        conversationId: message.conversationId,
      });

      completeMessage(message.id, response);
      console.log('✅ Task completed');

    } catch (error) {
      console.error('❌ Error:', error.message);
      failMessage(message.id, error.message);
    } finally {
      this.setStatus('idle');
    }
  }

  async handleTask(payload) {
    const { task, details, context } = payload;
    console.log(`\n🎯 Executing: ${task}`);

    // Generate backend code based on task
    return this.generateBackendCode(task, details, context);
  }

  generateBackendCode(task, details, context) {
    // This would use Claude API to generate actual code
    // For demo, return structured response

    if (task.toLowerCase().includes('api') || task.toLowerCase().includes('endpoint')) {
      return {
        files: [
          {
            path: 'pages/api/shipments.js',
            content: this.generateShipmentAPI(),
          },
          {
            path: 'lib/services/easypostService.js',
            content: this.generateEasyPostService(),
          },
        ],
        database: {
          migrations: ['create_shipments_table', 'create_addresses_table'],
        },
        tests: ['shipments.test.js'],
        documentation: 'API endpoints created for shipment management',
      };
    }

    return {
      message: `Backend code generated for: ${task}`,
      files: [],
      nextSteps: ['Review code', 'Run tests', 'Deploy'],
    };
  }

  generateShipmentAPI() {
    return `// Next.js API Route: pages/api/shipments.js
import { createShipment, getShipment } from '@/lib/services/easypostService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const shipment = await createShipment(req.body);
      return res.status(201).json(shipment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const shipment = await getShipment(id);
      return res.status(200).json(shipment);
    } catch (error) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}`;
  }

  generateEasyPostService() {
    return `// EasyPost Service Layer
import EasyPostClient from '@easypost/api';

const client = new EasyPostClient(process.env.EASYPOST_API_KEY);

export async function createShipment(data) {
  return await client.Shipment.create(data);
}

export async function getShipment(id) {
  return await client.Shipment.retrieve(id);
}`;
  }
}

if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const agent = new BackendAgent();
  agent.start().catch(console.error);
}

export default BackendAgent;
