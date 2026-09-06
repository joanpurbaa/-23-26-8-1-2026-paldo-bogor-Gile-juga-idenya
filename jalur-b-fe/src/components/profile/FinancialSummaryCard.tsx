import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { financialApi, parseRunwayMonths } from "../../services/financial";
import type { FinancialProfileResponse } from "../../types/financial";
import { getScoreStatus, statusStyles } from "../../lib/status";
import ProgressBar from "../ui/ProgressBar";
import Skeleton from "../ui/Skeleton";

interface FinancialSummaryCardProps {
	refreshKey?: number;
}

function formatRupiah(raw?: string | null): string {
	if (!raw) return "-";
	const n = Number(raw);
	return Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : "-";
}

export default function FinancialSummaryCard({
	refreshKey = 0,
}: FinancialSummaryCardProps) {
	const [profile, setProfile] = useState<FinancialProfileResponse | null>(null);
	const [runway, setRunway] = useState<{
		current: number;
		target: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (!active) return;
				setProfile(res.profile ?? null);
				setRunway(res.runway ? parseRunwayMonths(res.runway) : null);
			})
			.catch(() => {
				if (!active) return;
				setProfile(null);
				setRunway(null);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [refreshKey]);

	const current = runway?.current ?? 0;
	const target = runway?.target ?? 0;
	const percentToTarget = Math.min(
		100,
		Math.round((current / (target || 1)) * 100),
	);
	const variant = getScoreStatus(percentToTarget);
	const s = statusStyles[variant];

	const parameters =
		profile != null
			? [
					{
						label: "Pengeluaran Esensial / Bulan",
						value: formatRupiah(profile.monthly_essential_expenses),
					},
					{
						label: "Cicilan Utang / Bulan",
						value: formatRupiah(profile.monthly_debt_payment),
					},
					{
						label: "Jumlah Tanggungan",
						value: profile.dependents != null ? String(profile.dependents) : "-",
					},
				]
			: [];

	return (
		<div>
			{loading ? (
				<div className="rounded-xl p-5 mb-5 bg-neutral/5 border border-neutral/10">
					<Skeleton className="h-3 w-24 mb-2" />
					<Skeleton className="h-8 w-32 mb-3" />
					<Skeleton className="h-3 w-full" />
					<Skeleton className="h-3 w-full mt-2" />
				</div>
			) : (
				<div className={`rounded-xl p-5 mb-5 ${s.bg} border ${s.border}`}>
					<div className="flex items-center justify-between mb-2">
						<div>
							<p className="text-[11px] font-medium text-neutral/50 uppercase tracking-wide">
								Current Runway
							</p>
							<p className="text-2xl font-extrabold text-neutral mt-0.5">
								{`${current.toFixed(1)} bulan`}
							</p>
						</div>
						<div className="text-right">
							<p className="text-[11px] font-medium text-neutral/50 uppercase tracking-wide">
								Target
							</p>
							<p className="text-sm font-bold text-neutral mt-0.5">
								{`${target.toFixed(1)} bulan`}
							</p>
						</div>
					</div>
					<ProgressBar value={percentToTarget} variant={variant} />
				</div>
			)}

			{parameters.length > 0 && (
				<div className="divide-y divide-neutral/10 border-t border-neutral/10 mb-4">
					{parameters.map((item) => (
						<div
							key={item.label}
							className="flex items-center justify-between py-2.5">
							<span className="text-sm text-neutral/60">{item.label}</span>
							<span className="text-sm font-semibold text-neutral">{item.value}</span>
						</div>
					))}
				</div>
			)}

			<div className="flex items-center gap-2 mb-5">
				<Lock size={12} className="text-neutral/40" />
				<p className="text-xs text-neutral/50">
					Data finansialmu bersifat privat dan hanya digunakan untuk menghitung
					financial runway.
				</p>
			</div>

			<a
				href="/dashboard/finansial"
				type="button"
				// onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition">
				Lihat Data Finansial →
			</a>
		</div>
	);
}
