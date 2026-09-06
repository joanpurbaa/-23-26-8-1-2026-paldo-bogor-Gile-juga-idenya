import { Sparkles } from "lucide-react";
import ActivityImpactBar from "../ui/ActivityImpactBar";
import ExpandableText from "../ui/ExpandableText";

interface ActivityItem {
	key: string;
	title: string;
	level: string;
	explanation?: string;
}

interface ActivityImpactPanelProps {
	title?: string;
	description?: string;
	activities?: ActivityItem[];
}

function normalizeImpactLevel(
	value: string | null | undefined,
): "HIGH" | "MEDIUM" | "LOW" {
	const v = (value ?? "").toLowerCase();
	if (v.includes("high") || v.includes("tinggi")) return "HIGH";
	if (v.includes("low") || v.includes("rendah")) return "LOW";
	return "MEDIUM";
}

export default function ActivityImpactPanel({
	title = "Peta Aktivitas & AI Impact",
	description,
	activities = [],
}: ActivityImpactPanelProps) {
	return (
		<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary shadow-sm p-8 mb-8">
			<div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
				<Sparkles size={16} />
				<span>{title}</span>
			</div>
			<ExpandableText
				text={
					description ||
					"Intensitas dampak AI pada rutinitas kerjamu saat ini."
				}
				maxLines={2}
				buttonClassName="text-[11px]"
				className="text-xs text-neutral/60 mb-6"
			/>

			<div className="space-y-4">
				{activities.map((item) => (
					<div key={item.key || item.title} className="space-y-1.5">
						<ActivityImpactBar
							activity={item.title}
							level={normalizeImpactLevel(item.level)}
						/>
						{item.explanation && (
							<p className="text-[11px] text-neutral/50 leading-relaxed pl-0 lg:pl-40">
								{item.explanation}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}