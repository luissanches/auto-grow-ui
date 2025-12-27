import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tracking")({
	component: TrackingLayout,
});

function TrackingLayout() {
	return <Outlet />;
}
