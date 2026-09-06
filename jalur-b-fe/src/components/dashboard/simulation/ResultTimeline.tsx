import { statusStyles, type StatusVariant } from "../../../lib/status";

interface ResultTimelineProps {
	runwayMonths: number;
	targetMonths: number;
}

interface TimelinePoint {
	label: string;
	status: string;
	variant: StatusVariant;
}

function formatMonth(value: number): string {
	return value % 1 === 0
		? `${Math.round(value)}`
		: `${value.toFixed(1).replace(".", ",")}`;
}

export default function ResultTimeline({
	runwayMonths,
	targetMonths,
}: ResultTimelineProps) {
	const points: TimelinePoint[] = [
		{ label: "Day 0", status: "Pekerjaan berakhir.", variant: "neutral" },
	];

	if (runwayMonths >= 2) {
		const half = Math.max(1, Math.round(runwayMonths / 2));
		points.push({
			label: `Month ${formatMonth(half)}`,
			status: "Mulai masuk zona perhatian.",
			variant: "warning",
		});
	}

	points.push({
		label: `Month ${formatMonth(runwayMonths)}`,
		status: "Financial runway habis.",
		variant: "risk",
	});

	if (targetMonths >= 1) {
		points.push({
			label: `Target ${formatMonth(targetMonths)}`,
			status:
				targetMonths <= runwayMonths
					? "Target aman tercapai."
					: "Target aman (gap belum terpenuhi).",
			variant: targetMonths <= runwayMonths ? "healthy" : "insight",
		});
	}

	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
			<h3 className="text-sm font-bold text-neutral mb-6">
				Kalau income berhenti
			</h3>
			<div className="relative">
				<div className="absolute left-0 right-0 top-2 h-0.5 bg-neutral/10" />
				<div className="flex justify-between relative">
					{points.map((point) => {
						const s = statusStyles[point.variant];
						return (
							<div
								key={point.label}
								className="flex flex-col items-start max-w-[160px]">
								<div className={`w-4 h-4 rounded-full ${s.bar} mb-3`} />
								<p className={`text-xs font-bold ${s.text}`}>{point.label}</p>
								<p className="text-xs text-neutral/50 mt-1 leading-relaxed">
									{point.status}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}