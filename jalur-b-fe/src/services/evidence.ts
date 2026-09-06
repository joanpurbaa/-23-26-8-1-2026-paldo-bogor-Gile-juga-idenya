import { request } from "./http";
import type { Page } from "../types/api";
import type {
	EvidenceItemResponse,
	EvidenceItemCreate,
	EvidenceItemUpdate,
	EvidenceListOptions,
	EvidenceStatsResponse,
} from "../types/evidence";

function toQueryString(options: EvidenceListOptions): string {
	const params = new URLSearchParams();
	if (options.evidence_type) params.set("evidence_type", options.evidence_type);
	if (options.q) params.set("q", options.q);
	if (options.date_from) params.set("date_from", options.date_from);
	if (options.date_to) params.set("date_to", options.date_to);
	if (options.limit !== undefined) params.set("limit", String(options.limit));
	if (options.offset !== undefined) params.set("offset", String(options.offset));
	const qs = params.toString();
	return qs ? `?${qs}` : "";
}

export const evidenceApi = {
	list: (options: EvidenceListOptions = {}) =>
		request<Page<EvidenceItemResponse>>(
			`/api/evidence${toQueryString(options)}`,
			{ auth: true },
		),

	get: (id: number) =>
		request<EvidenceItemResponse>(`/api/evidence/${id}`, { auth: true }),

	create: (payload: EvidenceItemCreate) =>
		request<EvidenceItemResponse>("/api/evidence", {
			method: "POST",
			body: payload,
			auth: true,
		}),

	update: (id: number, payload: EvidenceItemUpdate) =>
		request<EvidenceItemResponse>(`/api/evidence/${id}`, {
			method: "PATCH",
			body: payload,
			auth: true,
		}),

	remove: (id: number) =>
		request<void>(`/api/evidence/${id}`, {
			method: "DELETE",
			auth: true,
		}),

	uploadAttachment: (id: number, file: File) => {
		const form = new FormData();
		form.append("file", file);
		return request<EvidenceItemResponse>(
			`/api/evidence/${id}/attachment`,
			{
				method: "POST",
				body: form,
				auth: true,
			},
		);
	},

	deleteAttachment: (id: number) =>
		request<void>(`/api/evidence/${id}/attachment`, {
			method: "DELETE",
			auth: true,
		}),

	stats: () =>
		request<EvidenceStatsResponse>("/api/evidence/stats", { auth: true }),
};