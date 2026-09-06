import { request } from "./http";
import { ApiError } from "../types/api";
import type { Page } from "../types/api";
import type {
	FinancialSummaryResponse,
	FinancialProfileCreate,
	FinancialProfileResponse,
	FinancialAssetResponse,
	FinancialAssetCreate,
	FinancialAssetUpdate,
	FinancialRunwayPreview,
	RunwayCalculationResponse,
} from "../types/financial";

export function parseRunwayMonths(payload: {
	financial_runway_months: string;
	target_runway_months: string;
}): { current: number; target: number } {
	const current = Number(payload.financial_runway_months);
	const target = Number(payload.target_runway_months);
	return {
		current: Number.isFinite(current) ? current : 0,
		target: Number.isFinite(target) ? target : 0,
	};
}

export const runwayApi = {
	preview: () =>
		request<FinancialRunwayPreview>("/api/financial/runway", { auth: true }),

	save: () =>
		request<RunwayCalculationResponse>("/api/financial/runway", {
			method: "POST",
			auth: true,
		}),

	latest: () =>
		request<RunwayCalculationResponse>("/api/financial/runway/latest", {
			auth: true,
		}),

	history: (options: { limit?: number; offset?: number } = {}) => {
		const params = new URLSearchParams();
		if (options.limit !== undefined)
			params.set("limit", String(options.limit));
		if (options.offset !== undefined)
			params.set("offset", String(options.offset));
		const qs = params.toString();
		return request<Page<RunwayCalculationResponse>>(
			`/api/financial/runway/history${qs ? `?${qs}` : ""}`,
			{ auth: true },
		);
	},
};

export const financialApi = {
	get: () =>
		request<FinancialSummaryResponse>("/api/financial", { auth: true }),

	getOrCreate: async () => {
		try {
			return await financialApi.get();
		} catch (err) {
			if (err instanceof ApiError && err.status === 404) {
				await financialApi.upsertProfile({
					monthly_essential_expenses: 1,
					monthly_debt_payment: 0,
					dependents: 0,
					currency: "IDR",
				});
				return financialApi.get();
			}
			throw err;
		}
	},

	upsertProfile: (payload: FinancialProfileCreate) =>
		request<FinancialProfileResponse>("/api/financial", {
			method: "PUT",
			body: payload,
			auth: true,
		}),

	listAssets: () =>
		request<FinancialAssetResponse[]>("/api/financial/assets", { auth: true }),

	createAsset: (payload: FinancialAssetCreate) =>
		request<FinancialAssetResponse>("/api/financial/assets", {
			method: "POST",
			body: payload,
			auth: true,
		}),

	updateAsset: (id: number, payload: FinancialAssetUpdate) =>
		request<FinancialAssetResponse>(`/api/financial/assets/${id}`, {
			method: "PATCH",
			body: payload,
			auth: true,
		}),

	deleteAsset: (id: number) =>
		request<void>(`/api/financial/assets/${id}`, {
			method: "DELETE",
			auth: true,
		}),
};
