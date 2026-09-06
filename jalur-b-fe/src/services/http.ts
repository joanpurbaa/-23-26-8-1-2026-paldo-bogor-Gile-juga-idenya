import { ApiError } from "../types/api";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TOKEN_KEY = "jalurB_access_token";

export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
	localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
	method?: string;
	body?: unknown;
	auth?: boolean;
}

// Caching TTL untuk respons GET — data dipakai beberapa menit sebelum
// di-fetch ulang, jadi halaman tidak perlu menembak API berulang kali.
const GET_CACHE_TTL_MS = 5 * 60 * 1000;
const GET_CACHE_PREFIX = "jb:cache:v1";

interface CacheEntry {
	v: unknown;
	e: number;
}

function cacheKeyFor(path: string): string {
	// Namespace per token agar user yang berbeda tidak membaca data
	// cache milik user lain di browser yang sama.
	const token = getToken() ?? "";
	return `${GET_CACHE_PREFIX}:${token.slice(-8)}:${path}`;
}

function readCached<T>(path: string): T | undefined {
	try {
		const raw = localStorage.getItem(cacheKeyFor(path));
		if (!raw) return undefined;
		const entry = JSON.parse(raw) as CacheEntry;
		if (!entry || typeof entry.e !== "number") return undefined;
		if (Date.now() > entry.e) {
			localStorage.removeItem(cacheKeyFor(path));
			return undefined;
		}
		return entry.v as T;
	} catch {
		return undefined;
	}
}

function writeCached<T>(path: string, value: T): void {
	try {
		localStorage.setItem(
			cacheKeyFor(path),
			JSON.stringify({ v: value, e: Date.now() + GET_CACHE_TTL_MS }),
		);
	} catch {
		// storage penuh / tidak tersedia — gunakan tanpa cache
	}
}

export function clearUserCache(): void {
	try {
		const token = getToken() ?? "";
		const prefix = `${GET_CACHE_PREFIX}:${token.slice(-8)}:`;
		const keys = Object.keys(localStorage);
		for (const key of keys) {
			if (key.startsWith(prefix)) localStorage.removeItem(key);
		}
	} catch {
		// abaikan
	}
}

export async function request<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const { method = "GET", body, auth = false } = options;
	const isGet = method === "GET";

	if (isGet) {
		const cached = readCached<T>(path);
		if (cached !== undefined) return cached;
	}

	const headers: Record<string, string> = {};
	const isFormData =
		typeof FormData !== "undefined" && body instanceof FormData;
	if (body !== undefined && !isFormData)
		headers["Content-Type"] = "application/json";
	if (auth) {
		const token = getToken();
		if (token) headers["Authorization"] = `Bearer ${token}`;
	}

	let response: Response;
	try {
		response = await fetch(`${API_BASE_URL}${path}`, {
			method,
			headers,
			body:
				body !== undefined
					? isFormData
						? body
						: JSON.stringify(body)
					: undefined,
		});
	} catch {
		throw new ApiError(
			"Tidak dapat terhubung ke server. Periksa koneksi internetmu.",
			0,
		);
	}

	if (!response.ok) {
		let message = "Terjadi kesalahan pada server.";
		try {
			const data = await response.json();
			if (data && typeof data.detail === "string") {
				message = data.detail;
			} else if (Array.isArray(data?.detail)) {
				message = data.detail.map((d: { msg: string }) => d.msg).join(", ");
			}
		} catch {
			// ignore non-JSON error body
		}
		throw new ApiError(message, response.status);
	}

	let result: T = undefined as T;
	if (response.status === 204) {
		result = undefined as T;
	} else {
		const contentType = response.headers.get("content-type") ?? "";
		if (contentType.includes("application/json")) {
			result = (await response.json()) as T;
		}
	}

	if (isGet) {
		writeCached(path, result);
	} else {
		// Mutasi sukses → data berubah, buang cache GET agar fetch berikutnya segar
		clearUserCache();
	}

	return result;
}