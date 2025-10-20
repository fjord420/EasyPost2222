#!/usr/bin/env node
/**
 * Orchestrator Agent
 * Manages all agents, routes tasks, and converses with the user
 */

import readline from 'readline';
import { sendMessage, subscribeAgent, getQueueStats } from '../shared/communication/message-queue.js';
import { AgentType, MessageType, Priority, Task, TaskStatus } from '../shared/types/index.js';
import PlanningAgent from '../planning-agent/index.js';
import BackendAgent from '../backend-agent/index.js';
import FrontendAgent from '../frontend-agent/index.js';
import EasyPostShippingAgent from '../easypost-shipping-agent/index.js';

class Orchestrator {
  constructor() {
    this.agents = new Map();
    this.tasks = new Map();
    this.activeConversations = new Map();
    this.userInterface = null;
  }

  async initialize() {
    console.log('🎭 Orchestrator initializing...\n');

    // Start all agents
    console.log('Starting agent team...');

    const planningAgent = new PlanningAgent();
    const backendAgent = new BackendAgent();
    const frontendAgent = new FrontendAgent();
    const easypostAgent = new EasyPostShippingAgent();

    await Promise.all([
      planningAgent.start(),
      backendAgent.start(),
      frontendAgent.start(),
      easypostAgent.start(),
    ]);

    this.agents.set(AgentType.PLANNING, planningAgent);
    this.agents.set(AgentType.BACKEND, backendAgent);
    this.agents.set(AgentType.FRONTEND, frontendAgent);
    this.agents.set(AgentType.EASYPOST, easypostAgent);

    // Subscribe to agent responses
    subscribeAgent(AgentType.ORCHESTRATOR, (message) => {
      this.handleAgentResponse(message);
    });

    console.log('\n✅ All agents ready!');
    console.log('🎭 Orchestrator online\n');

    this.showWelcome();
    this.startCLI();
  }

  showWelcome() {
    console.log('═'.repeat(70));
    console.log('  🤖 EASYPOST MULTI-AGENT DEVELOPMENT TEAM');
    console.log('═'.repeat(70));
    console.log('\nAvailable Commands:');
    console.log('  • Type your request naturally (e.g., "Build a shipping app")');
    console.log('  • "status" - Check agent status');
    console.log('  • "tasks" - List all tasks');
    console.log('  • "help" - Show this help');
    console.log('  • "exit" - Exit the orchestrator');
    console.log('\nExample Requests:');
    console.log('  • "Design a shipping application architecture"');
    console.log('  • "Create API endpoints for shipments"');
    console.log('  • "Build a shipment form UI"');
    console.log('  • "Create a shipping label for this address"');
    console.log('═'.repeat(70));
    console.log('');
  }

  startCLI() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🎭 > ',
    });

    this.userInterface = rl;

    rl.prompt();

    rl.on('line', async (input) => {
      const command = input.trim();

      if (!command) {
        rl.prompt();
        return;
      }

      await this.processUserInput(command);
      rl.prompt();
    });

    rl.on('close', () => {
      console.log('\n👋 Goodbye!');
      process.exit(0);
    });
  }

  async processUserInput(input) {
    const lowerInput = input.toLowerCase();

    // Handle special commands
    if (lowerInput === 'exit' || lowerInput === 'quit') {
      this.userInterface.close();
      return;
    }

    if (lowerInput === 'status') {
      this.showStatus();
      return;
    }

    if (lowerInput === 'tasks') {
      this.showTasks();
      return;
    }

    if (lowerInput === 'help') {
      this.showWelcome();
      return;
    }

    // Process as a work request
    await this.handleUserRequest(input);
  }

  async handleUserRequest(request) {
    console.log(`\n💭 Processing request: "${request}"\n`);

    // Analyze request and determine which agents to involve
    const plan = this.analyzeRequest(request);

    console.log(`📋 Plan: ${plan.description}`);
    console.log(`👥 Agents needed: ${plan.agents.join(', ')}\n`);

    // Execute plan
    await this.executePlan(plan, request);
  }

  analyzeRequest(request) {
    const lower = request.toLowerCase();

    // Determine which agents are needed based on keywords
    const plan = {
      description: '',
      agents: [],
      tasks: [],
    };

    // Architecture/Planning keywords
    if (lower.match(/architect|design|plan|structure|schema|roadmap/)) {
      plan.agents.push(AgentType.PLANNING);
      plan.tasks.push({
        agent: AgentType.PLANNING,
        task: 'Create architecture and planning documents',
        priority: Priority.HIGH,
      });
      plan.description = 'Create architectural design';
    }

    // Backend keywords
    if (lower.match(/api|endpoint|backend|server|database|auth/)) {
      plan.agents.push(AgentType.BACKEND);
      plan.tasks.push({
        agent: AgentType.BACKEND,
        task: 'Develop backend API and services',
        priority: Priority.HIGH,
      });
      plan.description = plan.description
        ? plan.description + ' and backend development'
        : 'Develop backend API';
    }

    // Frontend keywords
    if (lower.match(/ui|frontend|component|page|form|dashboard|figma|builder/)) {
      plan.agents.push(AgentType.FRONTEND);
      plan.tasks.push({
        agent: AgentType.FRONTEND,
        task: 'Build frontend UI components',
        priority: Priority.MEDIUM,
      });
      plan.description = plan.description
        ? plan.description + ' and frontend UI'
        : 'Build frontend UI';
    }

    // Shipping/EasyPost keywords
    if (lower.match(/ship|label|track|rate|address|package|easypost/)) {
      plan.agents.push(AgentType.EASYPOST);
      plan.tasks.push({
        agent: AgentType.EASYPOST,
        task: 'Implement shipping functionality',
        priority: Priority.HIGH,
      });
      plan.description = plan.description
        ? plan.description + ' with shipping integration'
        : 'Handle shipping operations';
    }

    // Default to planning if no specific agent identified
    if (plan.agents.length === 0) {
      plan.agents.push(AgentType.PLANNING);
      plan.tasks.push({
        agent: AgentType.PLANNING,
        task: 'Analyze and plan the request',
        priority: Priority.MEDIUM,
      });
      plan.description = 'Analyze and create plan';
    }

    return plan;
  }

  async executePlan(plan, userRequest) {
    const conversationId = `conv_${Date.now()}`;

    // Send tasks to agents
    for (const taskDef of plan.tasks) {
      console.log(`📤 Delegating to ${taskDef.agent}...`);

      await sendMessage({
        from: AgentType.ORCHESTRATOR,
        to: taskDef.agent,
        type: MessageType.TASK,
        priority: taskDef.priority,
        conversationId,
        payload: {
          task: taskDef.task,
          details: { userRequest },
          context: { plan },
        },
      });

      this.activeConversations.set(conversationId, {
        userRequest,
        plan,
        startedAt: Date.now(),
        responses: [],
      });
    }

    console.log(`\n⏳ Waiting for agents to complete tasks...\n`);
  }

  handleAgentResponse(message) {
    console.log(`\n📬 Response from ${message.from}:`);

    const { payload } = message;

    if (message.type === MessageType.RESPONSE) {
      // Display agent's response
      console.log(JSON.stringify(payload, null, 2));

      // Store response
      const conversation = this.activeConversations.get(message.conversationId);
      if (conversation) {
        conversation.responses.push({
          agent: message.from,
          payload,
          timestamp: Date.now(),
        });

        // Check if all agents have responded
        if (conversation.responses.length === conversation.plan.agents.length) {
          this.summarizeConversation(message.conversationId);
        }
      }
    } else if (message.type === MessageType.ERROR) {
      console.log(`❌ Error: ${payload.error}`);
    }

    console.log('');
  }

  summarizeConversation(conversationId) {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) return;

    console.log('\n' + '═'.repeat(70));
    console.log('  📊 TASK SUMMARY');
    console.log('═'.repeat(70));
    console.log(`\nOriginal Request: "${conversation.userRequest}"`);
    console.log(`\nAgents Involved: ${conversation.plan.agents.join(', ')}`);
    console.log(`\nResults:`);

    conversation.responses.forEach((response, idx) => {
      console.log(`\n${idx + 1}. ${response.agent}:`);
      console.log(`   ✓ Task completed at ${new Date(response.timestamp).toLocaleTimeString()}`);
    });

    const duration = Date.now() - conversation.startedAt;
    console.log(`\n⏱️  Total Time: ${(duration / 1000).toFixed(2)}s`);
    console.log('═'.repeat(70));
    console.log('');

    // Clean up
    this.activeConversations.delete(conversationId);
  }

  showStatus() {
    console.log('\n📊 AGENT STATUS\n');

    for (const [type, agent] of this.agents.entries()) {
      const info = agent.getInfo();
      console.log(`${this.getAgentEmoji(type)} ${info.name}`);
      console.log(`   Status: ${info.status}`);
      console.log(`   Capabilities: ${info.capabilities.slice(0, 3).join(', ')}...`);
      console.log('');
    }

    const stats = getQueueStats();
    console.log('📬 Message Queue Stats:');
    console.log(`   Total Messages: ${stats.totalMessages}`);
    console.log(`   Active Conversations: ${stats.activeConversations}`);
    console.log('');
  }

  showTasks() {
    console.log('\n📋 ACTIVE CONVERSATIONS\n');

    if (this.activeConversations.size === 0) {
      console.log('No active tasks\n');
      return;
    }

    for (const [id, conversation] of this.activeConversations.entries()) {
      console.log(`Conversation: ${id}`);
      console.log(`Request: "${conversation.userRequest}"`);
      console.log(`Responses: ${conversation.responses.length}/${conversation.plan.agents.length}`);
      console.log('');
    }
  }

  getAgentEmoji(type) {
    const emojis = {
      [AgentType.PLANNING]: '🏗️ ',
      [AgentType.BACKEND]: '⚙️ ',
      [AgentType.FRONTEND]: '🎨',
      [AgentType.EASYPOST]: '📦',
    };
    return emojis[type] || '🤖';
  }
}

// Start orchestrator if run directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const orchestrator = new Orchestrator();
  orchestrator.initialize().catch(console.error);
}

export default Orchestrator;
