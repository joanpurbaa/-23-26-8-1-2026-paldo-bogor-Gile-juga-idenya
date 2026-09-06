import { statusStyles, type StatusVariant } from "../../lib/status";

interface StatusBadgeProps {
	label: string;
	variant: StatusVariant;
}

export default function StatusBadge({ label, variant }: StatusBadgeProps) {
	const s = statusStyles[variant];
	return (
		<span
			className={`px-3 py-1 text-xs font-semibold rounded-full border ${s.bg} ${s.text} ${s.border}`}>
			{label}
		</span>
	);
}
