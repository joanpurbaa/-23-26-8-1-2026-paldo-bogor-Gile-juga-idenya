import type { Page } from "./api";

export type EvidenceType =
	| "project"
	| "achievement"
	| "feedback"
	| "certificate"
	| "award"
	| "training"
	| "other";

export interface EvidenceItemResponse {
	id: number;
	user_id: number;
	evidence_type: EvidenceType;
	title: string;
	user_role: string;
	description: string;
	impact: string;
	evidence_date: string | null;
	attachment_url: string | null;
	ai_generated: boolean;
	created_at: string;
}

export interface EvidenceItemCreate {
	evidence_type: EvidenceType;
	title: string;
	user_role: string;
	description: string;
	impact: string;
	evidence_date?: string | null;
	ai_generated?: boolean;
}

export type EvidenceItemUpdate = Partial<{
	evidence_type: EvidenceType | null;
	title: string | null;
	user_role: string | null;
	description: string | null;
	impact: string | null;
	evidence_date: string | null;
}>;

export interface EvidenceStatsResponse {
	total: number;
	by_type: Partial<Record<EvidenceType, number>>;
	human_authored: number;
	ai_generated: number;
}

export interface EvidenceListOptions {
	evidence_type?: EvidenceType;
	q?: string;
	date_from?: string;
	date_to?: string;
	limit?: number;
	offset?: number;
}

export type EvidencePage = Page<EvidenceItemResponse>;