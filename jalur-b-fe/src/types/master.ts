export interface IndustryRead {
	id: number;
	name: string;
}

export interface RoleRead {
	id: number;
	industry_id: number;
	name: string;
	description: string | null;
	ai_automation_risk_score?: string | null;
}

export interface SkillRead {
	id: number;
	name: string;
	category: string | null;
	market_trend: string;
}

export interface ToolRead {
	id: number;
	name: string;
}

export interface MasterListOptions {
	q?: string;
	limit?: number;
	offset?: number;
	industry_id?: number;
	category?: string;
	market_trend?: string;
}
