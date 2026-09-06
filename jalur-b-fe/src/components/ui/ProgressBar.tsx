import { statusStyles, type StatusVariant } from "../../lib/status";

interface ProgressBarProps {
	value: number;
	variant: StatusVariant;
}

export default function ProgressBar({ value, variant }: ProgressBarProps) {
	const s = statusStyles[variant];
	return (
		<div className="w-full bg-neutral/10 h-1.5 rounded-full overflow-hidden">
			<div
				className={`h-full rounded-full ${s.bar} transition-all duration-500`}
				style={{ width: `${value}%` }}
			/>
		</div>
	);
}
