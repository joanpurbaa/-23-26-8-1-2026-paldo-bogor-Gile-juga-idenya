import type { UserResponse } from "../types/auth";
import { clearToken, getToken, clearUserCache } from "../services/http";

const USER_KEY = "jalurB_user";
export const ONBOARDING_KEY = "jalurB_onboarding";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function getStoredUser(): UserResponse | null {
	const raw = localStorage.getItem(USER_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as UserResponse;
	} catch {
		return null;
	}
}

export function setStoredUser(user: UserResponse): void {
	localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated(): boolean {
	return Boolean(getToken());
}

/**
 * Onboarding completion is account-owned data persisted in localStorage.
 * It is set only when the user finishes onboarding, and is NOT cleared on logout.
 */
export function isOnboardingComplete(): boolean {
	return Boolean(localStorage.getItem(ONBOARDING_KEY));
}

/** Marks onboarding as complete in the local store. Keeps existing stored data. */
export function setOnboardingComplete(): void {
	if (!localStorage.getItem(ONBOARDING_KEY)) {
		localStorage.setItem(ONBOARDING_KEY, "true");
	}
}

/** Clears the local onboarding marker. */
export function clearOnboardingComplete(): void {
	localStorage.removeItem(ONBOARDING_KEY);
}

/**
 * Clear only authentication/session data.
 * Onboarding data is intentionally KEPT (it belongs to the account, not the session).
 */
export function clearAuth(): void {
	clearToken();
	clearUserCache();
	localStorage.removeItem(USER_KEY);
}
