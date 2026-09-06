import { useEffect, useState } from "react";
import { Bot, ShieldAlert, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import RiskStatusCard from "./RiskStatusCard";
import RiskDimensionCard from "./RiskDimensionCard";
import AIAnalysisPanel from "./AIAnalysisPanel";
import EarlyWarningCard from "./EarlyWarningCard";
import Skeleton from "../ui/Skeleton";
import { careerRiskApi } from "../../services/careerRisk";
import { parseDecimal } from "../../lib/parseNumeric";
import { normalizeRiskLevel } from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerRiskResult } from "../../types/careerRisk";

const factorIcons: Record<string, LucideIcon> = {
	ai_disruption: Bot,
	automation: Zap,
	skill_dependency: TrendingDown,
	market_demand: TrendingUp,
	adaptability: TrendingUp,
};

export default function RisikoKarier() {
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

	const level = normalizeRiskLevel(result?.level);
	const score = result ? Math.round(parseDecimal(result.score)) : 0;
	const confidence = result
		? Math.min(100, Math.max(0, Math.round(parseDecimal(result.data_confidence) * 100)))
		: 0;

	return (
		<div>
			<PageHeader
				title="Risiko Karier"
				subtitle="Pantau lanskap industri dan persiapkan dirimu menghadapi perubahan tren yang berpotensi memengaruhi peranmu saat ini."
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
				<div className="lg:col-span-2">
					{loading ? (
						<>
							<Skeleton className="h-32 rounded-2xl mb-6" />
							<Skeleton className="h-4 w-40 mb-3" />
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Skeleton className="h-36 rounded-2xl" />
								<Skeleton className="h-36 rounded-2xl" />
							</div>
						</>
					) : result ? (
						<>
							<RiskStatusCard
								level={level}
								summary={result.summary}
								score={score}
							/>
							<h3 className="text-sm font-bold text-neutral mb-3">
								Dimensi Risiko
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{result.factors.map((factor) => (
									<RiskDimensionCard
										key={factor.key || factor.title}
										title={factor.title}
										description={factor.explanation}
										level={normalizeRiskLevel(factor.level)}
										icon={factorIcons[factor.key] ?? ShieldAlert}
									/>
								))}
							</div>
						</>
					) : (
						<div className="bg-white rounded-2xl p-8 text-center border border-neutral/5 shadow-sm mb-6">
							<p className="text-sm text-neutral/60">
								Belum ada penilaian risiko karier. Gunakan tombol "Lengkapi
								Data Karier" di menu samping untuk mengisi data dan melihat
								status serta dimensi risikomu.
							</p>
						</div>
					)}
				</div>

				<AIAnalysisPanel
					description={result?.analysis}
					confidence={confidence}
				/>
			</div>

			{result && <EarlyWarningCard description={result.early_warning} />}
		</div>
	);
}