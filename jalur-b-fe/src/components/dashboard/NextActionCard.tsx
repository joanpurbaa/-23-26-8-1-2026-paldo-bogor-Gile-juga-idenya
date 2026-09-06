import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { aiExposureApi } from "../../services/aiExposure";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { AiExposureResult } from "../../types/aiExposure";

export default function NextActionCard() {
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

	const skillToImprove = result?.skills_to_improve[0] ?? null;

	return (
		<div>
			<h3 className="text-sm font-bold text-neutral mb-3">Langkah Berikutnya</h3>
			<div className="bg-white rounded-2xl p-6 border border-neutral/5 shadow-sm flex flex-col justify-between h-44">
				{loading ? (
					<div className="space-y-2">
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-10/12" />
					</div>
				) : skillToImprove ? (
					<p className="text-sm text-neutral/80 leading-relaxed">
						Fokuskan latihan pada skill yang perlu diperkuat:{" "}
						<strong className="text-neutral">"{skillToImprove}"</strong>.
					</p>
				) : (
					<p className="text-sm text-neutral/80 leading-relaxed">
						Belum ada rekomendasi langkah. Gunakan tombol "Lengkapi Data
						Karier" di menu samping untuk mengetahui skill yang perlu kamu
						perkuat.
					</p>
				)}
				<a href="/dashboard/skill" className="self-start">
					<button
						type="button"
						className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all">
						Eksplorasi di Skill & AI
						<ArrowRight size={14} />
					</button>
				</a>
			</div>
		</div>
	);
}