type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
	level: LogLevel;
	enabled: boolean;
	timestamp: boolean;
	prefix?: string;
}

class Logger {
	private config: LoggerConfig = {
		level: "info",
		enabled: true,
		timestamp: true,
		prefix: "[AutoGrow]",
	};

	private readonly levels: Record<LogLevel, number> = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
	};

	constructor() {
		// Set log level based on environment
		if (
			import.meta.env.NODE_ENV === "development" ||
			import.meta.env.NODE_ENV === "production"
		) {
			this.config.level = "debug";
		} else {
			this.config.level = "warn";
		}
	}

	configure(config: Partial<LoggerConfig>) {
		this.config = { ...this.config, ...config };
	}

	private shouldLog(level: LogLevel): boolean {
		if (!this.config.enabled) return false;
		return this.levels[level] >= this.levels[this.config.level];
	}

	private formatMessage(
		level: LogLevel,
		message: string,
		_data?: unknown,
	): string {
		const parts: string[] = [];

		if (this.config.timestamp) {
			parts.push(new Date().toISOString());
		}

		if (this.config.prefix) {
			parts.push(this.config.prefix);
		}

		parts.push(`[${level.toUpperCase()}]`);
		parts.push(message);

		return parts.join(" ");
	}

	debug(message: string, data?: unknown) {
		if (this.shouldLog("debug")) {
			console.debug(this.formatMessage("debug", message), data ?? "");
		}
	}

	info(message: string, data?: unknown) {
		if (this.shouldLog("info")) {
			console.info(this.formatMessage("info", message), data ?? "");
		}
	}

	warn(message: string, data?: unknown) {
		if (this.shouldLog("warn")) {
			console.warn(this.formatMessage("warn", message), data ?? "");
		}
	}

	error(message: string, error?: unknown) {
		if (this.shouldLog("error")) {
			console.error(this.formatMessage("error", message), error ?? "");
		}
	}

	// Convenience methods for API calls
	apiRequest(method: string, endpoint: string, data?: unknown) {
		this.debug(`API Request: ${method} ${endpoint}`, data);
	}

	apiResponse(
		method: string,
		endpoint: string,
		status: number,
		data?: unknown,
	) {
		if (status >= 400) {
			this.error(`API Error: ${method} ${endpoint} - Status ${status}`, data);
		} else {
			this.debug(
				`API Response: ${method} ${endpoint} - Status ${status}`,
				data,
			);
		}
	}

	apiError(method: string, endpoint: string, error: unknown) {
		this.error(`API Failed: ${method} ${endpoint}`, error);
	}
}

export const logger = new Logger();
