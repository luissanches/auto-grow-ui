import { apiClient } from "@/lib/api";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface AuthContextType {
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const hasCredentials = apiClient.loadCredentials();
		setIsAuthenticated(hasCredentials);
		setIsLoading(false);
	}, []);

	const login = async (username: string, password: string) => {
		const success = await apiClient.login(username, password);
		setIsAuthenticated(success);
		return success;
	};

	const logout = () => {
		apiClient.clearCredentials();
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
