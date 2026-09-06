export interface RiskFactor {
	key: string;
	title: string;
	score: string;
	level: string;
	explanation: string;
}

export interface CareerRiskResult {
	id: number;
	scanned_at: string;
	score: string;
	level: string;
	summary: string;
	analysis: string;
	early_warning: string;
	data_confidence: string;
	factors: RiskFactor[];
	model: string;
	scoring_version: string;
	market_baseline_version: string;
}