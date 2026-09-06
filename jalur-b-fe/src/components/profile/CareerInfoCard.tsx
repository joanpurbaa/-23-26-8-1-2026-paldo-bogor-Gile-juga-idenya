import { useEffect, useState } from "react";
import InfoStat from "../ui/InfoStat";
import { SecondaryButton } from "../ui/PrimaryButton";
import Skeleton from "../ui/Skeleton";
import { careerRiskApi } from "../../services/careerRisk";
import { aiExposureApi } from "../../services/aiExposure";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { OnboardingProfile } from "../../types/onboarding";

interface CareerInfoCardProps {
	onEdit: () => void;
	profile?: OnboardingProfile | null;
	loading?: boolean;
}

function tenureFromMonths(months: number | null): string | null {
	if (months === null || months === undefined) return null;
	if (months < 12) return `${months} bulan`;
	const years = Math.floor(months / 12);
	const rem = months % 12;
	return rem > 0 ? `${years} tahun ${rem} bulan` : `${years} tahun`;
}

interface CareerStats {
	careerRisk: string | null;
	aiExposure: string | null;
	skillRelevance: string | null;
}

export default function CareerInfoCard({
	onEdit,
	profile,
	loading = false,
}: CareerInfoCardProps) {
	const { refreshKey } = useCareerAssessment();
	const [stats, setStats] = useState<CareerStats | null>(null);
	const [statsLoading, setStatsLoading] = useState(true);

	useEffect(() => {
		let active = true;
		const load = async () => {
			const [risk, exposure] = await Promise.allSettled([
				careerRiskApi.latest(),
				aiExposureApi.latest(),
			]);
			if (!active) return;
			const riskLevel =
				risk.status === "fulfilled" ? risk.value.level : null;
			const score =
				exposure.status === "fulfilled"
					? Math.min(100, Math.round(parseDecimal(exposure.value.score)))
					: null;
			const relevance =
				exposure.status === "fulfilled"
					? Math.min(
							100,
							Math.round(parseDecimal(exposure.value.skill_relevance_score)),
						)
					: null;
			setStats({
				careerRisk: riskLevel,
				aiExposure: score != null ? `${score}%` : null,
				skillRelevance: relevance != null ? `${relevance}%` : null,
			});
			setStatsLoading(false);
		};
		void load();
		return () => {
			active = false;
		};
	}, [refreshKey]);

	const role = profile?.current_role_name || "-";
	const tenure = tenureFromMonths(profile?.work_duration_months ?? null) || "-";

	if (loading || statsLoading) {
		return (
			<div>
				<div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-6">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i}>
							<Skeleton className="h-3 w-20 mb-2" />
							<Skeleton className="h-5 w-32" />
						</div>
					))}
				</div>
				<Skeleton className="h-10 w-44 rounded-full" />
			</div>
		);
	}

	return (
		<div>
			<div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-6">
				<InfoStat label="Jabatan" value={role} />
				<InfoStat label="Lama Bekerja" value={tenure} />
				<InfoStat label="Career Risk" value={stats?.careerRisk ?? "-"} />
				<InfoStat label="AI Exposure" value={stats?.aiExposure ?? "-"} />
				<InfoStat
					label="Skill Relevance"
					value={stats?.skillRelevance ?? "-"}
				/>
			</div>
			<SecondaryButton onClick={onEdit}>Edit Data Karier</SecondaryButton>
		</div>
	);
}