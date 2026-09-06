import { request } from "./http";
import { API_BASE_URL } from "./http";
import type {
	UserResponse,
	AuthTokenResponse,
	LoginRequest,
	RegisterRequest,
} from "../types/auth";
import type { MessageResponse } from "../types/api";

export const authApi = {
	register: (payload: RegisterRequest) =>
		request<AuthTokenResponse>("/api/auth/register", {
			method: "POST",
			body: payload,
		}),

	login: (payload: LoginRequest) =>
		request<AuthTokenResponse>("/api/auth/login", {
			method: "POST",
			body: payload,
		}),

	me: () => request<UserResponse>("/api/auth/me", { auth: true }),

	logout: () => request<MessageResponse>("/api/auth/logout", { auth: true }),

	googleStart: (returnTo?: string) => {
		const url = new URL(`${API_BASE_URL}/api/auth/google/start`);
		if (returnTo) url.searchParams.set("return_to", returnTo);
		return url.toString();
	},

	googleExchange: (payload: { code: string }) =>
		request<AuthTokenResponse>("/api/auth/google/exchange", {
			method: "POST",
			body: payload,
		}),
};
