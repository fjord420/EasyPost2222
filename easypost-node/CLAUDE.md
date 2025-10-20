# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the EasyPost Node.js Client Library (@easypost/api), a backend SDK for interacting with the EasyPost shipping API. It is NOT intended for frontend/browser use.

## Development Commands

### Build & Clean
```bash
make build          # or: npm run build
make clean          # Clean dist, coverage, and cache directories
```

### Testing
```bash
# Run all tests (requires API keys)
EASYPOST_TEST_API_KEY=xxx EASYPOST_PROD_API_KEY=xxx make test

# Run tests with coverage
EASYPOST_TEST_API_KEY=xxx EASYPOST_PROD_API_KEY=xxx make coverage

# Run single test file
EASYPOST_TEST_API_KEY=xxx EASYPOST_PROD_API_KEY=xxx npx vitest run test/services/shipment.test.js

# Run tests in watch mode
npm run watch
```

### Linting & Formatting
```bash
make lint           # Run all linters (eslint + prettier + scan)
make lint-fix       # Auto-fix linting errors
make eslint         # or: npm run lint
make eslint-fix     # or: npm run lintFix
make prettier       # or: npm run formatCheck
make prettier-fix   # or: npm run format
make scan           # Security scan with audit-ci
```

### Documentation
```bash
make docs           # Generate JSDoc documentation in docs/
```

### Interactive REPL
```bash
API_KEY=yourkey ./repl.js --local dist/easypost.js
```

## Architecture

### Client-Service-Model Pattern

The library uses a three-tier architecture:

1. **EasyPostClient** (`src/easypost.js`): Main entry point that:
   - Manages HTTP requests via superagent
   - Handles authentication with API keys
   - Attaches all service instances
   - Provides request/response hooks for debugging
   - Supports middleware for customization

2. **Services** (`src/services/`): Each service extends `BaseService` and provides:
   - CRUD operations for specific resources (e.g., ShipmentService, AddressService)
   - Pagination support via `getNextPage()` methods
   - Consistent error handling
   - Services are accessed as properties on client (e.g., `client.Shipment.create()`)

3. **Models** (`src/models/`): Plain objects representing API resources:
   - Address, Shipment, Rate, Tracker, etc.
   - Models are deserialized from API responses
   - Object ID prefixes map to classes (e.g., `shp_` → Shipment, `adr_` → Address)

### Error Handling

All errors extend from `EasyPostError` (`src/errors/`):
- **API Errors** (`src/errors/api/`): HTTP-related errors (404, 401, 500, etc.)
- **General Errors** (`src/errors/general/`): Client-side errors (missing parameters, pagination, etc.)
- Error handler (`src/errors/error_handler.js`) maps HTTP status codes to specific error types

## Testing with Pollyjs (Cassettes)

The test suite uses **Pollyjs** to record/replay HTTP requests as "cassettes" stored in `test/cassettes/`.

### Important Testing Concepts

1. **Cassette Management**:
   - Cassettes record actual API interactions and replay them on subsequent runs
   - If you modify a test or API behavior, **delete the cassette** to re-record
   - Cassettes are stored per-test in `test/cassettes/`

2. **Sensitive Data Scrubbing**:
   - `test/helpers/setup_polly.js` defines scrubbers for PII and secrets
   - Always inspect cassettes before committing to ensure no sensitive data leaked
   - Scrubbed fields: API keys, emails, phone numbers, credentials, client IPs

3. **Test Environment Variables**:
   - Required for all test runs:
     - `EASYPOST_TEST_API_KEY`
     - `EASYPOST_PROD_API_KEY`
   - Required only when re-recording certain cassettes:
     - `USPS_CARRIER_ACCOUNT_ID` (for one-call buy shipment tests)
     - `PARTNER_USER_PROD_API_KEY` (for referral tests)
     - `REFERRAL_CUSTOMER_PROD_API_KEY` (for credit card tests)

4. **Test Structure**:
   - Tests are in `test/services/` matching `src/services/`
   - Use `Fixture` helper (`test/helpers/fixture.js`) for test data
   - Tests use Chai assertions with async/await

### Re-recording a Cassette

```bash
# Delete the old cassette
rm test/cassettes/ShipmentService/creates_a_shipment.json

# Run the specific test with API keys to re-record
EASYPOST_TEST_API_KEY=xxx EASYPOST_PROD_API_KEY=xxx npx vitest run test/services/shipment.test.js

# Inspect the new cassette for sensitive data before committing
cat test/cassettes/ShipmentService/creates_a_shipment.json
```

## Adding New Features

When adding a new resource or feature:

1. **Add Model** in `src/models/` (extend from EasyPostObject if applicable)
2. **Add Service** in `src/services/` (extend from BaseService)
3. **Register Service** in `src/easypost.js` SERVICES map
4. **Add Tests** in `test/services/` following existing patterns
5. **Update Types** in `types/` for TypeScript definitions

## Build Output

The library is built with Vite and outputs:
- `dist/easypost.js` - CommonJS bundle
- `dist/easypost.mjs` - ES Module bundle
- `types/index.d.ts` - TypeScript definitions

## Publishing

```bash
npm run prepublishOnly  # Runs clean, build, test, lint, formatCheck
make publish            # Publish to npm
make publish-next       # Publish release candidate with 'next' tag
```

## API Version & Compatibility

- Requires Node.js >= 16.0
- Built for EasyPost API v2 (baseUrl: `https://api.easypost.com/v2/`)
- Beta endpoints automatically strip `/v2` from path
