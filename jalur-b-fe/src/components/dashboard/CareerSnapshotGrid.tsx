import { useEffect, useState } from "react";
import { AlertTriangle, GitFork, Sparkles, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MetricCard from "./MetricCard";
import Skeleton from "../ui/Skeleton";
import { dashboardApi } from "../../services/dashboard";
import { careerRiskApi } from "../../services/careerRisk";
import { careerPivotApi } from "../../services/careerPivot";
import { aiExposureApi } from "../../services/aiExposure";
import { parseDecimal } from "../../lib/parseNumeric";
import {
	getLevelStatus,
	normalizeRiskLevel,
	type RiskLevel,
	type StatusVariant,
} from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";

interface SnapshotData {
	riskLevel: RiskLevel | null;
	skillProgress: number | null;
	runwayMonths: number | null;
	pivotMatch: number | null;
}

export default function CareerSnapshotGrid() {
	const { refreshKey } = useCareerAssessment();

	const [data, setData] = useState<SnapshotData>({
		riskLevel: null,
		skillProgress: null,
		runwayMonths: null,
		pivotMatch: null,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		const load = async () => {
			const [dashResult, riskResult, pivotResult, exposureResult] =
				await Promise.allSettled([
					dashboardApi.get(),
					careerRiskApi.latest(),
					careerPivotApi.latest(),
					aiExposureApi.latest(),
				]);
			if (!active) return;

			const next: SnapshotData = {
				riskLevel: null,
				skillProgress: null,
				runwayMonths: null,
				pivotMatch: null,
			};

			if (riskResult.status === "fulfilled") {
				next.riskLevel = normalizeRiskLevel(riskResult.value.level);
			}

			if (pivotResult.status === "fulfilled" && pivotResult.value.roles.length > 0) {
				next.pivotMatch = Math.round(
					parseDecimal(pivotResult.value.roles[0].match_score),
				);
			}

			if (exposureResult.status === "fulfilled") {
				next.skillProgress = Math.max(
					0,
					Math.min(
						100,
						Math.round(parseDecimal(exposureResult.value.skill_relevance_score)),
					),
				);
			}

			if (dashResult.status === "fulfilled") {
				const { financial } = dashResult.value;
				if (financial) {
					next.runwayMonths = parseDecimal(financial.runway_months);
				}
			}

			setData(next);
			setLoading(false);
		};
		void load();
		return () => {
			active = false;
		};
	}, [refreshKey]);

	const runwayVariant: StatusVariant =
		data.runwayMonths == null
			? "neutral"
			: data.runwayMonths >= 12
				? "healthy"
				: data.runwayMonths >= 6
					? "warning"
					: "risk";

	const runwayValue =
		data.runwayMonths != null
			? data.runwayMonths % 1 === 0
				? `${Math.round(data.runwayMonths)} bulan`
				: `${data.runwayMonths.toFixed(1)} bulan`
			: "—";

	const pivotVariant: StatusVariant =
		data.pivotMatch == null
			? "neutral"
			: data.pivotMatch >= 70
				? "healthy"
				: data.pivotMatch >= 40
					? "warning"
					: "risk";

	if (loading) {
		return (
			<div className="mb-8">
				<h3 className="text-sm font-bold text-neutral mb-3">Career Snapshot</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
					{[0, 1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-5 h-32 flex flex-col justify-between">
							<Skeleton className="h-9 w-9 rounded-xl" />
							<div>
								<Skeleton className="h-3 w-24 mb-2" />
								<Skeleton className="h-5 w-20" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	const cards: {
		title: string;
		value: string;
		icon: LucideIcon;
		variant: StatusVariant;
	}[] = [
		{
			title: "Career Risk",
			value: data.riskLevel ?? "—",
			icon: AlertTriangle,
			variant: data.riskLevel ? getLevelStatus(data.riskLevel) : "neutral",
		},
		{
			title: "Skill Relevance",
			value: data.skillProgress != null ? `${data.skillProgress}%` : "—",
			icon: Sparkles,
			variant: data.skillProgress != null ? "healthy" : "neutral",
		},
		{
			title: "Career Pivot",
			value: data.pivotMatch != null ? `${data.pivotMatch}%` : "—",
			icon: GitFork,
			variant: pivotVariant,
		},
		{
			title: "Financial Runway",
			value: runwayValue,
			icon: Wallet,
			variant: runwayVariant,
		},
	];

	return (
		<div className="mb-8">
			<h3 className="text-sm font-bold text-neutral mb-3">Career Snapshot</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
				{cards.map((item) => (
					<MetricCard
						key={item.title}
						label={item.title}
						value={item.value}
						icon={item.icon}
						variant={item.variant}
					/>
				))}
			</div>
		</div>
	);
}