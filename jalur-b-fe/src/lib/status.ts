export type StatusVariant =
	| "healthy"
	| "warning"
	| "risk"
	| "insight"
	| "neutral";

export const statusStyles: Record<
	StatusVariant,
	{ text: string; bg: string; border: string; bar: string; iconBg: string }
> = {
	healthy: {
		text: "text-emerald-600",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
		bar: "bg-emerald-500",
		iconBg: "bg-emerald-50",
	},
	warning: {
		text: "text-amber-600",
		bg: "bg-amber-50",
		border: "border-amber-200",
		bar: "bg-amber-500",
		iconBg: "bg-amber-50",
	},
	risk: {
		text: "text-rose-600",
		bg: "bg-rose-50",
		border: "border-rose-200",
		bar: "bg-rose-500",
		iconBg: "bg-rose-50",
	},
	insight: {
		text: "text-primary",
		bg: "bg-primary/5",
		border: "border-primary/20",
		bar: "bg-primary",
		iconBg: "bg-primary/10",
	},
	neutral: {
		text: "text-neutral/60",
		bg: "bg-neutral/5",
		border: "border-neutral/10",
		bar: "bg-neutral/40",
		iconBg: "bg-neutral/10",
	},
};

export function getScoreStatus(score: number): StatusVariant {
	if (score >= 75) return "healthy";
	if (score >= 60) return "warning";
	return "risk";
}

export type RiskLevel = "Rendah" | "Sedang" | "Tinggi";

export function normalizeRiskLevel(
	value: string | null | undefined,
): RiskLevel {
	const v = (value ?? "").toLowerCase();
	if (v.includes("rendah") || v.includes("low")) return "Rendah";
	if (v.includes("tinggi") || v.includes("high")) return "Tinggi";
	return "Sedang";
}

export function getLevelStatus(level: RiskLevel): StatusVariant {
	if (level === "Rendah") return "healthy";
	if (level === "Sedang") return "warning";
	return "risk";
}

export type FinanceTone = "indigo" | "violet" | "rose" | "amber" | "slate";

export const financeToneStyles: Record<
	FinanceTone,
	{ iconBg: string; iconText: string }
> = {
	indigo: { iconBg: "bg-indigo-50", iconText: "text-indigo-600" },
	violet: { iconBg: "bg-violet-50", iconText: "text-violet-600" },
	rose: { iconBg: "bg-rose-50", iconText: "text-rose-600" },
	amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
	slate: { iconBg: "bg-slate-100", iconText: "text-slate-600" },
};
