import { useEffect, useState } from "react";
import { Wallet, HeartPulse, Zap, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getScoreStatus } from "../../lib/status";
import MetricCard from "../dashboard/MetricCard";
import Skeleton from "../ui/Skeleton";
import { layoffSimulationApi } from "../../services/layoffSimulation";
import { parseDecimal } from "../../lib/parseNumeric";
import type { LayoffSimulationResult } from "../../types/layoffSimulation";

const readinessIcons: Record<string, LucideIcon> = {
	Wallet,
	HeartPulse,
	Zap,
	Sparkles,
};

interface SimulationSummaryCardProps {
	onSeeMore: () => void;
}

function clampScore(value: string): number {
	return Math.min(100, Math.max(0, Math.round(parseDecimal(value))));
}

export default function SimulationSummaryCard({
	onSeeMore,
}: SimulationSummaryCardProps) {
	const [result, setResult] = useState<LayoffSimulationResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		layoffSimulationApi
			.latest()
			.then((res) => {
				if (active) setResult(res);
			})
			.catch(() => {
				// belum ada simulasi — biarkan kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	if (loading) {
		return (
			<div>
				<Skeleton className="h-3 w-2/3 mb-5" />
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
					{[0, 1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-32 rounded-2xl" />
					))}
				</div>
			</div>
		);
	}

	if (!result) {
		return (
			<div className="text-center py-6">
				<p className="text-sm font-semibold text-neutral mb-1">
					Belum ada data simulasi
				</p>
				<p className="text-xs text-neutral/50 mb-4 max-w-xs mx-auto">
					Jalankan simulasi untuk melihat proyeksi kehilangan pekerjaan
					berdasarkan kondisimu saat ini.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="text-xs font-semibold text-primary hover:opacity-70 transition">
					Lihat Simulasi →
				</button>
			</div>
		);
	}

	const readiness = [
		{
			label: "Financial Readiness",
			value: clampScore(result.financial_readiness_score),
			icon: "Wallet",
		},
		{
			label: "Career Readiness",
			value: clampScore(result.career_readiness_score),
			icon: "HeartPulse",
		},
		{
			label: "Skill Relevance",
			value: clampScore(result.skill_relevance_score),
			icon: "Zap",
		},
		{
			label: "Job Mobility",
			value: clampScore(result.job_mobility_score),
			icon: "Sparkles",
		},
	];

	return (
		<div>
			<p className="text-xs text-neutral/50 mb-5 leading-relaxed">
				Hasil simulasi terakhir memproyeksikan ketahananmu menghadapi
				kehilangan pekerjaan menggunakan kondisi karier, skill, bukti karier,
				dan finansialmu.
			</p>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
				{readiness.map((item) => (
					<MetricCard
						key={item.label}
						label={item.label}
						value={`${item.value}/100`}
						icon={readinessIcons[item.icon]}
						variant={getScoreStatus(item.value)}
					/>
				))}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition">
				Lihat Simulasi →
			</button>
		</div>
	);
}