import InsightCard from "./InsightCard";
import NextActionCard from "./NextActionCard";

export default function WeeklyFocusAndMission() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<InsightCard />
			<NextActionCard />
		</div>
	);
}
