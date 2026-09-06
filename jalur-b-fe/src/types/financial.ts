export type FinancialAssetType =
	| "main_savings"
	| "emergency_fund"
	| "long_term_savings"
	| "investment"
	| "other";

export type LiquidityLevel = "liquid" | "requires_process" | "illiquid";

export interface FinancialProfileResponse {
	id: number;
	user_id: number;
	monthly_essential_expenses: string;
	monthly_debt_payment: string | null;
	dependents: number | null;
	currency: string;
	updated_at: string;
}

export interface FinancialProfileCreate {
	monthly_essential_expenses: number | string;
	monthly_debt_payment: number | string;
	dependents: number;
	currency: string;
}

export interface FinancialAssetResponse {
	id: number;
	user_id: number;
	name: string;
	amount: string;
	asset_type: FinancialAssetType;
	liquidity: LiquidityLevel;
	note: string | null;
	currency: string;
	created_at: string;
	updated_at: string;
}

export interface FinancialAssetCreate {
	name: string;
	amount: number | string;
	asset_type: FinancialAssetType;
	liquidity: LiquidityLevel;
	note?: string | null;
	currency: string;
}

export type FinancialAssetUpdate = Partial<{
	name: string | null;
	amount: number | string | null;
	asset_type: FinancialAssetType | null;
	liquidity: LiquidityLevel | null;
	note: string | null;
	currency: string | null;
}>;

export interface FinancialRunwayPreview {
	total_assets: string;
	liquid_assets: string;
	monthly_burn: string;
	financial_runway_months: string;
	target_runway_months: string;
	runway_gap_months: string;
	currency: string;
}

export interface FinancialSummaryResponse {
	profile: FinancialProfileResponse;
	assets: FinancialAssetResponse[];
	runway: FinancialRunwayPreview;
}

export interface RunwayCalculationResponse {
	id: number;
	user_id: number;
	available_savings_snapshot: string;
	essential_expenses_snapshot: string;
	debt_payment_snapshot: string | null;
	dependents_snapshot: number | null;
	liquid_funds_snapshot: string | null;
	financial_runway_months: string;
	calculated_at: string;
}
