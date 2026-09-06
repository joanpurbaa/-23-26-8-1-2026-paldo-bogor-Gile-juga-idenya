export type LayoffScenario = "tomorrow" | "one_month" | "three_months";

export interface LayoffSimulationResult {
	id: number;
	scenario: string;
	simulated_at: string;
	career_readiness_score: string;
	financial_readiness_score: string;
	skill_relevance_score: string;
	job_mobility_score: string;
	overall_resilience_score: string;
	financial_runway_months: string;
	target_runway_months: string;
	financial_gap: string;
	evidence_count: number;
	summary: string;
	action_items: Array<Record<string, unknown>>;
	model: string;
	scoring_version: string;
}