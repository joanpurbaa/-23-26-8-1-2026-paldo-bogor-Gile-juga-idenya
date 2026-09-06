import { User, BarChart3, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CareerPathNode from "./CareerPathNode";

const roleIcons: LucideIcon[] = [TrendingUp, BarChart3];

const SLOTS = [
	{ top: 18, left: 76 },
	{ top: 82, left: 24 },
	{ top: 84, left: 76 },
	{ top: 16, left: 22 },
	{ top: 42, left: 88 },
	{ top: 60, left: 88 },
];

function positionFor(index: number): { top: number; left: number } {
	if (index < SLOTS.length) return SLOTS[index];
	const angle = -Math.PI / 2 + ((index - SLOTS.length) * 2 * Math.PI) / 8;
	return {
		top: Math.max(12, Math.min(88, 50 + Math.sin(angle) * 34)),
		left: Math.max(10, Math.min(90, 50 + Math.cos(angle) * 36)),
	};
}

interface CareerPathMapProps {
	currentRoleName: string;
	roles: { name: string; match: number }[];
}

export default function CareerPathMap({
	currentRoleName,
	roles,
}: CareerPathMapProps) {
	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 relative h-[480px] overflow-hidden">
			<svg
				className="absolute inset-0 w-full h-full"
				viewBox="0 0 100 100"
				preserveAspectRatio="none">
				{roles.map((role, index) => {
					const isSelected = index === 0;
					const pos = positionFor(index);
					return (
						<line
							key={role.name}
							x1={50}
							y1={50}
							x2={pos.left}
							y2={pos.top}
							stroke={isSelected ? "#4F46E5" : "#D4D4D8"}
							strokeWidth={isSelected ? 0.35 : 0.25}
							strokeDasharray={isSelected ? undefined : "1.2 1.2"}
							className={
								isSelected
									? undefined
									: "animate-dash-flow motion-reduce:animate-none"
							}
							vectorEffect="non-scaling-stroke"
						/>
					);
				})}
			</svg>

			<CareerPathNode
				variant="center"
				icon={User}
				title={currentRoleName}
				subtitle="Peran Saat Ini"
				style={{ top: "50%", left: "50%" }}
			/>

			{roles.map((role, index) => {
				const pos = positionFor(index);
				return (
					<CareerPathNode
						key={role.name}
						icon={roleIcons[index % roleIcons.length]}
						title={role.name}
						match={role.match}
						selected={index === 0}
						float={index === 0 ? "animate-float" : "animate-float-slow"}
						style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
					/>
				);
			})}
		</div>
	);
}