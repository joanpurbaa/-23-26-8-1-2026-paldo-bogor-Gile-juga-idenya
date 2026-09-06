import { useEffect, useState } from "react";
import { getLevelStatus, normalizeRiskLevel, statusStyles } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import Skeleton from "../ui/Skeleton";
import { careerRiskApi } from "../../services/careerRisk";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerRiskResult } from "../../types/careerRisk";

interface RiskSummaryCardProps {
	onSeeMore: () => void;
}

export default function RiskSummaryCard({ onSeeMore }: RiskSummaryCardProps) {
	const { refreshKey } = useCareerAssessment();
	const [result, setResult] = useState<CareerRiskResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		careerRiskApi
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
				<div className="flex items-center gap-3 mb-4">
					<Skeleton className="h-6 w-20 rounded-full" />
					<Skeleton className="h-3 flex-1" />
				</div>
				<Skeleton className="h-3 w-full mb-2" />
				<Skeleton className="h-3 w-2/3 mb-4" />
				<div className="divide-y divide-neutral/10 border-t border-neutral/10">
					{[0, 1, 2].map((i) => (
						<div key={i} className="flex items-center justify-between py-3">
							<Skeleton className="h-3 w-32" />
							<Skeleton className="h-3 w-16" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!result) {
		return (
			<div className="text-center py-6">
				<p className="text-sm text-neutral/60 mb-4">
					Belum ada penilaian risiko karier.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="text-xs font-semibold text-primary hover:opacity-70 transition">
					Lihat Analisis Risiko →
				</button>
			</div>
		);
	}

	const overallVariant = getLevelStatus(normalizeRiskLevel(result.level));

	return (
		<div>
			<div className="flex items-center gap-3 mb-4">
				<StatusBadge label={result.level} variant={overallVariant} />
				<p className="text-xs text-neutral/50 leading-relaxed">
					{result.summary}
				</p>
			</div>

			<div className="divide-y divide-neutral/10 border-t border-neutral/10">
				{result.factors.slice(0, 4).map((item) => {
					const variant = getLevelStatus(normalizeRiskLevel(item.level));
					const s = statusStyles[variant];
					return (
						<div key={item.key || item.title} className="flex items-center justify-between py-3">
							<span className="text-sm text-neutral/70">{item.title}</span>
							<span className={`text-sm font-semibold ${s.text}`}>{item.level}</span>
						</div>
					);
				})}
			</div>


			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition mt-4">
				Lihat Analisis Risiko →
			</button>
		</div>
	);
}