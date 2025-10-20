/**
 * Message Queue System for Agent Communication
 * Enables asynchronous message passing between agents
 */

import EventEmitter from 'events';
import { v4 as uuid } from 'uuid';

class MessageQueue extends EventEmitter {
  constructor() {
    super();
    this.messages = new Map(); // messageId -> message
    this.conversations = new Map(); // conversationId -> messages[]
    this.agentQueues = new Map(); // agentId -> messages[]
    this.maxQueueSize = 1000;
    this.messageRetention = 3600000; // 1 hour in ms
  }

  /**
   * Send a message from one agent to another
   */
  async sendMessage({ from, to, type, payload, priority = 'medium', conversationId = null }) {
    const message = {
      id: uuid(),
      from,
      to,
      type,
      payload,
      priority,
      conversationId: conversationId || uuid(),
      timestamp: Date.now(),
      status: 'pending',
      retries: 0,
    };

    // Store message
    this.messages.set(message.id, message);

    // Add to agent queue
    if (!this.agentQueues.has(to)) {
      this.agentQueues.set(to, []);
    }
    this.agentQueues.get(to).push(message);

    // Add to conversation
    if (!this.conversations.has(message.conversationId)) {
      this.conversations.set(message.conversationId, []);
    }
    this.conversations.get(message.conversationId).push(message);

    // Emit event for real-time processing
    this.emit('message', message);
    this.emit(`message:${to}`, message);

    // Clean up old messages
    this._cleanup();

    return message;
  }

  /**
   * Get messages for a specific agent
   */
  getMessagesForAgent(agentId, filterType = null) {
    const messages = this.agentQueues.get(agentId) || [];

    if (filterType) {
      return messages.filter(m => m.type === filterType && m.status === 'pending');
    }

    return messages.filter(m => m.status === 'pending');
  }

  /**
   * Get the next pending message for an agent (highest priority first)
   */
  getNextMessage(agentId) {
    const messages = this.getMessagesForAgent(agentId);

    if (messages.length === 0) return null;

    // Sort by priority (high > medium > low) and timestamp
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    messages.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp; // Earlier messages first
    });

    return messages[0];
  }

  /**
   * Mark a message as completed
   */
  completeMessage(messageId, response = null) {
    const message = this.messages.get(messageId);
    if (!message) return false;

    message.status = 'completed';
    message.completedAt = Date.now();
    message.response = response;

    this.emit('message:completed', message);
    return true;
  }

  /**
   * Mark a message as failed
   */
  failMessage(messageId, error) {
    const message = this.messages.get(messageId);
    if (!message) return false;

    message.status = 'failed';
    message.error = error;
    message.failedAt = Date.now();

    this.emit('message:failed', message);
    return true;
  }

  /**
   * Get conversation history
   */
  getConversation(conversationId) {
    return this.conversations.get(conversationId) || [];
  }

  /**
   * Get all active conversations
   */
  getActiveConversations() {
    const active = [];
    const now = Date.now();

    for (const [conversationId, messages] of this.conversations.entries()) {
      const lastMessage = messages[messages.length - 1];
      if (now - lastMessage.timestamp < this.messageRetention) {
        active.push({
          conversationId,
          messageCount: messages.length,
          lastActivity: lastMessage.timestamp,
          participants: [...new Set(messages.map(m => m.from).concat(messages.map(m => m.to)))],
        });
      }
    }

    return active;
  }

  /**
   * Subscribe to messages for an agent
   */
  subscribeAgent(agentId, callback) {
    this.on(`message:${agentId}`, callback);
    return () => this.off(`message:${agentId}`, callback);
  }

  /**
   * Get queue stats
   */
  getStats() {
    const stats = {
      totalMessages: this.messages.size,
      activeConversations: this.getActiveConversations().length,
      agentQueues: {},
    };

    for (const [agentId, messages] of this.agentQueues.entries()) {
      stats.agentQueues[agentId] = {
        total: messages.length,
        pending: messages.filter(m => m.status === 'pending').length,
        completed: messages.filter(m => m.status === 'completed').length,
        failed: messages.filter(m => m.status === 'failed').length,
      };
    }

    return stats;
  }

  /**
   * Clean up old messages
   */
  _cleanup() {
    const now = Date.now();
    const messagesToDelete = [];

    // Find old messages
    for (const [id, message] of this.messages.entries()) {
      if (now - message.timestamp > this.messageRetention && message.status !== 'pending') {
        messagesToDelete.push(id);
      }
    }

    // Delete them
    messagesToDelete.forEach(id => {
      const message = this.messages.get(id);
      this.messages.delete(id);

      // Remove from agent queue
      const queue = this.agentQueues.get(message.to);
      if (queue) {
        const index = queue.findIndex(m => m.id === id);
        if (index !== -1) queue.splice(index, 1);
      }
    });

    // Clean up empty conversations
    for (const [conversationId, messages] of this.conversations.entries()) {
      const validMessages = messages.filter(m => this.messages.has(m.id));
      if (validMessages.length === 0) {
        this.conversations.delete(conversationId);
      } else {
        this.conversations.set(conversationId, validMessages);
      }
    }
  }

  /**
   * Clear all messages (for testing)
   */
  clear() {
    this.messages.clear();
    this.conversations.clear();
    this.agentQueues.clear();
    this.removeAllListeners();
  }
}

// Singleton instance
export const messageQueue = new MessageQueue();

// Helper functions
export async function sendMessage(options) {
  return messageQueue.sendMessage(options);
}

export function getMessagesForAgent(agentId, filterType = null) {
  return messageQueue.getMessagesForAgent(agentId, filterType);
}

export function getNextMessage(agentId) {
  return messageQueue.getNextMessage(agentId);
}

export function completeMessage(messageId, response = null) {
  return messageQueue.completeMessage(messageId, response);
}

export function failMessage(messageId, error) {
  return messageQueue.failMessage(messageId, error);
}

export function getConversation(conversationId) {
  return messageQueue.getConversation(conversationId);
}

export function subscribeAgent(agentId, callback) {
  return messageQueue.subscribeAgent(agentId, callback);
}

export function getQueueStats() {
  return messageQueue.getStats();
}

export default messageQueue;
