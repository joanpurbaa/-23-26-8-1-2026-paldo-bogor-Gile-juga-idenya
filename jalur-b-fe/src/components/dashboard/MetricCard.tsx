import type { LucideIcon } from "lucide-react";
import { statusStyles, type StatusVariant } from "../../lib/status";

interface MetricCardProps {
	label: string;
	value: string;
	icon: LucideIcon;
	variant: StatusVariant;
}

export default function MetricCard({
	label,
	value,
	icon: Icon,
	variant,
}: MetricCardProps) {
	const s = statusStyles[variant];
	return (
		<div className="bg-white rounded-2xl p-5 border border-neutral/5 shadow-sm flex flex-col justify-between h-32">
			<div
				className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
				<Icon size={18} className={s.text} />
			</div>
			<div>
				<p className="text-xs text-neutral/50 font-medium">{label}</p>
				<p className={`text-lg font-bold mt-0.5 ${s.text}`}>{value}</p>
			</div>
		</div>
	);
}
