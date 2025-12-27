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
import { apiClient, type Device } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/devices/")({
	component: DevicesComponent,
});

function DevicesComponent() {
	const navigate = useNavigate();
	const [devices, setDevices] = useState<Device[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadDevices();
	}, []);

	const loadDevices = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const data = await apiClient.getDevices();
			setDevices(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load devices");
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Devices</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading && <p>Loading...</p>}
					{error && <p className="text-destructive">{error}</p>}
					{!isLoading && !error && devices.length === 0 && (
						<p className="text-muted-foreground">No devices found</p>
					)}
					{!isLoading && !error && devices.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Stage</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{devices.map((device) => (
									<TableRow key={device.id}>
										<TableCell>{device.id}</TableCell>
										<TableCell>{device.name}</TableCell>
										<TableCell>{device.status}</TableCell>
										<TableCell>{device.stage?.name}</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														navigate({ to: `/devices/${device.id}/edit` })
													}
												>
													Edit
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
