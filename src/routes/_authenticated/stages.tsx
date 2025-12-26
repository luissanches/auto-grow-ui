import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiClient, type Stage } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

	const loadStages = async () => {
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
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this stage?")) {
			return;
		}
		try {
			await apiClient.deleteStage(id.toString());
			loadStages();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete stage");
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Stages</CardTitle>
						<Button>Add Stage</Button>
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
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{stages.map((stage) => (
									<TableRow key={stage.id}>
										<TableCell>{stage.id}</TableCell>
										<TableCell>{stage.name}</TableCell>
										<TableCell>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleDelete(stage.id)}
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
