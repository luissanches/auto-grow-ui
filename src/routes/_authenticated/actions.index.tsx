import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { apiClient, type Action, type Device } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/actions/")({
	component: ActionsComponent,
});

function ActionsComponent() {
	const navigate = useNavigate();
	const [action, setAction] = useState<Action | null>(null);
	const [devices, setDevices] = useState<Device[]>([]);
	const [selectedDeviceId, setSelectedDeviceId] = useState<number | undefined>(
		0,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const devicesData = await apiClient.getDevices();
			setDevices(devicesData);
			setSelectedDeviceId(devicesData[0]?.id);

			const actionsData = await apiClient.getActionsByDevice(
				devicesData[0]?.id || 0,
			);

			console.log("actionsData :>> ", actionsData);
			setAction(actionsData);
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
				"Are you sure you want to delete this action? This action cannot be undone.",
			)
		) {
			return;
		}

		try {
			setIsDeleting(true);
			setError(null);

			await apiClient.deleteAction(actionId.toString());

			// Clear the action
			setAction(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete action");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex justify-between">
						<CardTitle>Actions</CardTitle>
						<Button
							className="cursor-pointer"
							onClick={() => navigate({ to: "/actions/new" })}
							disabled={isLoading}
							variant="outline"
						>
							New Action
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
								Select Device
							</label>
							<Select
								id="device-filter"
								value={selectedDeviceId}
								onChange={(e) => setSelectedDeviceId(+e.target.value)}
								disabled={isLoading}
								className="w-full max-w-md"
							>
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
					{!isLoading && !error && !action && (
						<p className="text-muted-foreground">
							No action found for the selected device
						</p>
					)}
					{!isLoading && !error && action && (
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>Action Details</CardTitle>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												navigate({ to: `/actions/${action.id}/edit` })
											}
											className="cursor-pointer"
											disabled={isDeleting}
										>
											Edit
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => action.id && handleDelete(action.id)}
											disabled={isDeleting || !action.id}
											className="cursor-pointer"
										>
											{isDeleting ? "Deleting..." : "Delete"}
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{/* Intensity Controls Section */}
									<div>
										<h3 className="text-sm font-semibold mb-3 text-muted-foreground">
											Intensity Controls
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											<div className="space-y-1">
												<p className="text-sm font-medium">Light Intensity</p>
												<p className="text-2xl font-bold">
													{action.turnLightIntensity}%
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">
													Exhauster Intensity
												</p>
												<p className="text-2xl font-bold">
													{action.turnExausterIntensity}%
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Blower Intensity</p>
												<p className="text-2xl font-bold">
													{action.turnBlowerIntensity}%
												</p>
											</div>
										</div>
									</div>

									{/* Binary Controls Section */}
									<div>
										<h3 className="text-sm font-semibold mb-3 text-muted-foreground">
											Device Controls
										</h3>
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
											<div className="space-y-1">
												<p className="text-sm font-medium">AC</p>
												<p className="text-lg font-semibold">
													{action.turnACOn === 1 ? "On" : "Off"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Water</p>
												<p className="text-lg font-semibold">
													{action.turnWaterOn === 1 ? "On" : "Off"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Fan 1</p>
												<p className="text-lg font-semibold">
													{action.turnFan1On === 1 ? "On" : "Off"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Fan 2</p>
												<p className="text-lg font-semibold">
													{action.turnFan2On === 1 ? "On" : "Off"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Humidifier</p>
												<p className="text-lg font-semibold">
													{action.turnHumidifierOn === 1 ? "On" : "Off"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Dehumidifier</p>
												<p className="text-lg font-semibold">
													{action.turnDehumidifierOn === 1 ? "On" : "Off"}
												</p>
											</div>
										</div>
									</div>

									{/* Cycles & Status Section */}
									<div>
										<h3 className="text-sm font-semibold mb-3 text-muted-foreground">
											Status & Cycles
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
											<div className="space-y-1">
												<p className="text-sm font-medium">Cycles</p>
												<p className="text-2xl font-bold">
													{action.cycles}/{action.maxCycles}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm font-medium">Status</p>
												<span
													className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
														action.status === "active"
															? "bg-green-50 text-green-700"
															: "bg-gray-50 text-gray-600"
													}`}
												>
													{action.status}
												</span>
											</div>
											{action.createdAt && (
												<div className="space-y-1">
													<p className="text-sm font-medium">Created</p>
													<p className="text-sm text-muted-foreground">
														{formatDate(action.createdAt)}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
