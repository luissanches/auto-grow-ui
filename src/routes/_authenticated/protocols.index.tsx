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
import { apiClient, type Protocol } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/_authenticated/protocols/")({
	component: ProtocolsComponent,
});

function ProtocolsComponent() {
	const navigate = useNavigate();
	const [protocols, setProtocols] = useState<Protocol[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadProtocols();
	}, []);

	const loadProtocols = useEffectEvent(async () => {
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
	});

	const handleEdit = (id: number) => {
		navigate({ to: `/protocols/${id}/edit` });
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Protocols</CardTitle>
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
									<TableHead>Stage</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{protocols.map((protocol) => (
									<TableRow key={protocol.id}>
										<TableCell>{protocol.id}</TableCell>
										<TableCell>{protocol.name}</TableCell>
										<TableCell>{protocol.stage?.name}</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEdit(protocol.id)}
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
