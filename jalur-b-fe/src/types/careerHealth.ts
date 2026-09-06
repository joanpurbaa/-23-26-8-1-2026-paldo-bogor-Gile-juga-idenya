export interface CareerAssessmentRequest {
	role_name: string;
	industry_name: string;
	work_duration_months: number;
	responsibilities: string;
	achievements: string;
	performance_feedback: string;
	career_progression: string;
	job_description: string;
	tools_and_methods: string;
}

export interface HealthFactor {
	key: string;
	title: string;
	score: string;
	level: string;
	explanation: string;
}

export interface HealthAssessmentResult {
	id: number;
	assessed_at: string;
	score: string;
	level: string;
	status: string;
	summary: string;
	data_confidence: string;
	factors: HealthFactor[];
	model: string;
	scoring_version: string;
	market_baseline_version: string;
}