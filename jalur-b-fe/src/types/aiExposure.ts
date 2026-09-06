export interface AiExposureActivity {
	key: string;
	title: string;
	score: string;
	level: string;
	explanation: string;
}

export interface AiExposureResult {
	id: number;
	assessed_at: string;
	score: string;
	level: string;
	skill_relevance_score: string;
	summary: string;
	data_confidence: string;
	activities: AiExposureActivity[];
	strong_skills: string[];
	rising_skills: string[];
	skills_to_improve: string[];
	model: string;
	scoring_version: string;
	market_baseline_version: string;
}