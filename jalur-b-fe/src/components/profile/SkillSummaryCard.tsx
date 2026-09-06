import { useEffect, useState } from "react";
import { Cpu, TrendingUp } from "lucide-react";
import { getScoreStatus } from "../../lib/status";
import MetricCard from "../dashboard/MetricCard";
import ActivityImpactBar from "../ui/ActivityImpactBar";
import SkillPill from "../ui/SkillPill";
import Skeleton from "../ui/Skeleton";
import { aiExposureApi } from "../../services/aiExposure";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { AiExposureResult } from "../../types/aiExposure";

function clampPercent(value: number): number {
	return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeImpactLevel(
	value: string | null | undefined,
): "HIGH" | "MEDIUM" | "LOW" {
	const v = (value ?? "").toLowerCase();
	if (v.includes("high") || v.includes("tinggi")) return "HIGH";
	if (v.includes("low") || v.includes("rendah")) return "LOW";
	return "MEDIUM";
}

interface SkillSummaryCardProps {
	onSeeMore: () => void;
}

export default function SkillSummaryCard({ onSeeMore }: SkillSummaryCardProps) {
	const { refreshKey } = useCareerAssessment();
	const [result, setResult] = useState<AiExposureResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		aiExposureApi
			.latest()
			.then((res) => {
				if (active) setResult(res);
			})
			.catch(() => {
				// belum ada penilaian — biarkan kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [refreshKey]);

	if (loading) {
		return (
			<div>
				<div className="grid grid-cols-2 gap-4 mb-6">
					<Skeleton className="h-32 rounded-2xl" />
					<Skeleton className="h-32 rounded-2xl" />
				</div>
				<div className="space-y-3 mb-6">
					<Skeleton className="h-8 w-full rounded-2xl" />
					<Skeleton className="h-8 w-full rounded-2xl" />
					<Skeleton className="h-8 w-full rounded-2xl" />
				</div>
				<Skeleton className="h-6 w-3/4" />
			</div>
		);
	}

	if (!result) {
		return (
			<div className="text-center py-6">
				<p className="text-sm text-neutral/60 mb-4">
					Belum ada penilaian skill & AI.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="text-xs font-semibold text-primary hover:opacity-70 transition">
					Lihat Analisis Skill →
				</button>
			</div>
		);
	}

	const exposureValue = clampPercent(parseDecimal(result.score));
	const relevance = clampPercent(parseDecimal(result.skill_relevance_score));

	return (
		<div>
			<div className="grid grid-cols-2 gap-4 mb-6">
				<MetricCard
					label="AI Exposure"
					value={`${exposureValue}%`}
					icon={Cpu}
					variant="insight"
				/>
				<MetricCard
					label="Skill Relevance"
					value={`${relevance}%`}
					icon={TrendingUp}
					variant={getScoreStatus(relevance)}
				/>
			</div>

			{(result.strong_skills.length > 0 || result.rising_skills.length > 0) && (
				<div className="flex flex-wrap gap-2 mb-1 mt-5">
					{result.strong_skills.map((skill) => (
						<SkillPill key={skill} label={`Skill Kuat: ${skill}`} />
					))}
					{result.rising_skills.slice(0, 2).map((skill) => (
						<SkillPill key={skill} label={`Naik: ${skill}`} tone="insight" />
					))}
				</div>
			)}

			{result.activities.length > 0 && (
				<div className="space-y-3 mb-6 mt-5">
					{result.activities.slice(0, 3).map((item) => (
						<ActivityImpactBar
							key={item.key || item.title}
							activity={item.title}
							level={normalizeImpactLevel(item.level)}
						/>
					))}
				</div>
			)}

			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition mt-4">
				Lihat Analisis Skill →
			</button>
		</div>
	);
}