import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { apiClient, type Device, type Tracking } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/tracking/")({
	component: TrackingComponent,
});

function TrackingComponent() {
	const navigate = useNavigate();
	const [trackings, setTrackings] = useState<Tracking[]>([]);
	const [devices, setDevices] = useState<Device[]>([]);
	const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
	const [selectedHistory, setSelectedHistory] = useState<string>("today");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadDevices();
	}, []);

	useEffect(() => {
		if (selectedDeviceId) {
			loadTrackings();
		}
	}, [selectedDeviceId, selectedHistory]);

	const loadDevices = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const data = await apiClient.getDevices();
			setDevices(data);
			if (data.length > 0) {
				setSelectedDeviceId(data[0].id.toString());
			}
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load devices");
		} finally {
			setIsLoading(false);
		}
	});

	const loadTrackings = useEffectEvent(async () => {
		if (!selectedDeviceId) return;

		try {
			setIsLoading(true);
			const data = await apiClient.getTrackingsByDeviceHistory(
				selectedDeviceId,
				selectedHistory,
			);
			setTrackings(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load trackings");
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Tracking</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex gap-4">
						<div className="flex-1">
							<label
								htmlFor="device"
								className="text-sm font-medium block mb-2"
							>
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
						<div className="flex-1">
							<label
								htmlFor="history"
								className="text-sm font-medium block mb-2"
							>
								History
							</label>
							<select
								id="history"
								value={selectedHistory}
								onChange={(e) => setSelectedHistory(e.target.value)}
								disabled={isLoading}
								className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="today">Today</option>
								<option value="week">Week</option>
								<option value="month">Month</option>
								<option value="quarter">Quarter</option>
								<option value="semester">Semester</option>
								<option value="year">Year</option>
							</select>
						</div>
					</div>

					{isLoading && <p>Loading...</p>}
					{error && <p className="text-destructive">{error}</p>}
					{!isLoading && !error && !selectedDeviceId && (
						<p className="text-muted-foreground">
							Please select a device to view tracking records
						</p>
					)}
					{!isLoading &&
						!error &&
						selectedDeviceId &&
						trackings.length === 0 && (
							<p className="text-muted-foreground">
								No tracking records found for this device
							</p>
						)}
					{!isLoading && !error && trackings.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Temperature</TableHead>
									<TableHead>Air Humidity</TableHead>
									<TableHead>Soil Humidity</TableHead>
									<TableHead>CO2</TableHead>
									<TableHead>Lux</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{trackings.map((tracking) => (
									<TableRow key={tracking.id}>
										<TableCell>{tracking.temperature}°C</TableCell>
										<TableCell>{tracking.airHumidity}%</TableCell>
										<TableCell>{tracking.soilHumidity}%</TableCell>
										<TableCell>{tracking.co2} ppm</TableCell>
										<TableCell>{tracking.lux}</TableCell>
										<TableCell>{formatDate(tracking.createdAt)}</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														navigate({
															to: "/tracking/$trackingId",
															params: { trackingId: tracking.id.toString() },
														})
													}
												>
													View Details
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
