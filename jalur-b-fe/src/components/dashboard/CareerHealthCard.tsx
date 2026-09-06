import { useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import StatusBadge from "../ui/StatusBadge";
import { careerHealthApi } from "../../services/careerHealth";
import { parseDecimal } from "../../lib/parseNumeric";
import { getScoreStatus } from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { HealthAssessmentResult } from "../../types/careerHealth";

export default function CareerHealthCard() {
	const { refreshKey } = useCareerAssessment();

	const [result, setResult] = useState<HealthAssessmentResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		careerHealthApi
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

	const score = result ? Math.round(parseDecimal(result.score)) : 0;
	const statusVariant = getScoreStatus(score);

	return (
		<div className="bg-white rounded-3xl p-6 border border-neutral/5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
					<HeartPulse size={18} />
					<span>Career Health</span>
				</div>

				{loading ? (
					<div className="flex items-center gap-4">
						<Skeleton className="h-10 w-32" />
						<Skeleton className="h-6 w-24 rounded-full" />
					</div>
				) : result ? (
					<>
						<div className="flex items-baseline gap-3">
							<span className="text-4xl font-extrabold text-neutral">
								{score}
								<span className="text-lg text-neutral/40 font-normal">/100</span>
							</span>
							<StatusBadge label={result.status} variant={statusVariant} />
						</div>
						<p className="text-xs text-neutral/50 mt-2 font-medium line-clamp-2">
							{result.summary}
						</p>
					</>
				) : (
					<>
						<div className="flex items-baseline gap-3">
							<span className="text-4xl font-extrabold text-neutral/30">
								—
								<span className="text-lg text-neutral/30 font-normal">/100</span>
							</span>
						</div>
						<p className="text-xs text-neutral/50 mt-2 font-medium">
							Belum ada penilaian. Gunakan tombol "Lengkapi Data Karier" di menu
							samping untuk melihat skor kesehatanmu.
						</p>
					</>
				)}
			</div>

			<a
				href="/dashboard/kesehatan-karier"
				className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 transition shadow-sm self-end sm:self-auto shrink-0">
				Lihat Analisis
			</a>
		</div>
	);
}