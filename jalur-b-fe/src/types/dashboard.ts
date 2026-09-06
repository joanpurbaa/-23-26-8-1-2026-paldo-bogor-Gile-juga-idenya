import type { UserResponse } from "./auth";
import type { EvidenceItemResponse, EvidenceType } from "./evidence";

export interface DashboardProfileSummary {
	full_name: string;
	current_role_name: string;
	industry_name: string;
}

export interface DashboardSkillsSummary {
	total: number;
	rated: number;
}

export interface DashboardEvidenceSummary {
	total: number;
	by_type: Partial<Record<EvidenceType, number>>;
	recent: EvidenceItemResponse[];
}

export interface DashboardFinancialSummary {
	total_assets: string;
	liquid_assets: string;
	monthly_burn: string;
	runway_months: string;
	currency: string;
	latest_saved_at: string | null;
}

export interface DashboardResponse {
	generated_at: string;
	account: UserResponse;
	onboarding_completed: boolean;
	profile: DashboardProfileSummary | null;
	skills: DashboardSkillsSummary;
	evidence: DashboardEvidenceSummary;
	// missions: sengaja diabaikan — bukan bagian dari integrasi saat ini.
	missions: unknown;
	financial: DashboardFinancialSummary | null;
}