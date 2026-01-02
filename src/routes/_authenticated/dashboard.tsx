import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient, type Device, type Tracking } from "@/lib/api";
import { logger } from "@/lib/logger";
import { formatDate } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: DashboardComponent,
});

function DashboardComponent() {
	const [devices, setDevices] = useState<Device[]>([]);
	const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
	const [latestTracking, setLatestTracking] = useState<Tracking | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadDevices();
	}, []);

	useEffect(() => {
		if (selectedDeviceId) {
			loadLatestTracking();
		}
	}, [selectedDeviceId]);

	const loadDevices = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			logger.debug("Loading devices");
			const data = await apiClient.getDevices();
			setDevices(data);
			if (data.length > 0 && data[0]) {
				setSelectedDeviceId(data[0].id.toString());
				logger.info(`Loaded ${data.length} devices, selected: ${data[0].name}`);
			}
			setError(null);
		} catch (err) {
			logger.error("Failed to load devices", err);
			setError(err instanceof Error ? err.message : "Failed to load devices");
		} finally {
			setIsLoading(false);
		}
	});

	const loadLatestTracking = useEffectEvent(async () => {
		if (!selectedDeviceId) return;

		try {
			setIsLoading(true);
			logger.debug(`Loading latest tracking for device ${selectedDeviceId}`);
			const data = await apiClient.getLatestTracking(selectedDeviceId);
			setLatestTracking(data);
			logger.info("Latest tracking loaded successfully");
			setError(null);
		} catch (err) {
			logger.warn("No tracking data available for device", {
				deviceId: selectedDeviceId,
			});
			setError(null);
			setLatestTracking(null);
		} finally {
			setIsLoading(false);
		}
	});

	const selectedDevice = devices.find(
		(d) => d.id.toString() === selectedDeviceId,
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

			<div className="mb-6">
				<label htmlFor="device" className="text-sm font-medium block mb-2">
					Select Device
				</label>
				<select
					id="device"
					value={selectedDeviceId}
					onChange={(e) => setSelectedDeviceId(e.target.value)}
					disabled={isLoading || devices.length === 0}
					className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{devices.length === 0 ? (
						<option value="">No devices available</option>
					) : (
						devices.map((device) => (
							<option key={device.id} value={device.id}>
								{device.name}
							</option>
						))
					)}
				</select>
			</div>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-destructive">{error}</p>}
			{!isLoading && !error && !selectedDeviceId && (
				<p className="text-muted-foreground">
					Please select a device to view dashboard
				</p>
			)}
			{!isLoading && !error && selectedDeviceId && !latestTracking && (
				<p className="text-muted-foreground">
					No data available for this device
				</p>
			)}

			{!isLoading && !error && latestTracking && selectedDevice && (
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Device Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Device Name</p>
									<p className="text-lg font-semibold">{selectedDevice.name}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Stage</p>
									<p className="text-lg font-semibold">
										{selectedDevice.stage?.name || "N/A"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Sensor Readings</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Temperature</p>
									<p className="text-lg font-semibold">
										{latestTracking.temperature}°C
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Air Humidity</p>
									<p className="text-lg font-semibold">
										{latestTracking.airHumidity}%
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Lux</p>
									<p className="text-lg font-semibold">{latestTracking.lux}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Soil Humidity</p>
									<p className="text-lg font-semibold">
										{latestTracking.soilHumidity}%
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">CO2</p>
									<p className="text-lg font-semibold">
										{latestTracking.co2} ppm
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Created At</p>
									<p className="text-lg font-semibold">
										{formatDate(latestTracking.createdAt)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Control Settings</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">AC</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnACOn ? "On" : "Off"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Light Intensity
									</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnLightIntensity ?? "N/A"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Humidifier</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnHumidifierOn ? "On" : "Off"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Dehumidifier</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnDehumidifierOn ? "On" : "Off"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Fan 1</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnFan1On ? "On" : "Off"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Fan 2</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnFan2On ? "On" : "Off"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Exauster Intensity
									</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnExausterIntensity ?? "N/A"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Blower Intensity
									</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnBlowerIntensity ?? "N/A"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Water</p>
									<p className="text-lg font-semibold">
										{latestTracking.turnWaterOn ? "On" : "Off"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
