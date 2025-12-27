import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient, type Device, type Stage } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/devices/$deviceId/edit")({
	component: EditDeviceComponent,
});

function EditDeviceComponent() {
	const { deviceId } = Route.useParams();
	const navigate = useNavigate();

	const [device, setDevice] = useState<Device | null>(null);
	const [stages, setStages] = useState<Stage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const [name, setName] = useState("");
	const [stageId, setStageId] = useState<number | null>(null);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const [deviceData, stagesData] = await Promise.all([
				apiClient.getDevice(deviceId),
				apiClient.getStages(),
			]);

			setDevice(deviceData);
			setStages(stagesData);
			setName(deviceData.name);
			setStageId(deviceData.stage?.id || null);

			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load data");
		} finally {
			setIsLoading(false);
		}
	});

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			setError("Device name is required");
			return;
		}

		try {
			setIsSaving(true);
			setError(null);

			await apiClient.updateDevice(deviceId, {
				name: name.trim(),
				stageId: stageId || undefined,
			});

			navigate({ to: "/devices" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update device");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		navigate({ to: "/devices" });
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

	if (error && !device) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<p className="text-destructive">{error}</p>
						<Button onClick={handleCancel} className="mt-4">
							Back to Devices
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
					<CardTitle>Edit Device</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSave} className="space-y-4">
						{error && <p className="text-destructive">{error}</p>}

						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								Device Name
							</label>
							<Input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter device name"
								disabled={isSaving}
								required
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="stage" className="text-sm font-medium">
								Stage
							</label>
							<select
								id="stage"
								value={stageId || ""}
								onChange={(e) => {
									setStageId(e.target.value ? Number(e.target.value) : null);
								}}
								disabled={isSaving}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="">No stage assigned</option>
								{stages.map((stage) => (
									<option key={stage.id} value={stage.id}>
										{stage.name}
									</option>
								))}
							</select>
						</div>

						<div className="flex gap-2 pt-4">
							<Button type="submit" disabled={isSaving}>
								{isSaving ? "Saving..." : "Save Changes"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={isSaving}
							>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
