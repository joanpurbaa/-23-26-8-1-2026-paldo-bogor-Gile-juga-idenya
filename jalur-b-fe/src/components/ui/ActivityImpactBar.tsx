interface ActivityImpactBarProps {
	activity: string;
	level: "HIGH" | "MEDIUM" | "LOW";
}

const levelConfig = {
	HIGH: { width: 92, bar: "bg-primary" },
	MEDIUM: { width: 62, bar: "bg-primary/50" },
	LOW: { width: 20, bar: "bg-neutral/20" },
};

export default function ActivityImpactBar({
	activity,
	level,
}: ActivityImpactBarProps) {
	const config = levelConfig[level];

	return (
		<div className="flex items-center gap-4">
			<span className="text-sm text-neutral/70 w-40 shrink-0">{activity}</span>
			<div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full ${config.bar}`}
					style={{ width: `${config.width}%` }}
				/>
			</div>
			<span className="text-[11px] font-semibold text-neutral/50 w-16 text-right shrink-0">
				{level}
			</span>
		</div>
	);
}
