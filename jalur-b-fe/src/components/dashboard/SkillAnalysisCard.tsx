import type { LucideIcon } from "lucide-react";
import { statusStyles, type StatusVariant } from "../../lib/status";
import SkillPill from "../ui/SkillPill";

interface SkillAnalysisCardProps {
	title: string;
	icon: LucideIcon;
	variant: StatusVariant;
	skills: string[];
	pillTone?: "neutral" | "insight";
}

export default function SkillAnalysisCard({
	title,
	icon: Icon,
	variant,
	skills,
	pillTone = "neutral",
}: SkillAnalysisCardProps) {
	const s = statusStyles[variant];

	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
			<div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-neutral/10">
				<div
					className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.iconBg}`}>
					<Icon size={15} className={s.text} />
				</div>
				<h4 className="text-sm font-bold text-neutral">{title}</h4>
			</div>
			{skills.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{skills.map((skill) => (
						<SkillPill key={skill} label={skill} tone={pillTone} />
					))}
				</div>
			) : (
				<p className="text-xs text-neutral/40">Belum ada data.</p>
			)}
		</div>
	);
}
