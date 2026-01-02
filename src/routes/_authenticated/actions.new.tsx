import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient, type Device } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/actions/new")({
	component: NewActionComponent,
});

function NewActionComponent() {
	const navigate = useNavigate();

	const [devices, setDevices] = useState<Device[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	// Form state with default values
	const [deviceId, setDeviceId] = useState<number | null>(null);
	const [status, setStatus] = useState<"active" | "inactive">("active");
	const [turnLightIntensity, setTurnLightIntensity] = useState(0);
	const [turnExausterIntensity, setTurnExausterIntensity] = useState(0);
	const [turnBlowerIntensity, setTurnBlowerIntensity] = useState(0);
	const [turnACOn, setTurnACOn] = useState(0);
	const [turnWaterOn, setTurnWaterOn] = useState(0);
	const [turnFan1On, setTurnFan1On] = useState(0);
	const [turnFan2On, setTurnFan2On] = useState(0);
	const [turnHumidifierOn, setTurnHumidifierOn] = useState(0);
	const [turnDehumidifierOn, setTurnDehumidifierOn] = useState(0);
	const [maxCycles, setMaxCycles] = useState(0);
	const [cycles, setCycles] = useState(0);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const devicesData = await apiClient.getDevices();
			setDevices(devicesData);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load devices");
		} finally {
			setIsLoading(false);
		}
	});

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!deviceId) {
			setError("Device is required");
			return;
		}

		if (
			turnLightIntensity < 0 ||
			turnLightIntensity > 100 ||
			turnExausterIntensity < 0 ||
			turnExausterIntensity > 100 ||
			turnBlowerIntensity < 0 ||
			turnBlowerIntensity > 100
		) {
			setError("Intensity values must be between 0 and 100");
			return;
		}

		if (maxCycles < 0 || cycles < 0) {
			setError("Cycle values cannot be negative");
			return;
		}

		try {
			setIsSaving(true);
			setError(null);

			await apiClient.createCustomAction({
				deviceId,
				turnLightIntensity,
				turnExausterIntensity,
				turnBlowerIntensity,
				turnACOn,
				turnWaterOn,
				turnFan1On,
				turnFan2On,
				turnHumidifierOn,
				turnDehumidifierOn,
				maxCycles,
				cycles,
				status,
			});

			navigate({ to: "/actions" });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create custom action",
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		navigate({ to: "/actions" });
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

	if (error && devices.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<p className="text-destructive">{error}</p>
						<Button onClick={handleCancel} className="mt-4">
							Back to Custom Actions
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
					<CardTitle>Create New Custom Action</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSave} className="space-y-6">
						{error && <p className="text-destructive">{error}</p>}

						{/* Section 1: Basic Info */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Basic Information</h3>

							<div className="space-y-2">
								<label htmlFor="device" className="text-sm font-medium">
									Device
								</label>
								<select
									id="device"
									value={deviceId || ""}
									onChange={(e) =>
										setDeviceId(e.target.value ? Number(e.target.value) : null)
									}
									disabled={isSaving}
									required
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">Select a device</option>
									{devices.map((device) => (
										<option key={device.id} value={device.id}>
											{device.name}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<label htmlFor="status" className="text-sm font-medium">
									Status
								</label>
								<select
									id="status"
									value={status}
									onChange={(e) =>
										setStatus(e.target.value as "active" | "inactive")
									}
									disabled={isSaving}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
							</div>
						</div>

						{/* Section 2: Intensity Controls */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Intensity Controls (0-100)</h3>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<label
										htmlFor="turnLightIntensity"
										className="text-sm font-medium"
									>
										Light Intensity
									</label>
									<Input
										id="turnLightIntensity"
										type="number"
										min="0"
										max="100"
										step="1"
										value={turnLightIntensity}
										onChange={(e) =>
											setTurnLightIntensity(Number(e.target.value))
										}
										disabled={isSaving}
										required
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="turnExausterIntensity"
										className="text-sm font-medium"
									>
										Exauster Intensity
									</label>
									<Input
										id="turnExausterIntensity"
										type="number"
										min="0"
										max="100"
										step="1"
										value={turnExausterIntensity}
										onChange={(e) =>
											setTurnExausterIntensity(Number(e.target.value))
										}
										disabled={isSaving}
										required
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="turnBlowerIntensity"
										className="text-sm font-medium"
									>
										Blower Intensity
									</label>
									<Input
										id="turnBlowerIntensity"
										type="number"
										min="0"
										max="100"
										step="1"
										value={turnBlowerIntensity}
										onChange={(e) =>
											setTurnBlowerIntensity(Number(e.target.value))
										}
										disabled={isSaving}
										required
									/>
								</div>
							</div>
						</div>

						{/* Section 3: Binary Controls */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Device Controls</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="turnACOn"
										checked={turnACOn === 1}
										onChange={(e) => setTurnACOn(e.target.checked ? 1 : 0)}
										disabled={isSaving}
										className="h-4 w-4 rounded border-gray-300"
									/>
									<label htmlFor="turnACOn" className="text-sm font-medium">
										AC
									</label>
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="turnWaterOn"
										checked={turnWaterOn === 1}
										onChange={(e) => setTurnWaterOn(e.target.checked ? 1 : 0)}
										disabled={isSaving}
										className="h-4 w-4 rounded border-gray-300"
									/>
									<label htmlFor="turnWaterOn" className="text-sm font-medium">
										Water
									</label>
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="turnFan1On"
										checked={turnFan1On === 1}
										onChange={(e) => setTurnFan1On(e.target.checked ? 1 : 0)}
										disabled={isSaving}
										className="h-4 w-4 rounded border-gray-300"
									/>
									<label htmlFor="turnFan1On" className="text-sm font-medium">
										Fan 1
									</label>
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="turnFan2On"
										checked={turnFan2On === 1}
										onChange={(e) => setTurnFan2On(e.target.checked ? 1 : 0)}
										disabled={isSaving}
										className="h-4 w-4 rounded border-gray-300"
									/>
									<label htmlFor="turnFan2On" className="text-sm font-medium">
										Fan 2
									</label>
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="turnHumidifierOn"
										checked={turnHumidifierOn === 1}
										onChange={(e) =>
											setTurnHumidifierOn(e.target.checked ? 1 : 0)
										}
										disabled={isSaving}
										className="h-4 w-4 rounded border-gray-300"
									/>
									<label
										htmlFor="turnHumidifierOn"
										className="text-sm font-medium"
									>
										Humidifier
									</label>
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="turnDehumidifierOn"
										checked={turnDehumidifierOn === 1}
										onChange={(e) =>
											setTurnDehumidifierOn(e.target.checked ? 1 : 0)
										}
										disabled={isSaving}
										className="h-4 w-4 rounded border-gray-300"
									/>
									<label
										htmlFor="turnDehumidifierOn"
										className="text-sm font-medium"
									>
										Dehumidifier
									</label>
								</div>
							</div>
						</div>

						{/* Section 4: Cycle Management */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Cycle Management</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label htmlFor="maxCycles" className="text-sm font-medium">
										Max Cycles
									</label>
									<Input
										id="maxCycles"
										type="number"
										min="0"
										step="1"
										value={maxCycles}
										onChange={(e) => setMaxCycles(Number(e.target.value))}
										disabled={isSaving}
										required
									/>
								</div>

								<div className="space-y-2">
									<label htmlFor="cycles" className="text-sm font-medium">
										Current Cycles
									</label>
									<Input
										id="cycles"
										type="number"
										min="0"
										step="1"
										value={cycles}
										onChange={(e) => setCycles(Number(e.target.value))}
										disabled={isSaving}
										required
									/>
								</div>
							</div>
						</div>

						{/* Form Actions */}
						<div className="flex gap-2 pt-4">
							<Button type="submit" disabled={isSaving}>
								{isSaving ? "Creating..." : "Create Custom Action"}
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
