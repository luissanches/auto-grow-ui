import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const { isAuthenticated, logout } = useAuth();

	return (
		<div className="min-h-screen flex flex-col">
			{isAuthenticated && (
				<nav className="border-b">
					<div className="container mx-auto px-4 py-3 flex items-center justify-between">
						<div className="flex gap-4">
							<Link
								to="/dashboard"
								className="text-sm font-medium hover:underline"
								activeProps={{ className: "text-primary" }}
							>
								Dashboard
							</Link>
							<Link
								to="/devices"
								className="text-sm font-medium hover:underline"
								activeProps={{ className: "text-primary" }}
							>
								Devices
							</Link>
							<Link
								to="/stages"
								className="text-sm font-medium hover:underline"
								activeProps={{ className: "text-primary" }}
							>
								Stages
							</Link>
							<Link
								to="/protocols"
								className="text-sm font-medium hover:underline"
								activeProps={{ className: "text-primary" }}
							>
								Protocols
							</Link>
							<Link
								to="/tracking"
								className="text-sm font-medium hover:underline"
								activeProps={{ className: "text-primary" }}
							>
								Tracking
							</Link>
							<Link
								to="/actions"
								className="text-sm font-medium hover:underline"
								activeProps={{ className: "text-primary" }}
							>
								Actions
							</Link>
						</div>
						<Button variant="outline" size="sm" onClick={logout}>
							Logout
						</Button>
					</div>
				</nav>
			)}
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
