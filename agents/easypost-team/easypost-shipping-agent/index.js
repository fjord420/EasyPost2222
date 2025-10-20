/**
 * EasyPost Shipping Agent
 * Specializes in package management and shipping label creation
 */

import { subscribeAgent, completeMessage, sendMessage } from '../shared/communication/message-queue.js';
import { AgentType, MessageType, AgentBase } from '../shared/types/index.js';
import EasyPostClient from '../../../easypost-node/dist/easypost.js';

class EasyPostShippingAgent extends AgentBase {
  constructor() {
    super(AgentType.EASYPOST, 'EasyPost Shipping Agent');

    const apiKey = process.env.EASYPOST_MODE === 'prod'
      ? process.env.EASYPOST_PROD_API_KEY
      : process.env.EASYPOST_TEST_API_KEY;

    this.client = new EasyPostClient(apiKey);
  }

  async start() {
    console.log('📦 EasyPost Shipping Agent starting...');
    console.log('🚚 Capabilities:', this.capabilities.join(', '));

    subscribeAgent(AgentType.EASYPOST, async (message) => {
      await this.handleMessage(message);
    });

    console.log('✅ EasyPost Agent ready!\n');
  }

  async handleMessage(message) {
    console.log(`\n📨 Received ${message.type} from ${message.from}`);
    this.setStatus('busy');

    try {
      const response = await this.executeShippingTask(message.payload);

      await sendMessage({
        from: AgentType.EASYPOST,
        to: message.from,
        type: MessageType.RESPONSE,
        payload: response,
        conversationId: message.conversationId,
      });

      completeMessage(message.id, response);
      console.log('✅ Shipping task completed');
    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      this.setStatus('idle');
    }
  }

  async executeShippingTask(payload) {
    const { task, details } = payload;
    console.log(`\n🎯 Executing: ${task}`);

    // Route to appropriate handler
    if (task.includes('label') || task.includes('shipment')) {
      return await this.createShipmentLabel(details);
    }
    if (task.includes('address') && task.includes('validate')) {
      return await this.validateAddress(details);
    }
    if (task.includes('rate')) {
      return await this.calculateRates(details);
    }
    if (task.includes('track')) {
      return await this.trackShipment(details);
    }

    throw new Error(`Unknown shipping task: ${task}`);
  }

  async createShipmentLabel(details) {
    console.log('📋 Creating shipping label...');

    const shipment = await this.client.Shipment.create({
      from_address: details.fromAddress,
      to_address: details.toAddress,
      parcel: details.parcel,
    });

    console.log(`✅ Shipment created: ${shipment.id}`);
    console.log(`📊 ${shipment.rates.length} rates available`);

    // Buy the lowest rate
    const lowestRate = shipment.lowestRate();
    const boughtShipment = await this.client.Shipment.buy(shipment.id, lowestRate);

    console.log(`✅ Label purchased: ${boughtShipment.tracking_code}`);

    return {
      shipmentId: boughtShipment.id,
      trackingCode: boughtShipment.tracking_code,
      labelUrl: boughtShipment.postage_label.label_url,
      rate: lowestRate.rate,
      carrier: lowestRate.carrier,
      service: lowestRate.service,
    };
  }

  async validateAddress(details) {
    console.log('📍 Validating address...');

    const address = await this.client.Address.createAndVerify(details.address);

    return {
      valid: true,
      address: {
        street1: address.street1,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      verifications: address.verifications,
    };
  }

  async calculateRates(details) {
    console.log('💰 Calculating shipping rates...');

    const shipment = await this.client.Shipment.create({
      from_address: details.fromAddress,
      to_address: details.toAddress,
      parcel: details.parcel,
    });

    const rates = shipment.rates.map(rate => ({
      carrier: rate.carrier,
      service: rate.service,
      rate: rate.rate,
      deliveryDays: rate.delivery_days,
      estDeliveryDate: rate.est_delivery_date,
    }));

    return { rates };
  }

  async trackShipment(details) {
    console.log('🔍 Tracking shipment...');

    const tracker = await this.client.Tracker.create({
      tracking_code: details.trackingCode,
    });

    return {
      trackingCode: tracker.tracking_code,
      status: tracker.status,
      statusDetail: tracker.status_detail,
      carrier: tracker.carrier,
      estDeliveryDate: tracker.est_delivery_date,
      trackingDetails: tracker.tracking_details,
    };
  }
}

if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const agent = new EasyPostShippingAgent();
  agent.start().catch(console.error);
}

export default EasyPostShippingAgent;
