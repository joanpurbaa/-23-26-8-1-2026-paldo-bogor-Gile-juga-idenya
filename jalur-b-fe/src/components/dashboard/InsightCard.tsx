import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { SecondaryButton } from "../ui/PrimaryButton";
import { careerRiskApi } from "../../services/careerRisk";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerRiskResult } from "../../types/careerRisk";

export default function InsightCard() {
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

	return (
		<div>
			<div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
				<Sparkles size={16} />
				<span>Career Insight</span>
			</div>
			<div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col justify-between h-44">
				{loading ? (
					<div className="space-y-2">
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-11/12" />
						<Skeleton className="h-3 w-3/4" />
					</div>
				) : result && result.analysis ? (
					<p className="text-sm text-neutral/80 leading-relaxed line-clamp-4">
						{result.analysis}
					</p>
				) : (
					<p className="text-sm text-neutral/80 leading-relaxed">
						Belum ada insight. Gunakan tombol "Lengkapi Data Karier" di menu
						samping untuk melihat analisis risiko kariermu.
					</p>
				)}
				<a href="/dashboard/risiko-karier">
					<SecondaryButton>Pelajari kenapa →</SecondaryButton>
				</a>
			</div>
		</div>
	);
}