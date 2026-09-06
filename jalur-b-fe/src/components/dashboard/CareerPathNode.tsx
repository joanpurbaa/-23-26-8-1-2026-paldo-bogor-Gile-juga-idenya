import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface CareerPathNodeProps {
	title: string;
	subtitle?: string;
	match?: number;
	icon: LucideIcon;
	selected?: boolean;
	variant?: "center" | "node";
	float?: string;
	style?: React.CSSProperties;
}

export default function CareerPathNode({
	title,
	subtitle,
	match,
	icon: Icon,
	selected,
	variant = "node",
	float,
	style,
}: CareerPathNodeProps) {
	if (variant === "center") {
		return (
			<div
				style={style}
				className="absolute -translate-x-1/2 -translate-y-1/2 w-40 bg-white rounded-2xl border-2 border-primary shadow-md p-5 flex flex-col items-center text-center">
				<div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3">
					<Icon size={20} className="text-primary" />
				</div>
				<h4 className="text-sm font-bold text-neutral leading-tight">{title}</h4>
				<p className="text-xs text-neutral/50 mt-1">{subtitle}</p>
			</div>
		);
	}

	return (
		<div
			style={style}
			className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[168px] bg-white rounded-xl p-3.5 flex items-center gap-2.5 ${
				selected
					? "border-2 border-primary shadow-md"
					: "border border-neutral/10 shadow-sm"
			} ${float || ""} motion-reduce:animate-none`}>
			<Icon
				size={16}
				className={selected ? "text-primary shrink-0" : "text-neutral/50 shrink-0"}
			/>
			<div>
				<p className="text-xs font-semibold text-neutral leading-tight">{title}</p>
				<p
					className={`text-[11px] mt-0.5 font-semibold ${selected ? "text-primary" : "text-neutral/50"}`}>
					{match}% Cocok
				</p>
			</div>
			{selected && (
				<div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm animate-pulse-soft motion-reduce:animate-none">
					<Sparkles size={11} className="text-white" />
				</div>
			)}
		</div>
	);
}
