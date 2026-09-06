import { useEffect, useState } from "react";
import { Briefcase, Landmark, Info } from "lucide-react";
import { getScoreStatus } from "../../../lib/status";
import { normalizeRiskLevel } from "../../../lib/status";
import StatusBadge from "../../ui/StatusBadge";
import InfoStat from "../../ui/InfoStat";
import { PrimaryButton } from "../../ui/PrimaryButton";
import ScenarioPicker, {
	type ScenarioOption,
} from "./ScenarioPicker";
import { profileApi } from "../../../services/profile";
import { careerHealthApi } from "../../../services/careerHealth";
import { careerRiskApi } from "../../../services/careerRisk";
import { aiExposureApi } from "../../../services/aiExposure";
import { financialApi } from "../../../services/financial";
import { parseDecimal } from "../../../lib/parseNumeric";
import type { LayoffScenario } from "../../../types/layoffSimulation";

interface SimulationSetupProps {
	selectedScenario: LayoffScenario;
	scenarioOptions: ScenarioOption[];
	onSelectScenario: (id: LayoffScenario) => void;
	onStart: () => void;
}

interface SetupConditions {
	role: string | null;
	tenure: string | null;
	careerHealth: number | null;
	careerHealthStatus: string | null;
	careerRisk: string | null;
	aiExposure: number | null;
	skillRelevance: number | null;
	liquidAssets: string | null;
	essentialExpenses: string | null;
	debtPayment: string | null;
	dependents: number | null;
	runwayMonths: number | null;
}

function clampPercent(value: string): number {
	return Math.min(100, Math.max(0, Math.round(parseDecimal(value))));
}

function formatTenure(months: number): string {
	const years = Math.floor(months / 12);
	const rest = months % 12;
	if (years > 0 && rest > 0) return `${years} tahun ${rest} bulan`;
	if (years > 0) return `${years} tahun`;
	if (rest > 0) return `${rest} bulan`;
	return "";
}

function formatRupiah(raw?: string | null): string {
	if (!raw) return "—";
	const n = Number(raw);
	return Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : "—";
}

const emptyConditions: SetupConditions = {
	role: null,
	tenure: null,
	careerHealth: null,
	careerHealthStatus: null,
	careerRisk: null,
	aiExposure: null,
	skillRelevance: null,
	liquidAssets: null,
	essentialExpenses: null,
	debtPayment: null,
	dependents: null,
	runwayMonths: null,
};

export default function SimulationSetup({
	selectedScenario,
	scenarioOptions,
	onSelectScenario,
	onStart,
}: SimulationSetupProps) {
	const [conditions, setConditions] = useState<SetupConditions>(emptyConditions);

	useEffect(() => {
		let active = true;
		const load = async () => {
const [profile, health, risk, exposure, financial] =
			await Promise.allSettled([
				profileApi.get(),
				careerHealthApi.latest(),
				careerRiskApi.latest(),
				aiExposureApi.latest(),
				financialApi.get(),
			]);
		if (!active) return;

		const next: SetupConditions = { ...emptyConditions };

		if (profile.status === "fulfilled") {
			const p = profile.value.profile;
			next.role = p?.current_role_name ?? null;
			if (p?.work_duration_months != null) {
				next.tenure = formatTenure(p.work_duration_months);
			}
		}

		if (health.status === "fulfilled") {
			next.careerHealth = clampPercent(health.value.score);
			next.careerHealthStatus = health.value.status;
		}

		if (risk.status === "fulfilled") {
			next.careerRisk = normalizeRiskLevel(risk.value.level);
		}

		if (exposure.status === "fulfilled") {
			next.aiExposure = clampPercent(exposure.value.score);
			next.skillRelevance = clampPercent(
				exposure.value.skill_relevance_score,
			);
		}

		if (financial.status === "fulfilled") {
			const f = financial.value;
			next.liquidAssets = f.runway?.liquid_assets ?? null;
			next.essentialExpenses = f.profile?.monthly_essential_expenses ?? null;
			next.debtPayment = f.profile?.monthly_debt_payment ?? null;
			next.dependents = f.profile?.dependents ?? null;
			next.runwayMonths = f.runway
				? parseDecimal(f.runway.financial_runway_months) || null
				: null;
		}

			setConditions(next);
		};
		void load();
		return () => {
			active = false;
		};
	}, []);

	const healthVariant = getScoreStatus(conditions.careerHealth ?? 0);

	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<div className="flex items-center gap-3 pb-5 mb-5 border-b border-neutral/10">
						<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
							<Briefcase size={16} className="text-primary" />
						</div>
						<h3 className="text-sm font-bold text-neutral">Kondisi Karier</h3>
					</div>
					<div className="grid grid-cols-2 gap-y-5 gap-x-6">
						<InfoStat label="Role" value={conditions.role ?? "—"} />
						<InfoStat label="Lama Bekerja" value={conditions.tenure ?? "—"} />
						<InfoStat
							label="Career Health"
							value={
								conditions.careerHealth != null
									? `${conditions.careerHealth}/100`
									: "—"
							}
							badge={
								conditions.careerHealth != null &&
								conditions.careerHealthStatus ? (
									<StatusBadge
										label={conditions.careerHealthStatus}
										variant={healthVariant}
									/>
								) : undefined
							}
						/>
						<InfoStat
							label="Career Risk"
							value={conditions.careerRisk ?? "—"}
						/>
						<InfoStat
							label="AI Exposure"
							value={
								conditions.aiExposure != null
									? `${conditions.aiExposure}%`
									: "—"
							}
						/>
						<InfoStat
							label="Skill Relevance"
							value={
								conditions.skillRelevance != null
									? `${conditions.skillRelevance}%`
									: "—"
							}
						/>
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<div className="flex items-center gap-3 pb-5 mb-5 border-b border-neutral/10">
						<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
							<Landmark size={16} className="text-primary" />
						</div>
						<h3 className="text-sm font-bold text-neutral">Kondisi Finansial</h3>
					</div>
					<div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-5">
						<InfoStat
							label="Tabungan Darurat (Liquid)"
							value={formatRupiah(conditions.liquidAssets)}
						/>
						<InfoStat
							label="Jumlah Tanggungan"
							value={
								conditions.dependents != null
									? String(conditions.dependents)
									: "—"
							}
						/>
						<InfoStat
							label="Pengeluaran Rutin"
							value={
								conditions.essentialExpenses
									? `${formatRupiah(conditions.essentialExpenses)}/bln`
									: "—"
							}
							tone="risk"
						/>
						<InfoStat
							label="Cicilan"
							value={
								conditions.debtPayment
									? `${formatRupiah(conditions.debtPayment)}/bln`
									: "—"
							}
							tone="risk"
						/>
					</div>
					<div className="bg-neutral/5 rounded-xl p-4 flex items-center justify-between">
						<div>
							<p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wide">
								Financial Runway Saat Ini
							</p>
							<p className="text-xs text-neutral/50 mt-0.5">
								Tanpa perubahan gaya hidup
							</p>
						</div>
						<p className="text-xl font-bold text-primary">
							{conditions.runwayMonths != null
								? `${conditions.runwayMonths.toFixed(1)} Bulan`
								: "—"}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary p-8">
				<h3 className="text-sm font-bold text-neutral mb-4">
					Konfigurasi Skenario
				</h3>
				<p className="text-sm text-neutral/70 mb-4">
					Kapan income berhenti (skenario terburuk)?
				</p>
				<ScenarioPicker
					selected={selectedScenario}
					options={scenarioOptions}
					onSelect={onSelectScenario}
				/>

				<div className="flex flex-col items-center mt-6">
					<PrimaryButton onClick={onStart}>Mulai Simulasi</PrimaryButton>
					<div className="flex items-center gap-1.5 mt-3">
						<Info size={12} className="text-neutral/40" />
						<p className="text-xs text-neutral/50">
							Ini hanya simulasi. Data asli kamu tidak akan berubah.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}