const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class ApiClient {
	private credentials: { username: string; password: string } | null = null;

	setCredentials(username: string, password: string) {
		this.credentials = { username, password };
		localStorage.setItem("auth", btoa(`${username}:${password}`));
	}

	clearCredentials() {
		this.credentials = null;
		localStorage.removeItem("auth");
	}

	loadCredentials() {
		const auth = localStorage.getItem("auth");
		if (auth) {
			const decoded = atob(auth);
			const [username, password] = decoded.split(":");
			if (username && password) {
				this.credentials = { username, password };
				return true;
			}
		}
		return false;
	}

	private getAuthHeader(): string {
		if (!this.credentials) {
			throw new Error("Not authenticated");
		}
		return `Basic ${btoa(`${this.credentials.username}:${this.credentials.password}`)}`;
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: this.getAuthHeader(),
				...options.headers,
			},
		});

		if (!response.ok) {
			if (response.status === 401) {
				this.clearCredentials();
				throw new Error("Unauthorized");
			}
			throw new Error(`API error: ${response.statusText}`);
		}

		return response.json();
	}

	async login(username: string, password: string): Promise<boolean> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				this.clearCredentials();
				return false;
			}

			const data = await response.json();
			if (data.success) {
				this.setCredentials(username, password);
				return true;
			}

			this.clearCredentials();
			return false;
		} catch {
			this.clearCredentials();
			return false;
		}
	}

	async getDevices() {
		return this.request<Device[]>("/api/devices/");
	}

	async getDevice(id: string) {
		return this.request<Device>(`/api/devices/${id}`);
	}

	async createDevice(data: { name: string; status: string }) {
		return this.request<Device>("/api/devices/", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateDevice(
		id: string,
		data: { name?: string; status?: string; stageId?: number },
	) {
		return this.request<Device>(`/api/devices/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteDevice(id: string) {
		return this.request(`/api/devices/${id}`, {
			method: "DELETE",
		});
	}

	async getStages() {
		return this.request<Stage[]>("/api/stages/");
	}

	async getStage(id: string) {
		return this.request<Stage>(`/api/stages/${id}`);
	}

	async createStage(data: { name: string }) {
		return this.request<Stage>("/api/stages/", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateStage(id: string, data: { name?: string }) {
		return this.request<Stage>(`/api/stages/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteStage(id: string) {
		return this.request(`/api/stages/${id}`, {
			method: "DELETE",
		});
	}

	async getProtocols() {
		return this.request<Protocol[]>("/api/protocols/");
	}

	async getProtocol(id: string) {
		return this.request<Protocol>(`/api/protocols/${id}`);
	}

	async createProtocol(data: { name: string; stageId: number; delay: number }) {
		return this.request<Protocol>("/api/protocols/", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateProtocol(
		id: string,
		data: {
			name?: string;
			stageId?: number;
			delay?: number;
			startHour?: number;
			endHour?: number;
			idealLightIntensity?: number;
			idealExausterIntensity?: number;
			idealBlowerIntensity?: number;
			idealSoilHumidity?: number;
			idealAirHumidity?: number;
			idealTemperature?: number;
			idealCo2?: number;
		},
	) {
		return this.request<Protocol>(`/api/protocols/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteProtocol(id: string) {
		return this.request(`/api/protocols/${id}`, {
			method: "DELETE",
		});
	}

	async getTrackings() {
		return this.request<Tracking[]>("/api/trackings/");
	}

	async getTracking(id: string) {
		return this.request<Tracking>(`/api/trackings/${id}`);
	}

	async getTrackingsByDevice(deviceId: string) {
		return this.request<Tracking[]>(`/api/trackings/device/${deviceId}`);
	}

	async getTrackingsByDeviceHistory(deviceId: string, history: string) {
		return this.request<Tracking[]>(
			`/api/trackings/device/${deviceId}/history/${history}`,
		);
	}

	async getLatestTracking(deviceId: string) {
		return this.request<Tracking>(`/api/trackings/device/${deviceId}/latest`);
	}

	async createTracking(data: {
		deviceId: number;
		temperature: number;
		airHumidity: number;
		soilHumidity: number;
		co2: number;
		ppfd: number;
	}) {
		return this.request<Tracking>("/api/trackings/", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateTracking(
		id: string,
		data: {
			deviceId?: number;
			protocolId?: number;
			temperature?: number;
			humidity?: number;
		},
	) {
		return this.request<Tracking>(`/api/trackings/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteTracking(id: string) {
		return this.request(`/api/trackings/${id}`, {
			method: "DELETE",
		});
	}
}

export const apiClient = new ApiClient();

export interface Device {
	id: number;
	name: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	stage?: Stage;
}

export interface Stage {
	id: number;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface Protocol {
	id: number;
	name: string;
	stageId: number;
	delay: number;
	startHour?: number;
	endHour?: number;
	idealLightIntensity?: number;
	idealExausterIntensity?: number;
	idealBlowerIntensity?: number;
	idealSoilHumidity?: number;
	idealAirHumidity?: number;
	idealTemperature?: number;
	idealCo2?: number;
	createdAt?: string;
	updatedAt?: string;
	stage?: Stage;
}

export interface Tracking {
	id: number;
	deviceId: number;
	device: Device;
	protocolId: number;
	temperature: number;
	airHumidity: number;
	soilHumidity: number;
	co2: number;
	lux: number;
	humidity: number;
	turnLightIntensity?: number;
	turnExausterIntensity?: number;
	turnBlowerIntensity?: number;
	turnACOn?: number;
	turnWaterOn?: boolean;
	turnFan1On?: boolean;
	turnFan2On?: boolean;
	turnHumidifierOn?: boolean;
	turnDehumidifierOn?: boolean;
	createdAt: string;
	protocol?: Protocol;
}
