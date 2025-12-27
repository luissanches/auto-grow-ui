import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient, type Protocol, type Stage } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute(
	"/_authenticated/protocols/$protocolId/edit",
)({
	component: EditProtocolComponent,
});

function EditProtocolComponent() {
	const { protocolId } = Route.useParams();
	const navigate = useNavigate();

	const [protocol, setProtocol] = useState<Protocol | null>(null);
	const [stages, setStages] = useState<Stage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const [name, setName] = useState("");
	const [stageId, setStageId] = useState<number | null>(null);
	const [startHour, setStartHour] = useState<number | null>(null);
	const [endHour, setEndHour] = useState<number | null>(null);
	const [idealLightIntensity, setIdealLightIntensity] = useState<
		number | null
	>(null);
	const [idealExausterIntensity, setIdealExausterIntensity] = useState<
		number | null
	>(null);
	const [idealBlowerIntensity, setIdealBlowerIntensity] = useState<
		number | null
	>(null);
	const [idealSoilHumidity, setIdealSoilHumidity] = useState<number | null>(
		null,
	);
	const [idealAirHumidity, setIdealAirHumidity] = useState<number | null>(
		null,
	);
	const [idealTemperature, setIdealTemperature] = useState<number | null>(
		null,
	);
	const [idealCo2, setIdealCo2] = useState<number | null>(null);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const [protocolData, stagesData] = await Promise.all([
				apiClient.getProtocol(protocolId),
				apiClient.getStages(),
			]);

			setProtocol(protocolData);
			setStages(stagesData);
			setName(protocolData.name);
			setStageId(protocolData.stageId);
			setStartHour(protocolData.startHour ?? null);
			setEndHour(protocolData.endHour ?? null);
			setIdealLightIntensity(protocolData.idealLightIntensity ?? null);
			setIdealExausterIntensity(protocolData.idealExausterIntensity ?? null);
			setIdealBlowerIntensity(protocolData.idealBlowerIntensity ?? null);
			setIdealSoilHumidity(protocolData.idealSoilHumidity ?? null);
			setIdealAirHumidity(protocolData.idealAirHumidity ?? null);
			setIdealTemperature(protocolData.idealTemperature ?? null);
			setIdealCo2(protocolData.idealCo2 ?? null);

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
			setError("Protocol name is required");
			return;
		}

		if (!stageId) {
			setError("Stage is required");
			return;
		}

		try {
			setIsSaving(true);
			setError(null);

			await apiClient.updateProtocol(protocolId, {
				name: name.trim(),
				stageId,
				startHour: startHour ?? undefined,
				endHour: endHour ?? undefined,
				idealLightIntensity: idealLightIntensity ?? undefined,
				idealExausterIntensity: idealExausterIntensity ?? undefined,
				idealBlowerIntensity: idealBlowerIntensity ?? undefined,
				idealSoilHumidity: idealSoilHumidity ?? undefined,
				idealAirHumidity: idealAirHumidity ?? undefined,
				idealTemperature: idealTemperature ?? undefined,
				idealCo2: idealCo2 ?? undefined,
			});

			navigate({ to: "/protocols" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update protocol");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		navigate({ to: "/protocols" });
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

	if (error && !protocol) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<p className="text-destructive">{error}</p>
						<Button onClick={handleCancel} className="mt-4">
							Back to Protocols
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
					<CardTitle>Edit Protocol</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSave} className="space-y-4">
						{error && <p className="text-destructive">{error}</p>}

						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								Protocol Name
							</label>
							<Input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter protocol name"
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
								required
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="">Select a stage</option>
								{stages.map((stage) => (
									<option key={stage.id} value={stage.id}>
										{stage.name}
									</option>
								))}
							</select>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="startHour" className="text-sm font-medium">
									Start Hour
								</label>
								<Input
									id="startHour"
									type="number"
									min="0"
									max="23"
									value={startHour ?? ""}
									onChange={(e) =>
										setStartHour(e.target.value ? Number(e.target.value) : null)
									}
									placeholder="0-23"
									disabled={isSaving}
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="endHour" className="text-sm font-medium">
									End Hour
								</label>
								<Input
									id="endHour"
									type="number"
									min="0"
									max="23"
									value={endHour ?? ""}
									onChange={(e) =>
										setEndHour(e.target.value ? Number(e.target.value) : null)
									}
									placeholder="0-23"
									disabled={isSaving}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label
									htmlFor="idealLightIntensity"
									className="text-sm font-medium"
								>
									Ideal Light Intensity
								</label>
								<Input
									id="idealLightIntensity"
									type="number"
									min="0"
									step="0.1"
									value={idealLightIntensity ?? ""}
									onChange={(e) =>
										setIdealLightIntensity(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									placeholder="Enter light intensity"
									disabled={isSaving}
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="idealExausterIntensity"
									className="text-sm font-medium"
								>
									Ideal Exauster Intensity
								</label>
								<Input
									id="idealExausterIntensity"
									type="number"
									min="0"
									step="0.1"
									value={idealExausterIntensity ?? ""}
									onChange={(e) =>
										setIdealExausterIntensity(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									placeholder="Enter exauster intensity"
									disabled={isSaving}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label
									htmlFor="idealBlowerIntensity"
									className="text-sm font-medium"
								>
									Ideal Blower Intensity
								</label>
								<Input
									id="idealBlowerIntensity"
									type="number"
									min="0"
									step="0.1"
									value={idealBlowerIntensity ?? ""}
									onChange={(e) =>
										setIdealBlowerIntensity(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									placeholder="Enter blower intensity"
									disabled={isSaving}
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="idealSoilHumidity"
									className="text-sm font-medium"
								>
									Ideal Soil Humidity (%)
								</label>
								<Input
									id="idealSoilHumidity"
									type="number"
									min="0"
									max="100"
									step="0.1"
									value={idealSoilHumidity ?? ""}
									onChange={(e) =>
										setIdealSoilHumidity(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									placeholder="0-100"
									disabled={isSaving}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label
									htmlFor="idealAirHumidity"
									className="text-sm font-medium"
								>
									Ideal Air Humidity (%)
								</label>
								<Input
									id="idealAirHumidity"
									type="number"
									min="0"
									max="100"
									step="0.1"
									value={idealAirHumidity ?? ""}
									onChange={(e) =>
										setIdealAirHumidity(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									placeholder="0-100"
									disabled={isSaving}
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="idealTemperature"
									className="text-sm font-medium"
								>
									Ideal Temperature (°C)
								</label>
								<Input
									id="idealTemperature"
									type="number"
									step="0.1"
									value={idealTemperature ?? ""}
									onChange={(e) =>
										setIdealTemperature(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									placeholder="Enter temperature"
									disabled={isSaving}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label htmlFor="idealCo2" className="text-sm font-medium">
								Ideal CO2 (ppm)
							</label>
							<Input
								id="idealCo2"
								type="number"
								min="0"
								step="1"
								value={idealCo2 ?? ""}
								onChange={(e) =>
									setIdealCo2(e.target.value ? Number(e.target.value) : null)
								}
								placeholder="Enter CO2 level"
								disabled={isSaving}
							/>
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
