/**
 * Global Logger Usage Examples
 *
 * The logger is automatically configured based on environment:
 * - Development: Shows debug, info, warn, and error logs
 * - Production: Shows only warn and error logs
 */

import { logger } from "./logger";

// Basic logging methods
export function basicLoggingExamples() {
	// Debug - detailed information for debugging
	logger.debug("User clicked button", { buttonId: "submit" });

	// Info - general informational messages
	logger.info("Application started");

	// Warn - warning messages that don't prevent execution
	logger.warn("API response took longer than expected", { duration: 5000 });

	// Error - error messages for failures
	logger.error("Failed to save data", new Error("Network timeout"));
}

// API logging methods (already integrated in api.ts)
export function apiLoggingExamples() {
	// These are used automatically in the ApiClient
	logger.apiRequest("GET", "/api/devices");
	logger.apiResponse("GET", "/api/devices", 200);
	logger.apiError("POST", "/api/devices", new Error("Validation failed"));
}

// Custom configuration
export function configureLogger() {
	// Disable logging entirely
	logger.configure({ enabled: false });

	// Change log level
	logger.configure({ level: "warn" }); // Only warn and error

	// Disable timestamps
	logger.configure({ timestamp: false });

	// Change prefix
	logger.configure({ prefix: "[MyApp]" });

	// Multiple options at once
	logger.configure({
		level: "info",
		timestamp: true,
		prefix: "[AutoGrow]",
		enabled: true,
	});
}

// Usage in components
export function componentLoggingExample() {
	const handleSubmit = async (data: unknown) => {
		logger.debug("Form submitted", data);

		try {
			// API call here
			logger.info("Data saved successfully");
		} catch (error) {
			logger.error("Failed to save data", error);
		}
	};

	return handleSubmit;
}
