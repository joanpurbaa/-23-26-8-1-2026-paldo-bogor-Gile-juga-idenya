import { useEffect, useState } from "react";
import PageHeader from "../layouts/PageHeader";
import CareerPathMap from "./CareerPathMap";
import RoleDetailPanel from "./RoleDetailPanel";
import PrepTimeCard from "./PrepTimeCard";
import Skeleton from "../ui/Skeleton";
import { careerPivotApi } from "../../services/careerPivot";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerPivotResult } from "../../types/careerPivot";

function clampPercent(value: number): number {
	return Math.min(100, Math.max(0, Math.round(value)));
}

export default function JalurKarier() {
	const { refreshKey } = useCareerAssessment();

	const [result, setResult] = useState<CareerPivotResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		careerPivotApi
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

	const confidence = result
		? clampPercent(parseDecimal(result.data_confidence))
		: 0;
	const primaryRole = result?.roles.length ? result.roles[0] : null;

	return (
		<div>
			<PageHeader
				title="Jalur Karier"
				subtitle="Kalau suatu hari kamu harus berpindah, kamu bisa ke mana?"
			/>

			{result && (
				<div className="bg-white rounded-2xl border border-neutral/5 border-l-4 border-l-primary shadow-sm p-6 mb-6">
					<p className="text-sm text-neutral/70 leading-relaxed">
						<strong className="text-neutral">Rekomendasi:</strong>{" "}
						{result.summary}
					</p>
					<p className="text-xs text-neutral/50 mt-2">
						Akurasi analisis {confidence}%
					</p>
				</div>
			)}

			{loading ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					<div className="lg:col-span-2">
						<Skeleton className="h-[480px] rounded-2xl" />
					</div>
					<div className="space-y-4">
						<Skeleton className="h-64 rounded-2xl" />
						<Skeleton className="h-32 rounded-2xl" />
					</div>
				</div>
			) : result && primaryRole ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					<div className="lg:col-span-2">
						<CareerPathMap
							currentRoleName={result.current_role_name}
							roles={result.roles.map((r) => ({
								name: r.role_name,
								match: Math.round(parseDecimal(r.match_score)),
							}))}
						/>
					</div>
					<div>
						<RoleDetailPanel
							roleName={primaryRole.role_name}
							matchScore={Math.round(parseDecimal(primaryRole.match_score))}
							missingSkills={primaryRole.missing_skills}
						/>
						<PrepTimeCard
							months={primaryRole.preparation_time_months}
							description={primaryRole.preparation_description}
						/>
					</div>
				</div>
			) : (
				<div className="bg-white rounded-2xl p-8 text-center border border-neutral/5 shadow-sm">
					<p className="text-sm text-neutral/60">
						Belum ada rekomendasi jalur karier. Gunakan tombol "Lengkapi Data
						Karier" di menu samping untuk melihat peluang kamu berpindah.
					</p>
				</div>
			)}
		</div>
	);
}