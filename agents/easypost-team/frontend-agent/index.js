/**
 * Frontend Development Agent
 * Specializes in Next.js, Builder.io, and Figma integration
 */

import { subscribeAgent, completeMessage, sendMessage } from '../shared/communication/message-queue.js';
import { AgentType, MessageType, AgentBase } from '../shared/types/index.js';

class FrontendAgent extends AgentBase {
  constructor() {
    super(AgentType.FRONTEND, 'Frontend Agent');
  }

  async start() {
    console.log('🎨 Frontend Agent starting...');
    console.log('💅 Capabilities:', this.capabilities.join(', '));

    subscribeAgent(AgentType.FRONTEND, async (message) => {
      await this.handleMessage(message);
    });

    console.log('✅ Frontend Agent ready!\n');
  }

  async handleMessage(message) {
    console.log(`\n📨 Received ${message.type} from ${message.from}`);
    this.setStatus('busy');

    try {
      const response = await this.generateFrontendCode(message.payload);

      await sendMessage({
        from: AgentType.FRONTEND,
        to: message.from,
        type: MessageType.RESPONSE,
        payload: response,
        conversationId: message.conversationId,
      });

      completeMessage(message.id, response);
      console.log('✅ UI components created');
    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      this.setStatus('idle');
    }
  }

  async generateFrontendCode(payload) {
    const { task, details, context } = payload;
    console.log(`\n🎯 Building: ${task}`);

    return {
      components: [
        {
          path: 'components/ShipmentForm.tsx',
          content: this.generateShipmentForm(),
        },
        {
          path: 'components/ShipmentList.tsx',
          content: this.generateShipmentList(),
        },
      ],
      pages: [
        {
          path: 'app/shipments/page.tsx',
          content: this.generateShipmentsPage(),
        },
      ],
      styles: ['tailwind.config.js', 'globals.css'],
      builderIntegration: {
        customComponents: ['ShipmentForm', 'TrackingDisplay'],
        symbols: ['Header', 'Footer'],
      },
    };
  }

  generateShipmentForm() {
    return `'use client';

import { useState } from 'react';

export default function ShipmentForm() {
  const [formData, setFormData] = useState({
    fromAddress: {},
    toAddress: {},
    parcel: {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const shipment = await res.json();
    console.log('Created:', shipment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <button type="submit" className="btn-primary">
        Create Shipment
      </button>
    </form>
  );
}`;
  }

  generateShipmentList() {
    return `'use client';

import { useEffect, useState } from 'react';

export default function ShipmentList() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetch('/api/shipments')
      .then(res => res.json())
      .then(data => setShipments(data));
  }, []);

  return (
    <div className="grid gap-4">
      {shipments.map(shipment => (
        <div key={shipment.id} className="card">
          <h3>{shipment.tracking_code}</h3>
          <p>Status: {shipment.status}</p>
        </div>
      ))}
    </div>
  );
}`;
  }

  generateShipmentsPage() {
    return `import ShipmentForm from '@/components/ShipmentForm';
import ShipmentList from '@/components/ShipmentList';

export default function ShipmentsPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shipments</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <ShipmentForm />
        <ShipmentList />
      </div>
    </main>
  );
}`;
  }
}

if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const agent = new FrontendAgent();
  agent.start().catch(console.error);
}

export default FrontendAgent;
