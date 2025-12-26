import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: DashboardComponent,
});

function DashboardComponent() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Devices</CardTitle>
						<CardDescription>Total active devices</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">-</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Stages</CardTitle>
						<CardDescription>Growth stages</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">-</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Protocols</CardTitle>
						<CardDescription>Active protocols</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">-</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Tracking</CardTitle>
						<CardDescription>Recent measurements</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">-</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
