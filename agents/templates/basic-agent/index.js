import 'dotenv/config';
import EasyPostClient from '@easypost/api';

// Initialize EasyPost client
const apiKey = process.env.EASYPOST_MODE === 'prod'
  ? process.env.EASYPOST_PROD_API_KEY
  : process.env.EASYPOST_TEST_API_KEY;

if (!apiKey) {
  console.error('Error: EASYPOST API key not found in environment variables');
  process.exit(1);
}

const client = new EasyPostClient(apiKey);

/**
 * Example agent function - Create a shipment
 */
async function exampleCreateShipment() {
  try {
    const shipment = await client.Shipment.create({
      from_address: {
        street1: '417 MONTGOMERY ST',
        street2: 'FLOOR 5',
        city: 'SAN FRANCISCO',
        state: 'CA',
        zip: '94104',
        country: 'US',
        company: 'EasyPost',
        phone: '415-123-4567',
      },
      to_address: {
        name: 'Dr. Steve Brule',
        street1: '179 N Harbor Dr',
        city: 'Redondo Beach',
        state: 'CA',
        zip: '90277',
        country: 'US',
        phone: '4155559999',
      },
      parcel: {
        length: 8,
        width: 5,
        height: 5,
        weight: 5,
      },
    });

    console.log('✅ Shipment created:', shipment.id);
    console.log('📦 Rates available:', shipment.rates.length);

    // Get lowest rate
    const lowestRate = shipment.lowestRate();
    console.log('💰 Lowest rate:', lowestRate.rate, lowestRate.carrier);

    return shipment;
  } catch (error) {
    console.error('❌ Error creating shipment:', error.message);
    throw error;
  }
}

/**
 * Example agent function - Validate an address
 */
async function exampleValidateAddress() {
  try {
    const address = await client.Address.createAndVerify({
      street1: '179 N Harbor Dr',
      city: 'Redondo Beach',
      state: 'CA',
      zip: '90277',
      country: 'US',
    });

    console.log('✅ Address validated:', address.id);
    console.log('📍 Verified:', address.street1);

    return address;
  } catch (error) {
    console.error('❌ Error validating address:', error.message);
    throw error;
  }
}

/**
 * Main agent function
 */
async function main() {
  console.log(`🤖 Starting ${process.env.AGENT_NAME || 'Basic Agent'}...`);
  console.log(`🔑 Using ${process.env.EASYPOST_MODE || 'test'} mode\n`);

  try {
    // Example: Create a shipment
    await exampleCreateShipment();

    console.log('\n---\n');

    // Example: Validate an address
    await exampleValidateAddress();

    console.log('\n✨ Agent completed successfully!');
  } catch (error) {
    console.error('\n💥 Agent failed:', error);
    process.exit(1);
  }
}

// Run the agent
main();
