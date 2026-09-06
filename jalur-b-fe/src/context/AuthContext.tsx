import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { authApi } from "../services/auth";
import { onboardingApi } from "../services/onboarding";
import { getToken, setToken } from "../services/http";
import type { AuthTokenResponse, UserResponse } from "../types/auth";
import {
	type AuthStatus,
	clearAuth,
	clearOnboardingComplete,
	getStoredUser,
	isOnboardingComplete as storedOnboardingComplete,
	setOnboardingComplete,
	setStoredUser,
} from "../lib/auth";

interface AuthContextValue {
	status: AuthStatus;
	user: UserResponse | null;
	login: (email: string, password: string) => Promise<AuthTokenResponse>;
	register: (data: {
		username: string;
		email: string;
		password: string;
	}) => Promise<AuthTokenResponse>;
	logout: () => Promise<void>;
	isOnboardingComplete: () => boolean;
	completeGoogle: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [status, setStatus] = useState<AuthStatus>("loading");
	const [user, setUser] = useState<UserResponse | null>(null);
	const [onboardingDone, setOnboardingDone] = useState(false);

	const loadOnboarding = useCallback(async () => {
		try {
			const res = await onboardingApi.get();
			if (res.completed) {
				setOnboardingComplete();
				setOnboardingDone(true);
			} else {
				clearOnboardingComplete();
				setOnboardingDone(false);
			}
		} catch {
			clearOnboardingComplete();
			setOnboardingDone(false);
		}
	}, []);

	useEffect(() => {
		let active = true;

		const initialize = async () => {
			// Restore from stored token if present. Do NOT redirect to /login while loading.
			if (!getToken()) {
				if (active) setStatus("unauthenticated");
				return;
			}

			const cached = getStoredUser();
			if (cached && active) setUser(cached);

			try {
				const me = await authApi.me();
				if (!active) return;
				setStoredUser(me);
				setUser(me);
				await loadOnboarding();
				if (!active) return;
				setStatus("authenticated");
			} catch {
				if (!active) return;
				// token invalid/expired -> clear session
				clearAuth();
				setUser(null);
				setStatus("unauthenticated");
			}
		};

		initialize();
		return () => {
			active = false;
		};
	}, [loadOnboarding]);

	const applySession = useCallback(
		async (res: AuthTokenResponse) => {
			setToken(res.access_token);
			setStoredUser(res.user);
			setUser(res.user);
			await loadOnboarding();
			setStatus("authenticated");
		},
		[loadOnboarding],
	);

	const login = useCallback(
		async (email: string, password: string) => {
			const res = await authApi.login({ email, password });
			await applySession(res);
			return res;
		},
		[applySession],
	);

	const register = useCallback(
		async (data: { username: string; email: string; password: string }) => {
			const res = await authApi.register(data);
			await applySession(res);
			return res;
		},
		[applySession],
	);

	const completeGoogle = useCallback(
		async (code: string) => {
			console.log("[AUTH] Google callback received");
			console.log("[AUTH] Google exchange started");
			const res = await authApi.googleExchange({ code });
			console.log("[AUTH] Google exchange success");
			await applySession(res);
			console.log("[AUTH] access token received");
		},
		[applySession],
	);

	const logout = useCallback(async () => {
		try {
			await authApi.logout();
		} catch {
			// tetap clear session dari sisi client meskipun request logout gagal
		}
		clearAuth();
		setUser(null);
		setStatus("unauthenticated");
	}, []);

	const checkOnboardingComplete = useCallback(
		() => onboardingDone || storedOnboardingComplete(),
		[onboardingDone],
	);

	const value = useMemo<AuthContextValue>(
		() => ({
			status,
			user,
			login,
			register,
			logout,
			isOnboardingComplete: checkOnboardingComplete,
			completeGoogle,
		}),
		[
			status,
			user,
			login,
			register,
			logout,
			checkOnboardingComplete,
			completeGoogle,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return ctx;
}
