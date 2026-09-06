import { request } from "./http";
import type { Page } from "../types/api";
import type {
	IndustryRead,
	RoleRead,
	SkillRead,
	ToolRead,
	MasterListOptions,
} from "../types/master";

export const masterApi = {
	industries: (options: MasterListOptions = {}) => {
		const params = new URLSearchParams();
		if (options.q) params.set("q", options.q);
		if (options.limit !== undefined) params.set("limit", String(options.limit));
		if (options.offset !== undefined) params.set("offset", String(options.offset));
		const qs = params.toString();
		return request<Page<IndustryRead>>(
			`/api/master/industries${qs ? `?${qs}` : ""}`,
			{ auth: true },
		);
	},

	roles: (options: MasterListOptions = {}) => {
		const params = new URLSearchParams();
		if (options.q) params.set("q", options.q);
		if (options.industry_id !== undefined)
			params.set("industry_id", String(options.industry_id));
		if (options.limit !== undefined) params.set("limit", String(options.limit));
		if (options.offset !== undefined) params.set("offset", String(options.offset));
		const qs = params.toString();
		return request<Page<RoleRead>>(`/api/master/roles${qs ? `?${qs}` : ""}`, {
			auth: true,
		});
	},

	skills: (options: MasterListOptions = {}) => {
		const params = new URLSearchParams();
		if (options.q) params.set("q", options.q);
		if (options.category) params.set("category", options.category);
		if (options.market_trend) params.set("market_trend", options.market_trend);
		if (options.limit !== undefined) params.set("limit", String(options.limit));
		if (options.offset !== undefined) params.set("offset", String(options.offset));
		const qs = params.toString();
		return request<Page<SkillRead>>(`/api/master/skills${qs ? `?${qs}` : ""}`, {
			auth: true,
		});
	},

	tools: (options: MasterListOptions = {}) => {
		const params = new URLSearchParams();
		if (options.q) params.set("q", options.q);
		if (options.limit !== undefined) params.set("limit", String(options.limit));
		if (options.offset !== undefined) params.set("offset", String(options.offset));
		const qs = params.toString();
		return request<Page<ToolRead>>(`/api/master/tools${qs ? `?${qs}` : ""}`, {
			auth: true,
		});
	},
};
