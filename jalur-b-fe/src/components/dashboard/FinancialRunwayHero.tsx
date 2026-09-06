import { Sparkles } from "lucide-react";
import { getScoreStatus, statusStyles } from "../../lib/status";
import ProgressBar from "../ui/ProgressBar";
import Skeleton from "../ui/Skeleton";

interface RunwayData {
	current: number;
	target: number;
	description?: string | null;
}

interface FinancialRunwayHeroProps {
	runway?: RunwayData | null;
	loading?: boolean;
}

export default function FinancialRunwayHero({
	runway,
	loading = false,
}: FinancialRunwayHeroProps) {
	const current = runway?.current ?? 0;
	const target = runway?.target ?? 0;
	const percentToTarget = Math.min(
		100,
		Math.round((current / (target || 1)) * 100),
	);
	const variant = getScoreStatus(percentToTarget);
	const s = statusStyles[variant];
	const gap = (target - current).toFixed(1);
	const description =
		runway?.description ??
		"Lengkapi parameter finansial untuk menghitung ketahanan keuanganmu.";

	if (loading) {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
				<div className="lg:col-span-2 bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary shadow-sm p-8">
					<Skeleton className="w-28 h-4 mb-6" />
					<Skeleton className="w-44 h-12" />
					<Skeleton className="w-3/4 h-4 mt-5" />
					<Skeleton className="w-1/2 h-4 mt-2" />
				</div>
				<div className="rounded-2xl border shadow-sm p-6 flex flex-col justify-center bg-neutral/5 border-neutral/10">
					<Skeleton className="w-full h-16 mb-3" />
					<Skeleton className="w-full h-3 mb-3" />
					<Skeleton className="w-24 h-3" />
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
			<div className="lg:col-span-2 bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary shadow-sm p-8">
				<div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-5">
					<Sparkles size={13} />
					<span>AI Insight</span>
				</div>
				<div className="flex items-baseline gap-2">
					<span className="text-5xl font-extrabold text-neutral">
						{current.toString().replace(".", ",")}
					</span>
					<span className="text-base text-neutral/50 font-medium">bulan</span>
				</div>
				<p className="text-sm text-neutral/60 mt-4 leading-relaxed max-w-lg">
					{description}
				</p>
			</div>

			<div
				className={`rounded-2xl border shadow-sm p-6 flex flex-col justify-center ${s.bg} ${s.border}`}>
				<div className="flex items-center justify-between mb-2">
					<div>
						<p className="text-[11px] text-neutral/50 font-medium uppercase tracking-wide">
							Kondisi Saat Ini
						</p>
						<p className="text-lg font-bold text-neutral mt-0.5">
							{current.toFixed(1)} bln
						</p>
					</div>
					<div className="text-right">
						<p className="text-[11px] text-neutral/50 font-medium uppercase tracking-wide">
							Target Minimum
						</p>
						<p className="text-lg font-bold text-neutral mt-0.5">
							{target.toFixed(1)} bln
						</p>
					</div>
				</div>
				<div className="my-3">
					<ProgressBar value={percentToTarget} variant={variant} />
				</div>
				<p className={`text-xs font-semibold ${statusStyles.risk.text}`}>
					↓ Gap: {gap} bulan
				</p>
			</div>
		</div>
	);
}