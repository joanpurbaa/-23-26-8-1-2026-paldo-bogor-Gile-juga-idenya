export interface CareerPivotRole {
	role_name: string;
	match_score: string;
	preparation_time_months: number;
	preparation_description: string;
	missing_skills: string[];
}

export interface CareerPivotResult {
	id: number;
	analyzed_at: string;
	current_role_name: string;
	summary: string;
	data_confidence: string;
	roles: CareerPivotRole[];
	model: string;
	scoring_version: string;
	market_baseline_version: string;
}