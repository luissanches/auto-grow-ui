import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/actions")({
	component: ActionsLayout,
});

function ActionsLayout() {
	return <Outlet />;
}
