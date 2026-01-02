import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { apiClient, type CustomAction, type Device } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/actions/")({
	component: ActionsComponent,
});

function ActionsComponent() {
	const navigate = useNavigate();
	const [actions, setActions] = useState<CustomAction[]>([]);
	const [devices, setDevices] = useState<Device[]>([]);
	const [selectedDeviceId, setSelectedDeviceId] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingActionId, setDeletingActionId] = useState<number | null>(null);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const [actionsData, devicesData] = await Promise.all([
				apiClient.getCustomActions(),
				apiClient.getDevices(),
			]);
			setActions(actionsData);
			setDevices(devicesData);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load data");
		} finally {
			setIsLoading(false);
		}
	});

	const handleDelete = async (actionId: number) => {
		if (
			!confirm(
				"Are you sure you want to delete this custom action? This action cannot be undone.",
			)
		) {
			return;
		}

		try {
			setDeletingActionId(actionId);
			setError(null);

			await apiClient.deleteCustomAction(actionId.toString());

			// Remove the deleted action from the list
			setActions(actions.filter((action) => action.id !== actionId));
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete custom action",
			);
		} finally {
			setDeletingActionId(null);
		}
	};

	const filteredActions =
		selectedDeviceId === "all"
			? actions
			: actions.filter(
					(action) => action.deviceId === Number(selectedDeviceId),
				);

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex justify-between">
						<CardTitle>Custom Actions</CardTitle>
						<Button
							className="cursor-pointer"
							onClick={() => navigate({ to: "/actions/new" })}
							disabled={isLoading}
							variant="outline"
						>
							New Custom Action
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex gap-4">
						<div className="flex-1">
							<label
								htmlFor="device-filter"
								className="text-sm font-medium block mb-2"
							>
								Filter by Device:
							</label>
							<Select
								id="device-filter"
								value={selectedDeviceId}
								onChange={(e) => setSelectedDeviceId(e.target.value)}
								disabled={isLoading}
								className="w-full max-w-md"
							>
								<option value="all">All Devices</option>
								{devices.map((device) => (
									<option key={device.id} value={device.id}>
										{device.name}
									</option>
								))}
							</Select>
						</div>
					</div>
					{isLoading && <p>Loading...</p>}
					{error && <p className="text-destructive">{error}</p>}
					{!isLoading && !error && filteredActions.length === 0 && (
						<p className="text-muted-foreground">
							{selectedDeviceId === "all"
								? "No custom actions found"
								: "No custom actions found for the selected device"}
						</p>
					)}
					{!isLoading && !error && filteredActions.length > 0 && (
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
									{filteredActions.map((action) => (
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
														className="cursor-pointer"
														disabled={deletingActionId === action.id}
													>
														Edit
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => action.id && handleDelete(action.id)}
														disabled={
															deletingActionId === action.id || !action.id
														}
														className="cursor-pointer"
													>
														{deletingActionId === action.id
															? "Deleting..."
															: "Delete"}
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
