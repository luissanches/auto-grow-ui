import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { apiClient, type Stage } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/stages")({
	component: StagesComponent,
});

function StagesComponent() {
	const [stages, setStages] = useState<Stage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadStages();
	}, []);

	const loadStages = useEffectEvent(async () => {
		try {
			setIsLoading(true);
			const data = await apiClient.getStages();
			setStages(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load stages");
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Stages</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading && <p>Loading...</p>}
					{error && <p className="text-destructive">{error}</p>}
					{!isLoading && !error && stages.length === 0 && (
						<p className="text-muted-foreground">No stages found</p>
					)}
					{!isLoading && !error && stages.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{stages.map((stage) => (
									<TableRow key={stage.id}>
										<TableCell>{stage.id}</TableCell>
										<TableCell>{stage.name}</TableCell>
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
