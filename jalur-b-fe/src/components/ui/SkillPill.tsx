import type { LucideIcon } from "lucide-react";

interface SkillPillProps {
	label: string;
	icon?: LucideIcon;
	tone?: "neutral" | "insight";
}

export default function SkillPill({
	label,
	icon: Icon,
	tone = "neutral",
}: SkillPillProps) {
	const toneClass =
		tone === "insight"
			? "bg-primary/10 border-primary/20 text-primary"
			: "bg-neutral/5 border-neutral/10 text-neutral/70";

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${toneClass}`}>
			{Icon && (
				<Icon
					size={12}
					className={tone === "insight" ? "text-primary/60" : "text-neutral/40"}
				/>
			)}
			{label}
		</span>
	);
}
