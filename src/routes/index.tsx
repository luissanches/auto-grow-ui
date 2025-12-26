import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
	component: IndexComponent,
});

function IndexComponent() {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to="/dashboard" />;
	}

	return <Navigate to="/login" />;
}
