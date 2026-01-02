# Global Logger

A global logging utility for the AutoGrow UI application.

## Features

- **Environment-aware**: Automatically adjusts log levels based on environment
  - Development: Shows all logs (debug, info, warn, error)
  - Production: Shows only warnings and errors
- **Structured logging**: Includes timestamps and prefixes
- **API-specific methods**: Special methods for logging API requests/responses
- **Configurable**: Adjust log levels, enable/disable logging, customize formatting

## Usage

### Basic Logging

```typescript
import { logger } from "@/lib/logger";

// Debug messages (only in development)
logger.debug("Detailed debug information", { userId: 123 });

// Info messages
logger.info("User logged in successfully");

// Warnings
logger.warn("Cache miss, fetching from API");

// Errors
logger.error("Failed to load data", error);
```

### In Components

The logger is already integrated into the dashboard component:

```typescript
import { logger } from "@/lib/logger";

const loadData = async () => {
  try {
    logger.debug("Loading devices");
    const data = await apiClient.getDevices();
    logger.info(`Loaded ${data.length} devices`);
  } catch (err) {
    logger.error("Failed to load devices", err);
  }
};
```

### API Integration

The logger is automatically integrated with the API client ([api.ts](src/lib/api.ts)). All API requests, responses, and errors are logged automatically:

```typescript
// This is done automatically in api.ts:
logger.apiRequest("GET", "/api/devices");
logger.apiResponse("GET", "/api/devices", 200);
logger.apiError("GET", "/api/devices", error);
```

## Configuration

You can configure the logger at any time:

```typescript
import { logger } from "@/lib/logger";

// Change log level
logger.configure({ level: "warn" }); // Only show warnings and errors

// Disable logging
logger.configure({ enabled: false });

// Customize prefix
logger.configure({ prefix: "[MyApp]" });

// Multiple options
logger.configure({
  level: "info",
  timestamp: true,
  prefix: "[AutoGrow]",
  enabled: true,
});
```

## Log Levels

1. **debug**: Detailed information for debugging (development only)
2. **info**: General informational messages
3. **warn**: Warning messages that don't prevent execution
4. **error**: Error messages for failures

## Output Format

```
2026-01-02T10:30:45.123Z [AutoGrow] [INFO] User logged in successfully
2026-01-02T10:30:46.456Z [AutoGrow] [DEBUG] API Request: GET /api/devices
2026-01-02T10:30:46.789Z [AutoGrow] [ERROR] Failed to load data Error: Network timeout
```

## Files

- [src/lib/logger.ts](src/lib/logger.ts) - Logger implementation
- [src/lib/logger.example.ts](src/lib/logger.example.ts) - Usage examples
- [src/lib/api.ts](src/lib/api.ts) - Logger integrated into API client
- [src/routes/_authenticated/dashboard.tsx](src/routes/_authenticated/dashboard.tsx) - Logger usage in components

## Best Practices

1. Use `debug` for detailed information that helps during development
2. Use `info` for important application events (login, data loaded, etc.)
3. Use `warn` for recoverable issues (cache misses, slow responses)
4. Use `error` for failures that prevent functionality
5. Always include relevant context data as the second parameter
6. In production, the logger automatically filters out debug messages to reduce noise
