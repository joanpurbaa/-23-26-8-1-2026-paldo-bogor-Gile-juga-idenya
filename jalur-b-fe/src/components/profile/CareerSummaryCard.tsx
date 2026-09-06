import { useEffect, useState } from "react";
import { AlertTriangle, Sparkles, HeartPulse } from "lucide-react";
import { getScoreStatus, getLevelStatus, normalizeRiskLevel } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import MetricCard from "../dashboard/MetricCard";
import Skeleton from "../ui/Skeleton";
import { careerHealthApi } from "../../services/careerHealth";
import { careerRiskApi } from "../../services/careerRisk";
import { aiExposureApi } from "../../services/aiExposure";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { HealthAssessmentResult } from "../../types/careerHealth";
import type { CareerRiskResult } from "../../types/careerRisk";
import type { AiExposureResult } from "../../types/aiExposure";

function formatDate(value?: string): string {
	if (!value) return "";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(d);
}

export default function CareerSummaryCard() {
	const { refreshKey } = useCareerAssessment();

	const [health, setHealth] = useState<HealthAssessmentResult | null>(null);
	const [risk, setRisk] = useState<CareerRiskResult | null>(null);
	const [exposure, setExposure] = useState<AiExposureResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		const load = async () => {
			const [h, r, e] = await Promise.allSettled([
				careerHealthApi.latest(),
				careerRiskApi.latest(),
				aiExposureApi.latest(),
			]);
			if (!active) return;
			if (h.status === "fulfilled") setHealth(h.value);
			if (r.status === "fulfilled") setRisk(r.value);
			if (e.status === "fulfilled") setExposure(e.value);
			setLoading(false);
		};
		void load();
		return () => {
			active = false;
		};
	}, [refreshKey]);

	if (loading) {
		return (
			<div>
				<div className="bg-primary/5 rounded-xl border border-primary/20 p-6 mb-4">
					<Skeleton className="h-3 w-40 mb-3" />
					<Skeleton className="h-9 w-48 mb-4" />
					<Skeleton className="h-5 w-64" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<Skeleton className="h-32 rounded-2xl" />
					<Skeleton className="h-32 rounded-2xl" />
				</div>
			</div>
		);
	}

	if (!health && !risk && !exposure) {
		return (
			<div className="bg-white rounded-xl border border-neutral/5 shadow-sm p-8 text-center">
				<p className="text-sm text-neutral/60">
					Belum ada data karier. Gunakan tombol "Lengkapi Data Karier" di menu
					samping untuk memulai.
				</p>
			</div>
		);
	}

	const score = health ? Math.round(parseDecimal(health.score)) : 0;
	const status = health ? getScoreStatus(score) : "neutral";
	const assessedDate = health ? formatDate(health.assessed_at) : "";

	const snapshots = [
		{
			title: "Career Risk",
			value: risk ? risk.level : "—",
			variant: risk ? getLevelStatus(normalizeRiskLevel(risk.level)) : "neutral",
			icon: AlertTriangle,
		},
		{
			title: "Skill Relevance",
			value: exposure
				? `${Math.min(100, Math.round(parseDecimal(exposure.skill_relevance_score)))}%`
				: "—",
			variant: exposure
				? getScoreStatus(Math.min(100, Math.round(parseDecimal(exposure.skill_relevance_score))))
				: "neutral",
			icon: Sparkles,
		},
	];

	return (
		<div>
			<div className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex items-center justify-between mb-4">
				<div>
					<div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-3">
						<HeartPulse size={14} />
						<span>Career Health Score</span>
					</div>
					<div className="flex items-baseline gap-3">
						<span className="text-4xl font-extrabold text-neutral">
							{health ? score : "—"}
							{health && (
								<span className="text-lg text-neutral/40 font-normal">/100</span>
							)}
						</span>
						{health && (
							<StatusBadge label={health.status ?? (health.level || "Dipantau")} variant={status} />
						)}
					</div>
				</div>
				<span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-200 shrink-0">
					{assessedDate ? `Dinilai ${assessedDate}` : "Terbaru"}
				</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{snapshots.map((item) => (
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