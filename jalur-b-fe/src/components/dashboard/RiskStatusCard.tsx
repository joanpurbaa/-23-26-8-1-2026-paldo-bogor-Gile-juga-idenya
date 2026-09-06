import { AlertTriangle } from "lucide-react";
import { getLevelStatus, statusStyles, type RiskLevel } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";

interface RiskStatusCardProps {
	level: RiskLevel;
	summary: string;
	score?: number;
}

export default function RiskStatusCard({
	level,
	summary,
	score,
}: RiskStatusCardProps) {
	const variant = getLevelStatus(level);
	const s = statusStyles[variant];

	return (
		<div className="bg-white rounded-2xl p-8 border border-neutral/5 shadow-md flex flex-col sm:flex-row items-start gap-5 mb-6">
			<div
				className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
				<AlertTriangle size={22} className={s.text} />
			</div>
			<div className="flex-1">
				<div className="flex items-center gap-3 flex-wrap">
					<h2 className="text-xl font-bold text-neutral">Status Risiko</h2>
					<StatusBadge
						label={level.toUpperCase()}
						variant={variant}
					/>
					{score != null && (
						<span className="text-xs font-semibold text-neutral/50">
							Skor: {score}/100
						</span>
					)}
				</div>
				<p className="text-sm text-neutral/60 mt-3 leading-relaxed max-w-xl">
					{summary}
				</p>
			</div>
		</div>
	);
}