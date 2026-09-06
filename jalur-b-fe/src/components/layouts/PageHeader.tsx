import type { ReactNode } from "react";

interface PageHeaderProps {
	title: string;
	subtitle: string;
	action?: ReactNode;
}

export default function PageHeader({
	title,
	subtitle,
	action,
}: PageHeaderProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
			<div>
				<h1 className="text-2xl sm:text-3xl font-bold text-neutral">{title}</h1>
				<p className="text-sm text-neutral/60 mt-1">{subtitle}</p>
			</div>
			{action}
		</div>
	);
}
