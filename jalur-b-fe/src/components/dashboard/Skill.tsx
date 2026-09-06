import { useEffect, useState } from "react";
import { Cpu, TrendingUp, Settings2, ArrowUp, Wrench } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import FeaturedMetricCard from "./FeaturedMetricCard";
import ActivityImpactPanel from "./ActivityImpactPanel";
import SkillAnalysisCard from "./SkillAnalysisCard";
import Skeleton from "../ui/Skeleton";
import { aiExposureApi } from "../../services/aiExposure";
import { parseDecimal } from "../../lib/parseNumeric";
import { getScoreStatus } from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { AiExposureResult } from "../../types/aiExposure";

function clampPercent(value: number): number {
	return Math.min(100, Math.max(0, Math.round(value)));
}

export default function Skill() {
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

	const score = result ? clampPercent(parseDecimal(result.score)) : 0;
	const relevance = result
		? clampPercent(parseDecimal(result.skill_relevance_score))
		: 0;
	const confidence = result
		? clampPercent(parseDecimal(result.data_confidence))
		: 0;
	const panelDescription = result
		? `${result.summary} (Akurasi analisis ${confidence}%).`
		: "";

	return (
		<div>
			<PageHeader
				title="Skill & AI"
				subtitle="Pahami skill mana yang masih kuat dan bagaimana AI mengubah pekerjaanmu."
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
				{loading ? (
					<>
						<Skeleton className="h-56 rounded-2xl" />
						<Skeleton className="h-56 rounded-2xl" />
					</>
				) : result ? (
					<>
						<FeaturedMetricCard
							title="AI Exposure"
							value={score}
							description="Aktivitas pekerjaan yang dapat dibantu AI secara signifikan."
							icon={Cpu}
							variant="insight"
						/>
						<FeaturedMetricCard
							title="Skill Relevance"
							value={relevance}
							description="Relevansi skill kamu terhadap kebutuhan pekerjaan saat ini."
							icon={TrendingUp}
							variant={getScoreStatus(relevance)}
						/>
					</>
				) : (
					<div className="sm:col-span-2 bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 text-center">
						<p className="text-sm text-neutral/60">
							Belum ada penilaian AI exposure. Gunakan tombol "Lengkapi Data
							Karier" di menu samping untuk melihat seberapa besar paparan AI
							pada pekerjaanmu.
						</p>
					</div>
				)}
			</div>

			{loading ? (
				<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary shadow-sm p-8 mb-8">
					<Skeleton className="h-5 w-56 mb-1.5" />
					<Skeleton className="h-3 w-72 mb-6" />
					<div className="space-y-4">
						{[0, 1, 2].map((i) => (
							<div key={i} className="flex items-center gap-4">
								<Skeleton className="h-4 w-40 shrink-0" />
								<Skeleton className="h-2 flex-1 rounded-full" />
								<Skeleton className="h-3 w-16 shrink-0" />
							</div>
						))}
					</div>
				</div>
			) : result && result.activities.length > 0 ? (
				<ActivityImpactPanel
					description={panelDescription}
					activities={result.activities}
				/>
			) : null}

			<h3 className="text-sm font-bold text-neutral mb-3">Analisis Skill</h3>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				{loading ? (
					<>
						<Skeleton className="h-40 rounded-2xl" />
						<Skeleton className="h-40 rounded-2xl" />
						<Skeleton className="h-40 rounded-2xl" />
					</>
				) : result ? (
					<>
						<SkillAnalysisCard
							title="Skill Kuat"
							icon={Settings2}
							variant="neutral"
							skills={result.strong_skills}
						/>
						<SkillAnalysisCard
							title="Skill Naik"
							icon={ArrowUp}
							variant="insight"
							skills={result.rising_skills}
							pillTone="insight"
						/>
						<SkillAnalysisCard
							title="Perlu Diperkuat"
							icon={Wrench}
							variant="risk"
							skills={result.skills_to_improve}
						/>
					</>
				) : null}
			</div>
		</div>
	);
}