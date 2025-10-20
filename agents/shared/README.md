# Shared Agent Utilities

Common utilities and configurations used across multiple EasyPost agents.

## Structure

- `config/` - Shared configuration files and constants
- `utils/` - Reusable utility functions

## Usage

Import shared utilities in your agents:

```javascript
// Node.js example
import { getEasyPostClient } from '../shared/utils/easypost.js';

const client = getEasyPostClient();
```

```python
# Python example
from shared.utils.easypost import get_easypost_client

client = get_easypost_client()
```

## Adding New Shared Utilities

1. Add your utility to the appropriate directory
2. Export it properly
3. Document its usage in this README
4. Update existing agents to use the shared utility if applicable
