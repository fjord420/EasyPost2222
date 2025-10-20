/**
 * Shared types and constants for the agent team
 */

export const AgentType = {
  ORCHESTRATOR: 'orchestrator',
  PLANNING: 'planning-agent',
  BACKEND: 'backend-agent',
  FRONTEND: 'frontend-agent',
  EASYPOST: 'easypost-agent',
};

export const MessageType = {
  TASK: 'task',
  QUERY: 'query',
  RESPONSE: 'response',
  STATUS: 'status',
  ERROR: 'error',
};

export const Priority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  BLOCKED: 'blocked',
};

export const AgentCapabilities = {
  [AgentType.PLANNING]: [
    'architecture-design',
    'system-planning',
    'api-specification',
    'database-schema',
    'roadmap-creation',
  ],
  [AgentType.BACKEND]: [
    'api-development',
    'database-integration',
    'authentication',
    'server-logic',
    'api-documentation',
  ],
  [AgentType.FRONTEND]: [
    'ui-development',
    'component-creation',
    'figma-conversion',
    'builder-io-integration',
    'state-management',
  ],
  [AgentType.EASYPOST]: [
    'label-creation',
    'address-validation',
    'rate-calculation',
    'shipment-tracking',
    'carrier-management',
  ],
};

/**
 * Task definition interface
 */
export class Task {
  constructor({
    id,
    title,
    description,
    assignedTo,
    priority = Priority.MEDIUM,
    dependencies = [],
    context = {},
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.assignedTo = assignedTo;
    this.priority = priority;
    this.dependencies = dependencies;
    this.context = context;
    this.status = TaskStatus.PENDING;
    this.createdAt = Date.now();
    this.result = null;
    this.error = null;
  }

  canStart() {
    // Check if all dependencies are completed
    return this.dependencies.every(dep => dep.status === TaskStatus.COMPLETED);
  }

  start() {
    this.status = TaskStatus.IN_PROGRESS;
    this.startedAt = Date.now();
  }

  complete(result) {
    this.status = TaskStatus.COMPLETED;
    this.result = result;
    this.completedAt = Date.now();
  }

  fail(error) {
    this.status = TaskStatus.FAILED;
    this.error = error;
    this.failedAt = Date.now();
  }

  block(reason) {
    this.status = TaskStatus.BLOCKED;
    this.blockReason = reason;
  }
}

/**
 * Agent base interface
 */
export class AgentBase {
  constructor(type, name) {
    this.type = type;
    this.name = name;
    this.capabilities = AgentCapabilities[type] || [];
    this.status = 'idle';
    this.currentTask = null;
  }

  canHandle(capability) {
    return this.capabilities.includes(capability);
  }

  setStatus(status) {
    this.status = status;
  }

  getInfo() {
    return {
      type: this.type,
      name: this.name,
      capabilities: this.capabilities,
      status: this.status,
      currentTask: this.currentTask?.id || null,
    };
  }
}

export default {
  AgentType,
  MessageType,
  Priority,
  TaskStatus,
  AgentCapabilities,
  Task,
  AgentBase,
};
