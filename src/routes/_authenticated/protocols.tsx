import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiClient, type Protocol } from "@/lib/api";
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

export const Route = createFileRoute("/_authenticated/protocols")({
	component: ProtocolsComponent,
});

function ProtocolsComponent() {
	const [protocols, setProtocols] = useState<Protocol[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadProtocols();
	}, []);

	const loadProtocols = async () => {
		try {
			setIsLoading(true);
			const data = await apiClient.getProtocols();
			setProtocols(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load protocols");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this protocol?")) {
			return;
		}
		try {
			await apiClient.deleteProtocol(id.toString());
			loadProtocols();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete protocol",
			);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Protocols</CardTitle>
						<Button>Add Protocol</Button>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading && <p>Loading...</p>}
					{error && <p className="text-destructive">{error}</p>}
					{!isLoading && !error && protocols.length === 0 && (
						<p className="text-muted-foreground">No protocols found</p>
					)}
					{!isLoading && !error && protocols.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Stage ID</TableHead>
									<TableHead>Delay</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{protocols.map((protocol) => (
									<TableRow key={protocol.id}>
										<TableCell>{protocol.id}</TableCell>
										<TableCell>{protocol.name}</TableCell>
										<TableCell>{protocol.stageId}</TableCell>
										<TableCell>{protocol.delay}</TableCell>
										<TableCell>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleDelete(protocol.id)}
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
