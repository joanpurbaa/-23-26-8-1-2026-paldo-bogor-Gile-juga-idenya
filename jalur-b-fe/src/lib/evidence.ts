import type { EvidenceType } from "../types/evidence";

export const evidenceTypeLabels: Record<EvidenceType, string> = {
	project: "Project",
	achievement: "Achievement",
	feedback: "Feedback",
	certificate: "Certificate",
	award: "Award",
	training: "Training",
	other: "Other",
};

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"Mei",
	"Jun",
	"Jul",
	"Agu",
	"Sep",
	"Okt",
	"Nov",
	"Des",
];

/** "2026-01-15" -> "15 Jan 2026" | null -> "—" | unrecognized -> original */
export function formatEvidenceDate(value: string | null): string {
	if (!value) return "—";
	const [year, month, day] = value.split("-");
	const idx = Number(month) - 1;
	if (Number.isNaN(idx) || idx < 0 || idx > 11) return value;
	return `${Number(day)} ${MONTHS[idx]} ${year}`;
}