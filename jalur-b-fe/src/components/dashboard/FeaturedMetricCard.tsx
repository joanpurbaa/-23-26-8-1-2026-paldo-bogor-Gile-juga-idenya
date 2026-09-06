import type { LucideIcon } from "lucide-react";
import { statusStyles, type StatusVariant } from "../../lib/status";
import ExpandableText from "../ui/ExpandableText";

interface FeaturedMetricCardProps {
	title: string;
	value: number;
	description: string;
	icon: LucideIcon;
	variant: StatusVariant;
}

export default function FeaturedMetricCard({
	title,
	value,
	description,
	icon: Icon,
	variant,
}: FeaturedMetricCardProps) {
	const s = statusStyles[variant];

	return (
		<div className={`rounded-2xl border shadow-sm p-8 ${s.bg} ${s.border}`}>
			<div className="flex items-center gap-2 mb-6">
				<div
					className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
					<Icon size={18} className={s.text} />
				</div>
				<h3 className="text-base font-bold text-neutral">{title}</h3>
			</div>
			<div className="flex items-baseline gap-1">
				<span className="text-5xl font-extrabold text-neutral">{value}</span>
				<span className="text-2xl font-bold text-neutral/40">%</span>
			</div>
			<ExpandableText
				text={description}
				maxLines={2}
				className="text-sm text-neutral/60 mt-3 leading-relaxed"
			/>
		</div>
	);
}
