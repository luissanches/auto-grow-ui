import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/devices")({
	component: DevicesLayout,
});

function DevicesLayout() {
	return <Outlet />;
}
