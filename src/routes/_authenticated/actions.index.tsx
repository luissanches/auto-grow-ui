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
import { apiClient, type CustomAction } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/actions/")({
	component: ActionsComponent,
});

function ActionsComponent() {
	const navigate = useNavigate();
	const [actions, setActions] = useState<CustomAction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadActions();
	}, []);

	const loadActions = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const data = await apiClient.getCustomActions();
			setActions(data);
			setError(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load custom actions",
			);
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Custom Actions</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading && <p>Loading...</p>}
					{error && <p className="text-destructive">{error}</p>}
					{!isLoading && !error && actions.length === 0 && (
						<p className="text-muted-foreground">No custom actions found</p>
					)}
					{!isLoading && !error && actions.length > 0 && (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID</TableHead>
										<TableHead>Device</TableHead>
										<TableHead>AC</TableHead>
										<TableHead>Light</TableHead>
										<TableHead>Exauster</TableHead>
										<TableHead>Blower</TableHead>
										<TableHead>Cycles</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{actions.map((action) => (
										<TableRow key={action.id}>
											<TableCell>{action.id}</TableCell>
											<TableCell>{action.device?.name || "N/A"}</TableCell>

											<TableCell>
												{action.turnACOn === 1 ? "On" : "Off"}
											</TableCell>
											<TableCell>{action.turnLightIntensity}%</TableCell>
											<TableCell>{action.turnExausterIntensity}%</TableCell>
											<TableCell>{action.turnBlowerIntensity}%</TableCell>
											<TableCell>
												{action.cycles}/{action.maxCycles}
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
														action.status === "active"
															? "bg-green-50 text-green-700"
															: "bg-gray-50 text-gray-600"
													}`}
												>
													{action.status}
												</span>
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															navigate({ to: `/actions/${action.id}/edit` })
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
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
