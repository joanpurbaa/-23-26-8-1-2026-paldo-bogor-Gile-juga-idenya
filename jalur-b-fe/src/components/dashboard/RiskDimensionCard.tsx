import type { LucideIcon } from "lucide-react";
import { getLevelStatus, statusStyles, type RiskLevel } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";

interface RiskDimensionCardProps {
	title: string;
	description: string;
	level: RiskLevel;
	icon: LucideIcon;
}

export default function RiskDimensionCard({
	title,
	description,
	level,
	icon: Icon,
}: RiskDimensionCardProps) {
	const variant = getLevelStatus(level);
	const s = statusStyles[variant];

	return (
		<div className="bg-white rounded-2xl p-5 border border-neutral/5 shadow-sm flex flex-col justify-between h-full">
			<div className="flex items-start justify-between mb-4">
				<div
					className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
					<Icon size={16} className={s.text} />
				</div>
				<StatusBadge label={level} variant={variant} />
			</div>
			<div>
				<h4 className="text-sm font-bold text-neutral mb-1">{title}</h4>
				<p className="text-xs text-neutral/60 leading-relaxed">{description}</p>
			</div>
		</div>
	);
}
