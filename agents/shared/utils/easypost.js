/**
 * Shared EasyPost utilities for agents
 */
import EasyPostClient from '../../../easypost-node/dist/easypost.js';

/**
 * Get a configured EasyPost client instance
 * @param {string} mode - 'test' or 'prod'
 * @param {object} options - Additional client options
 * @returns {EasyPostClient}
 */
export function getEasyPostClient(mode = 'test', options = {}) {
  const apiKey = mode === 'prod'
    ? process.env.EASYPOST_PROD_API_KEY
    : process.env.EASYPOST_TEST_API_KEY;

  if (!apiKey) {
    throw new Error(`EasyPost API key not found for mode: ${mode}`);
  }

  return new EasyPostClient(apiKey, options);
}

/**
 * Format shipment data for logging
 * @param {object} shipment - EasyPost shipment object
 * @returns {object} Formatted shipment data
 */
export function formatShipmentForLogging(shipment) {
  return {
    id: shipment.id,
    tracking_code: shipment.tracking_code,
    status: shipment.status,
    from: `${shipment.from_address?.city}, ${shipment.from_address?.state}`,
    to: `${shipment.to_address?.city}, ${shipment.to_address?.state}`,
    rate_count: shipment.rates?.length || 0,
  };
}

/**
 * Calculate the best rate based on criteria
 * @param {array} rates - Array of rate objects
 * @param {string} criteria - 'lowest' | 'fastest' | 'carrier:USPS'
 * @returns {object} Best rate
 */
export function selectBestRate(rates, criteria = 'lowest') {
  if (!rates || rates.length === 0) {
    throw new Error('No rates available');
  }

  if (criteria === 'lowest') {
    return rates.reduce((best, rate) =>
      parseFloat(rate.rate) < parseFloat(best.rate) ? rate : best
    );
  }

  if (criteria === 'fastest') {
    return rates.reduce((best, rate) =>
      rate.delivery_days < best.delivery_days ? rate : best
    );
  }

  if (criteria.startsWith('carrier:')) {
    const carrier = criteria.split(':')[1];
    const carrierRates = rates.filter(r => r.carrier === carrier);
    if (carrierRates.length === 0) {
      throw new Error(`No rates found for carrier: ${carrier}`);
    }
    return carrierRates.reduce((best, rate) =>
      parseFloat(rate.rate) < parseFloat(best.rate) ? rate : best
    );
  }

  throw new Error(`Unknown criteria: ${criteria}`);
}

/**
 * Retry a function with exponential backoff
 * @param {function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of function
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
