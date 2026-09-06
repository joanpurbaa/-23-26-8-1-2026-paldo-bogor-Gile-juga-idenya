import { useEffect, useState } from "react";
import {
	TrendingUp,
	Zap,
	RefreshCw,
	Plane,
	Wallet,
	Upload,
	Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { getScoreStatus } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import ProgressBar from "../ui/ProgressBar";
import Skeleton from "../ui/Skeleton";
import ExpandableText from "../ui/ExpandableText";
import { PrimaryButton } from "../ui/PrimaryButton";
import FactorCard from "./FactorCard";
import { careerHealthApi } from "../../services/careerHealth";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { HealthAssessmentResult } from "../../types/careerHealth";

const factorIcons: Record<string, LucideIcon> = {
	performance: TrendingUp,
	skill_relevance: Zap,
	adaptation: RefreshCw,
	adaptability: RefreshCw,
	readiness: Plane,
	financial: Wallet,
	financial_readiness: Wallet,
};

function formatDate(value: string): string {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(d);
}

export default function KesehatanKarier() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

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
	const confidence = result
		? Math.min(100, Math.max(0, Math.round(parseDecimal(result.data_confidence) * 100)))
		: 0;
	const assessedDate = result ? formatDate(result.assessed_at) : "";

	return (
		<div>
			<PageHeader
				title="Kesehatan Karier"
				subtitle="Lihat seberapa kuat posisi kariermu saat ini dan apa yang perlu diperhatikan."
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				<div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-neutral/5 shadow-md flex flex-col justify-center">
					{loading ? (
						<>
							<Skeleton className="h-5 w-44 mb-5" />
							<Skeleton className="h-12 w-36 mb-3" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3 mt-2" />
						</>
					) : result ? (
						<>
							<h2 className="text-xl font-bold text-neutral">
								Skor Kesehatan Karier
							</h2>
							<div className="flex items-baseline gap-3 mt-4">
								<span className="text-5xl font-extrabold text-neutral">
									{score}
									<span className="text-2xl text-neutral/40 font-normal">/100</span>
								</span>
								<StatusBadge label={result.status} variant={statusVariant} />
							</div>
							<ExpandableText
								text={result.summary}
								maxLines={3}
								className="text-sm text-neutral/60 mt-4 leading-relaxed max-w-lg"
							/>
							{assessedDate && (
								<p className="text-xs text-neutral/40 mt-3">
									Terakhir dinilai: {assessedDate}
								</p>
							)}
						</>
					) : (
						<>
							<h2 className="text-xl font-bold text-neutral">
								Skor Kesehatan Karier
							</h2>
							<div className="flex items-baseline gap-3 mt-4">
								<span className="text-5xl font-extrabold text-neutral/30">
									—
									<span className="text-2xl text-neutral/30 font-normal">/100</span>
								</span>
							</div>
							<p className="text-sm text-neutral/60 mt-4 leading-relaxed max-w-lg">
								Belum ada penilaian kesehatan karier. Gunakan tombol
								"Lengkapi Data Karier" di menu samping untuk mengisi data dan
								melihat skor kesehatanmu.
							</p>
						</>
					)}
				</div>

				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col justify-between">
					<div>
						<div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-3">
							<Sparkles size={16} />
							<span>AI Insight</span>
						</div>
						{!result && (
							<p className="text-xs text-neutral/70 leading-relaxed">
								Semakin banyak data yang kamu tambahkan, semakin akurat analisis
								Jalur B.
							</p>
						)}
						{result && (
							<ExpandableText
								text={result.summary}
								maxLines={3}
								buttonClassName="mt-1.5"
								className="text-xs text-neutral/70 leading-relaxed"
							/>
						)}

						{result && (
							<div className="mt-4">
								<div className="flex justify-between items-center text-xs mb-1.5 font-medium">
									<span className="text-neutral/60">Akurasi analisismu</span>
									<span className="text-primary font-bold">{confidence}%</span>
								</div>
								<ProgressBar value={confidence} variant="insight" />
							</div>
						)}
					</div>

					<div className="space-y-2.5 mt-6">
						<PrimaryButton
							icon={<Upload size={14} />}
							fullWidth
							onClick={openCareerAssessment}>
							{result ? "Perbarui Data Karier" : "Lengkapi Data Karier"}
						</PrimaryButton>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-bold text-neutral mb-3">
					Faktor Kesehatan Karier
				</h3>
				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-5">
								<Skeleton className="h-3 w-32 mb-4" />
								<Skeleton className="h-7 w-16 mb-2" />
								<Skeleton className="h-2 w-full rounded-full" />
								<Skeleton className="h-3 w-4/5 mt-3" />
							</div>
						))}
					</div>
				) : result && result.factors.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{result.factors.map((factor) => (
							<FactorCard
								key={factor.key}
								title={factor.title}
								score={Math.round(parseDecimal(factor.score))}
								level={factor.level}
								explanation={factor.explanation}
								icon={factorIcons[factor.key] ?? Sparkles}
							/>
						))}
					</div>
				) : (
					<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 text-center">
						<p className="text-sm text-neutral/60">
							Belum ada faktor yang bisa ditampilkan. Lengkapi data karier via
							menu samping untuk mendapatkan analisis faktor kesehatan.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}