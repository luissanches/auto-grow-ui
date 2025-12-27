import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient, type Tracking } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/tracking/$trackingId")({
	component: TrackingDetailsComponent,
});

function TrackingDetailsComponent() {
	const { trackingId } = Route.useParams();
	const navigate = useNavigate();

	const [tracking, setTracking] = useState<Tracking | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadTracking();
	}, []);

	const loadTracking = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const data = await apiClient.getTracking(trackingId);
			setTracking(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load tracking");
		} finally {
			setIsLoading(false);
		}
	});

	const handleBack = () => {
		navigate({ to: "/tracking" });
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<p>Loading...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !tracking) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<p className="text-destructive">{error || "Tracking not found"}</p>
						<Button onClick={handleBack} className="mt-4">
							Back to Tracking
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Tracking Details</CardTitle>
						<Button variant="outline" onClick={handleBack}>
							Back to Tracking
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-semibold mb-4">
									Device Information
								</h3>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Device Name:</span>
										<span className="font-medium">{tracking.device.name}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Device ID:</span>
										<span className="font-medium">{tracking.deviceId}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Device Status:
										</span>
										<span className="font-medium">
											{tracking.device.status}
										</span>
									</div>
									{tracking.device.stage && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Stage:</span>
											<span className="font-medium">
												{tracking.device.stage.name}
											</span>
										</div>
									)}
								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4">
									Tracking Information
								</h3>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Tracking ID:</span>
										<span className="font-medium">{tracking.id}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Protocol ID:</span>
										<span className="font-medium">{tracking.protocolId}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Created At:</span>
										<span className="font-medium">
											{formatDate(tracking.createdAt)}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Sensor Readings</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-medium text-muted-foreground">
											Temperature
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{tracking.temperature}°C
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-medium text-muted-foreground">
											Air Humidity
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{tracking.airHumidity}%
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-medium text-muted-foreground">
											Soil Humidity
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{tracking.soilHumidity}%
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-medium text-muted-foreground">
											CO2
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{tracking.co2} ppm</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-medium text-muted-foreground">
											PPFD
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{tracking.ppfd} µmol/m²/s
										</div>
									</CardContent>
								</Card>

								{tracking.humidity !== undefined && (
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-sm font-medium text-muted-foreground">
												Humidity
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{tracking.humidity}%
											</div>
										</CardContent>
									</Card>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
