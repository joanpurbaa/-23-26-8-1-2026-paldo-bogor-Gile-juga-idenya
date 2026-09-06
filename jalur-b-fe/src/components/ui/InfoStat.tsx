interface InfoStatProps {
	label: string;
	value: string;
	tone?: "default" | "risk";
	badge?: React.ReactNode;
}

export default function InfoStat({
	label,
	value,
	tone = "default",
	badge,
}: InfoStatProps) {
	return (
		<div>
			<p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wide mb-1">
				{label}
			</p>
			<div className="flex items-center gap-2">
				<p
					className={`text-base font-bold ${tone === "risk" ? "text-rose-600" : "text-neutral"}`}>
					{value}
				</p>
				{badge}
			</div>
		</div>
	);
}
