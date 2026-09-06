import type { LucideIcon } from "lucide-react";
import { getScoreStatus, statusStyles } from "../../lib/status";
import ProgressBar from "../ui/ProgressBar";
import ExpandableText from "../ui/ExpandableText";

interface FactorCardProps {
	title: string;
	score: number;
	level?: string;
	explanation?: string;
	icon: LucideIcon;
}

export default function FactorCard({
	title,
	score,
	level,
	explanation,
	icon: Icon,
}: FactorCardProps) {
	const variant = getScoreStatus(score);
	const s = statusStyles[variant];

	return (
		<div className="bg-white rounded-2xl p-5 border border-neutral/5 shadow-sm flex flex-col">
			<div className="flex justify-between items-center mb-3">
				<span className="text-xs font-semibold text-neutral">{title}</span>
				<div
					className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.iconBg}`}>
					<Icon size={14} className={s.text} />
				</div>
			</div>
			<div>
				<div className="flex items-baseline gap-2">
					<span className={`text-2xl font-bold ${s.text}`}>{score}</span>
					{level && <span className="text-[11px] font-medium text-neutral/50">{level}</span>}
				</div>
				<div className="mt-2">
					<ProgressBar value={score} variant={variant} />
				</div>
				<div className="mt-2.5 min-h-[3.75rem]">
					{explanation && (
						<ExpandableText
							text={explanation}
							maxLines={3}
							buttonClassName="text-[11px]"
							className="text-xs text-neutral/50 leading-relaxed"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
