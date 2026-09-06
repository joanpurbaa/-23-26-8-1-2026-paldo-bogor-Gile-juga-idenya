import { Ban, Wallet, Search, GitFork, Briefcase } from "lucide-react";
import { statusStyles, type StatusVariant } from "../../../lib/status";

const iconMap = { Ban, Wallet, Search, GitFork, Briefcase };

const journey: {
	id: string;
	title: string;
	description: string;
	icon: keyof typeof iconMap;
	variant: StatusVariant;
}[] = [
	{
		id: "phk",
		title: "PHK",
		description: "Income berhenti",
		icon: "Ban",
		variant: "risk",
	},
	{
		id: "runway",
		title: "Financial Runway",
		description: "Mengukur daya tahan dana darurat",
		icon: "Wallet",
		variant: "neutral",
	},
	{
		id: "job-search",
		title: "Cari Pekerjaan",
		description: "Kesiapan skill & CV",
		icon: "Search",
		variant: "insight",
	},
	{
		id: "pivot",
		title: "Career Pivot",
		description: "Eksplorasi opsi jalur lain",
		icon: "GitFork",
		variant: "insight",
	},
	{
		id: "reemployed",
		title: "Kembali Bekerja",
		description: "Mendapatkan income kembali",
		icon: "Briefcase",
		variant: "healthy",
	},
];

export default function JourneyTimeline() {
	return (
		<div className="bg-neutral/5 rounded-2xl p-6 relative">
			<p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wide mb-5">
				Simulation Journey
			</p>
			<div className="relative">
				<div className="absolute left-[17px] top-2 bottom-2 border-l-2 border-dashed border-neutral/15" />
				<div className="space-y-5">
					{journey.map((item) => {
						const Icon = iconMap[item.icon];
						const s = statusStyles[item.variant];
						return (
							<div key={item.id} className="flex items-start gap-4 relative">
								<div
									className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${s.iconBg}`}>
									<Icon size={16} className={s.text} />
								</div>
								<div>
									<p className="text-sm font-bold text-neutral">{item.title}</p>
									<p className="text-xs text-neutral/50 mt-0.5">{item.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
