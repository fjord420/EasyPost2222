# Agent Team Examples

Real-world examples of using the multi-agent team.

## Example 1: E-commerce Shipping Integration

**User Request:**
```
Build a complete e-commerce shipping solution with user auth, product catalog,
and EasyPost integration for shipping labels
```

**What Happens:**

1. **Planning Agent** creates:
   - System architecture (Next.js full-stack app)
   - Database schema (users, products, orders, shipments)
   - API specification (25+ endpoints)
   - Development roadmap (4 phases)

2. **Backend Agent** builds:
   - Authentication API (NextAuth.js)
   - Product API endpoints
   - Order management API
   - Shipment API with EasyPost integration
   - Database models and migrations

3. **Frontend Agent** creates:
   - Login/register pages
   - Product catalog UI
   - Shopping cart component
   - Checkout flow
   - Shipping label dashboard

4. **EasyPost Agent** implements:
   - Address validation
   - Rate calculation
   - Label creation
   - Tracking integration

**Result:** Complete shipping-enabled e-commerce application

---

## Example 2: Simple Shipping Label Creator

**User Request:**
```
Create a shipping label from 123 Main St, San Francisco, CA to
456 Oak Ave, New York, NY for a 5lb 10x10x10 box
```

**What Happens:**

1. **EasyPost Agent**:
   - Validates both addresses
   - Creates shipment
   - Calculates all available rates
   - Purchases cheapest label
   - Returns tracking number and label URL

**Result:** Shipping label ready to print in ~3 seconds

---

## Example 3: Dashboard with Real-time Tracking

**User Request:**
```
Build a dashboard with real-time shipment tracking using Builder.io
and live updates
```

**What Happens:**

1. **Planning Agent**:
   - Designs real-time architecture (WebSockets)
   - Plans Builder.io component structure
   - Specifies webhook integration

2. **Backend Agent**:
   - Creates WebSocket server
   - Sets up EasyPost webhook endpoints
   - Implements real-time broadcast logic

3. **Frontend Agent**:
   - Builds dashboard with Builder.io
   - Adds WebSocket client
   - Creates tracking widgets
   - Implements live updates

4. **EasyPost Agent**:
   - Configures webhooks
   - Handles tracking updates
   - Manages event broadcasting

**Result:** Live tracking dashboard with Builder.io CMS

---

## Example 4: Batch Label Generation

**User Request:**
```
Create labels for 100 shipments from a CSV file
```

**What Happens:**

1. **Backend Agent**:
   - Creates CSV parser
   - Implements batch processing queue
   - Adds progress tracking

2. **EasyPost Agent**:
   - Processes shipments in batches of 10
   - Validates all addresses
   - Creates labels asynchronously
   - Handles failures gracefully
   - Exports results to CSV

**Result:** 100 labels created with error handling

---

## Example 5: Multi-carrier Rate Comparison

**User Request:**
```
Build a rate comparison tool that shows USPS, FedEx, and UPS rates side-by-side
```

**What Happens:**

1. **Planning Agent**:
   - Designs comparison UI/UX
   - Plans caching strategy
   - Specifies rate fetching logic

2. **Backend Agent**:
   - Creates rate comparison API
   - Implements caching layer
   - Adds carrier filtering

3. **Frontend Agent**:
   - Builds comparison table
   - Adds sorting and filtering
   - Creates visual rate chart

4. **EasyPost Agent**:
   - Fetches rates from all carriers
   - Normalizes rate data
   - Handles carrier-specific logic

**Result:** Interactive rate comparison tool

---

## Example 6: Address Validation Service

**User Request:**
```
Create an API that validates and autocompletes addresses
```

**What Happens:**

1. **Backend Agent**:
   - Creates `/api/address/validate` endpoint
   - Adds autocomplete endpoint
   - Implements caching for common addresses

2. **EasyPost Agent**:
   - Validates addresses via EasyPost
   - Returns suggestions
   - Handles international addresses

**Result:** Address validation microservice

---

## Example 7: Shipment Tracking Widget

**User Request:**
```
Build an embeddable tracking widget for my website using Figma designs
```

**What Happens:**

1. **Planning Agent**:
   - Reviews Figma file
   - Plans component structure
   - Designs embed strategy

2. **Frontend Agent**:
   - Converts Figma to React components
   - Creates standalone widget
   - Adds customization options
   - Builds embed script

3. **EasyPost Agent**:
   - Implements tracking lookup
   - Handles tracking events
   - Provides status updates

**Result:** Embeddable tracking widget with custom styling

---

## Example 8: Returns Portal

**User Request:**
```
Create a returns portal where customers can generate return labels
```

**What Happens:**

1. **Planning Agent**:
   - Designs returns workflow
   - Plans database schema for returns
   - Specifies email notifications

2. **Backend Agent**:
   - Creates returns management API
   - Implements order lookup
   - Adds email service integration

3. **Frontend Agent**:
   - Builds return request form
   - Creates returns dashboard
   - Adds print label page

4. **EasyPost Agent**:
   - Generates return labels
   - Calculates return shipping costs
   - Tracks return shipments

**Result:** Complete returns management system

---

## Example 9: Mobile App API

**User Request:**
```
Design and build a REST API for a mobile shipping app
```

**What Happens:**

1. **Planning Agent**:
   - Designs mobile-first API
   - Plans authentication (JWT)
   - Creates API documentation structure

2. **Backend Agent**:
   - Implements RESTful API
   - Adds JWT authentication
   - Creates OpenAPI/Swagger docs
   - Implements rate limiting

3. **EasyPost Agent**:
   - Integrates shipping endpoints
   - Optimizes for mobile bandwidth
   - Adds offline support planning

**Result:** Production-ready mobile API

---

## Example 10: International Shipping

**User Request:**
```
Add international shipping with customs forms
```

**What Happens:**

1. **Planning Agent**:
   - Plans customs data structure
   - Designs compliance checks
   - Specifies country restrictions

2. **Backend Agent**:
   - Creates customs form API
   - Adds country validation
   - Implements HS code lookup

3. **Frontend Agent**:
   - Builds customs form UI
   - Adds multi-currency support
   - Creates country selector

4. **EasyPost Agent**:
   - Handles customs info
   - Validates international addresses
   - Generates proper documentation

**Result:** International shipping with customs

---

## Tips for Best Results

### Be Specific
❌ "Build something with shipping"
✅ "Build a shipping label creator with address validation and rate comparison"

### Provide Context
❌ "Add authentication"
✅ "Add JWT authentication for the mobile API with refresh tokens"

### Use Natural Language
```
"I need a dashboard that shows all shipments from the last 30 days
with filtering by status and carrier"
```

### Break Down Complex Requests
Instead of:
```
"Build an entire SaaS shipping platform"
```

Try:
```
1. "Design the architecture for a SaaS shipping platform"
2. "Build the authentication and user management system"
3. "Create the shipment management features"
4. "Add the billing integration"
```

### Check Status Often
```
🎭 > status
```

See what agents are working on and their current status.

---

## Advanced Patterns

### Sequential Tasks
```
🎭 > First design the database schema for shipments
# Wait for response
🎭 > Now create the API endpoints using that schema
# Wait for response
🎭 > Finally build the UI components
```

### Parallel Development
```
🎭 > Build a shipping app with backend API, frontend dashboard, and EasyPost integration
```

The orchestrator automatically parallelizes work to different agents.

### Iterative Refinement
```
🎭 > Create a shipment form
# Review output
🎭 > Add address autocomplete to that form
# Review output
🎭 > Add validation with better error messages
```

---

## Real-World Integration

The agents generate actual code you can use:

```bash
# 1. Run the team
npm start

# 2. Give it a task
🎭 > Build API endpoints for shipments

# 3. Copy generated code to your project
# Agents output code ready to integrate

# 4. Test it
# Generated code includes tests

# 5. Deploy
# Code is production-ready
```

Happy shipping! 📦🚀
