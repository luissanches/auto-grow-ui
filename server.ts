const API_PORT = process.env.API_PORT || 3000;
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

if (!AUTH_USERNAME || !AUTH_PASSWORD) {
	console.error("ERROR: AUTH_USERNAME and AUTH_PASSWORD must be set in .env");
	process.exit(1);
}

interface AuthRequest {
	username: string;
	password: string;
}

Bun.serve({
	port: API_PORT,
	development: {
		hmr: false,
		console: true,
	},
	routes: {
		"/api/auth/login": {
			POST: async (req) => {
				try {
					const body = (await req.json()) as AuthRequest;

					if (!body.username || !body.password) {
						return new Response(
							JSON.stringify({ error: "Username and password are required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					if (
						body.username === AUTH_USERNAME &&
						body.password === AUTH_PASSWORD
					) {
						return new Response(
							JSON.stringify({
								success: true,
								message: "Authentication successful",
							}),
							{
								status: 200,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					return new Response(
						JSON.stringify({ error: "Invalid username or password" }),
						{
							status: 401,
							headers: { "Content-Type": "application/json" },
						},
					);
				} catch (error) {
					console.error("Auth error:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
		"/": {
			GET: () => {
				return new Response(
					JSON.stringify({
						message: "Auto-Grow API Server",
						version: "1.0.0",
					}),
					{
						headers: { "Content-Type": "application/json" },
					},
				);
			},
		},
	},
});

console.log(`🚀 API Server running on http://localhost:${API_PORT}`);
console.log(`📝 Auth endpoint: POST http://localhost:${API_PORT}/api/auth/login`);
