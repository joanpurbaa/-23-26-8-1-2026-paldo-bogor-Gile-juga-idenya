import { useEffect, useState } from "react";
import {
	AlertTriangle,
	Sparkles,
	TrendingDown,
	HeartPulse,
	Zap,
	Compass,
	Wallet as WalletIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getScoreStatus } from "../../../lib/status";
import MetricCard from "../MetricCard";
import ProgressBar from "../../ui/ProgressBar";
import ResultTimeline from "./ResultTimeline";
import { careerPivotApi } from "../../../services/careerPivot";
import { aiExposureApi } from "../../../services/aiExposure";
import { parseDecimal } from "../../../lib/parseNumeric";
import type { LayoffSimulationResult } from "../../../types/layoffSimulation";

interface ReadinessItem {
	label: string;
	value: number;
	icon: LucideIcon;
}

const scenarioLabels: Record<string, string> = {
	tomorrow: "Besok",
	one_month: "1 Bulan Lagi",
	three_months: "3 Bulan Lagi",
};

function clampScore(value: string): number {
	return Math.min(100, Math.max(0, Math.round(parseDecimal(value))));
}

function formatRunway(value: number): string {
	return value % 1 === 0
		? `${Math.round(value)}`
		: `${value.toFixed(1).replace(".", ",")}`;
}

function formatDate(value: string): string {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(d);
}

export default function SimulationResult({
	result,
}: {
	result: LayoffSimulationResult;
}) {
	const [pivotRoles, setPivotRoles] = useState<
		{ role: string; match: number }[]
	>([]);
	const [weaknesses, setWeaknesses] = useState<string[]>([]);

	useEffect(() => {
		let active = true;
		const load = async () => {
			const [pivot, exposure] = await Promise.allSettled([
				careerPivotApi.latest(),
				aiExposureApi.latest(),
			]);
			if (!active) return;
			if (pivot.status === "fulfilled") {
				setPivotRoles(
					pivot.value.roles.slice(0, 3).map((r) => ({
						role: r.role_name,
						match: Math.round(parseDecimal(r.match_score)),
					})),
				);
			}
			if (exposure.status === "fulfilled") {
				setWeaknesses(exposure.value.skills_to_improve.slice(0, 3));
			}
		};
		void load();
		return () => {
			active = false;
		};
	}, []);

	const runway = parseDecimal(result.financial_runway_months);
	const target = parseDecimal(result.target_runway_months);
	const gap = parseDecimal(result.financial_gap);
	const runwayPercent =
		target > 0 ? Math.min(100, Math.round((Math.max(0, runway) / target) * 100)) : 0;
	const simulatedDate = result.simulated_at ? formatDate(result.simulated_at) : "";

	const readiness: ReadinessItem[] = [
		{
			label: "Financial Readiness",
			value: clampScore(result.financial_readiness_score),
			icon: WalletIcon,
		},
		{
			label: "Career Readiness",
			value: clampScore(result.career_readiness_score),
			icon: HeartPulse,
		},
		{
			label: "Skill Relevance",
			value: clampScore(result.skill_relevance_score),
			icon: Zap,
		},
		{
			label: "Job Mobility",
			value: clampScore(result.job_mobility_score),
			icon: Compass,
		},
		{
			label: "Overall Resilience",
			value: clampScore(result.overall_resilience_score),
			icon: Sparkles,
		},
	];

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-3 bg-white rounded-2xl border border-neutral/5 border-l-4 border-l-primary shadow-sm p-6">
				<div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
					<Sparkles size={16} />
					<span>Ringkasan Hasil</span>
				</div>
				<p className="text-sm text-neutral/80 leading-relaxed max-w-4xl">
					{result.summary || "Belum ada ringkasan untuk simulasi ini."}
				</p>
				<p className="text-xs text-neutral/40 mt-2">
					Skenario: {scenarioLabels[result.scenario] ?? result.scenario}
					{simulatedDate ? ` · Disimulasikan ${simulatedDate}` : ""}
				</p>
			</div>

			<div className="lg:col-span-2 space-y-6">
				<div className="bg-white rounded-2xl border border-rose-100 shadow-md p-8">
					<p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wide mb-2">
						Financial Runway
					</p>
					<div className="flex items-start justify-between gap-4 mb-4">
						<h3 className="text-lg font-bold text-neutral max-w-md leading-snug">
							Kamu punya waktu sekitar{" "}
							<span className="text-rose-600">{formatRunway(runway)} bulan</span>{" "}
							sebelum dana cadangan habis.
						</h3>
						<div className="text-right shrink-0">
							<span className="text-4xl font-extrabold text-rose-600">
								{formatRunway(runway)}
							</span>
							<p className="text-xs text-neutral/50">bulan</p>
						</div>
					</div>
					<div className="flex justify-between text-[11px] text-neutral/40 mb-1.5">
						<span>0</span>
						<span>Target: {formatRunway(target)} bulan</span>
					</div>
					<ProgressBar value={runwayPercent} variant="risk" />
					<div className="flex items-center gap-1.5 mt-3">
						<AlertTriangle size={13} className="text-rose-600" />
						<span className="text-xs font-semibold text-rose-600">
							Perlu diperkuat
						</span>
						{gap > 0 && (
							<span className="text-xs text-neutral/50 ml-1">
								· Gap terhadap target: {formatRunway(gap)} bulan
							</span>
						)}
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
					{readiness.map((item) => (
						<MetricCard
							key={item.label}
							label={item.label}
							value={`${item.value}/100`}
							icon={item.icon}
							variant={getScoreStatus(item.value)}
						/>
					))}
				</div>

				<ResultTimeline runwayMonths={runway} targetMonths={target} />
			</div>

			<div className="space-y-6">
				<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary p-6">
					<div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
						<Sparkles size={16} />
						<span>Kalau kamu mencari kerja lagi</span>
					</div>
					<p className="text-xs text-neutral/60 mb-4">
						Opsi pivot karier terkuat berdasarkan profilmu:
					</p>
					<div className="space-y-2.5">
						{pivotRoles.length > 0 ? (
							pivotRoles.map((option) => (
								<div
									key={option.role}
									className="bg-white rounded-xl p-3.5 flex items-center justify-between">
									<span className="text-sm font-semibold text-neutral">
										{option.role}
									</span>
									<span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
										{option.match}% Match
									</span>
								</div>
							))
						) : (
							<p className="text-xs text-neutral/50">
								Belum ada data jalur karier. Lengkapi data karier untuk melihat
								opsi pivot.
							</p>
						)}
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<h4 className="text-sm font-bold text-neutral mb-4">
						Apa yang perlu diperkuat?
					</h4>
					<div className="space-y-3">
						{weaknesses.length > 0 ? (
							weaknesses.map((skill) => (
								<div key={skill} className="flex items-start gap-2.5">
									<TrendingDown size={15} className="text-rose-500 shrink-0 mt-0.5" />
									<div>
										<p className="text-sm font-semibold text-neutral">{skill}</p>
										<p className="text-xs text-rose-500">Perlu diperkuat</p>
									</div>
								</div>
							))
						) : (
							<p className="text-xs text-neutral/50">
								Belum ada rekomendasi skill untuk diperkuat.
							</p>
						)}
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<h4 className="text-sm font-bold text-neutral mb-2">
						Seberapa siap kamu membuktikan kemampuanmu?
					</h4>
					<p className="text-sm text-neutral/60">
						Kamu memiliki{" "}
						<span className="font-bold text-primary">
							{result.evidence_count} bukti tersimpan
						</span>
						.
					</p>
				</div>
			</div>

			<div className="lg:col-span-3 bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 text-center">
				<h3 className="text-xl font-bold text-neutral mb-2">
					PHK mungkin tidak bisa kamu prediksi.
				</h3>
				<p className="text-sm text-neutral/60">
					Tapi kamu bisa mempersiapkan apa yang terjadi setelahnya.
				</p>
			</div>
		</div>
	);
}