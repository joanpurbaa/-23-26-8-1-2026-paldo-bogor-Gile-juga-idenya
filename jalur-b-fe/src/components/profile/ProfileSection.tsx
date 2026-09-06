import type { ReactNode } from "react";

interface ProfileSectionProps {
	title: string;
	description?: string;
	action?: ReactNode;
	children: ReactNode;
}

export default function ProfileSection({
	title,
	description,
	action,
	children,
}: ProfileSectionProps) {
	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h3 className="text-sm font-bold text-neutral">{title}</h3>
					{description && (
						<p className="text-xs text-neutral/50 mt-0.5">{description}</p>
					)}
				</div>
				{action}
			</div>
			<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
				{children}
			</div>
		</div>
	);
}
