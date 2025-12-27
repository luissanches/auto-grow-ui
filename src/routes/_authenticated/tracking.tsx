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
import { apiClient, type Tracking } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/tracking")({
	component: TrackingComponent,
});

function TrackingComponent() {
	const [trackings, setTrackings] = useState<Tracking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadTrackings();
	}, []);

	const loadTrackings = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const data = await apiClient.getTrackings();
			setTrackings(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load trackings");
		} finally {
			setIsLoading(false);
		}
	});

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this tracking record?")) {
			return;
		}
		try {
			await apiClient.deleteTracking(id.toString());
			loadTrackings();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete tracking",
			);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Tracking</CardTitle>
						<Button>Add Tracking</Button>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading && <p>Loading...</p>}
					{error && <p className="text-destructive">{error}</p>}
					{!isLoading && !error && trackings.length === 0 && (
						<p className="text-muted-foreground">No tracking records found</p>
					)}
					{!isLoading && !error && trackings.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Device</TableHead>
									<TableHead>Temperature</TableHead>
									<TableHead>Air Humidity</TableHead>
									<TableHead>Soil Humidity</TableHead>
									<TableHead>CO2</TableHead>
									<TableHead>PPFD</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{trackings.map((tracking) => (
									<TableRow key={tracking.id}>
										<TableCell>{tracking.device.name}</TableCell>
										<TableCell>{tracking.temperature}°C</TableCell>
										<TableCell>{tracking.airHumidity}%</TableCell>
										<TableCell>{tracking.soilHumidity}%</TableCell>
										<TableCell>{tracking.co2} ppm</TableCell>
										<TableCell>{tracking.ppfd} µmol/m²/s</TableCell>
										<TableCell>{formatDate(tracking.createdAt)}</TableCell>
										<TableCell>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleDelete(tracking.id)}
											>
												Delete
											</Button>
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
