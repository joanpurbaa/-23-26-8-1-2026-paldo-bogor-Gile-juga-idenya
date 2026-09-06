import type { LucideIcon } from "lucide-react";
import { Pencil } from "lucide-react";
import { financeToneStyles, type FinanceTone } from "../../lib/status";

interface ParameterCardProps {
	label: string;
	value: string;
	sublabel?: string | null;
	icon: LucideIcon;
	tone: FinanceTone;
	onEdit?: () => void;
}

export default function ParameterCard({
	label,
	value,
	sublabel,
	icon: Icon,
	tone,
	onEdit,
}: ParameterCardProps) {
	const t = financeToneStyles[tone];

	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-5 flex flex-col">
			<div className="flex items-start justify-between mb-4">
				<div
					className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.iconBg}`}>
					<Icon size={16} className={t.iconText} />
				</div>
				<button
					type="button"
					onClick={onEdit}
					className="text-neutral/30 hover:text-neutral/60 transition cursor-pointer">
					<Pencil size={14} />
				</button>
			</div>
			<p className="text-[11px] font-semibold text-neutral/50 tracking-wide uppercase mb-1">
				{label}
			</p>
			<p className="text-lg font-bold text-neutral">{value}</p>
			{sublabel && <p className="text-xs text-neutral/50 mt-1">{sublabel}</p>}
		</div>
	);
}
