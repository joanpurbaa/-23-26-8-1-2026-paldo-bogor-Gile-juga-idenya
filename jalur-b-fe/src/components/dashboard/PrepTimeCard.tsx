import { Clock } from "lucide-react";

interface PrepTimeCardProps {
	months: number;
	description: string;
}

function formatMonths(months: number): string {
	if (!Number.isFinite(months) || months <= 0) return "Kurang dari 1 bulan";
	const years = Math.floor(months / 12);
	const rem = months % 12;
	if (years >= 1) return rem > 0 ? `${years} tahun ${rem} bulan` : `${years} tahun`;
	return `${Math.round(months)} bulan`;
}

export default function PrepTimeCard({
	months,
	description,
}: PrepTimeCardProps) {
	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
			<div className="flex items-center gap-3 mb-3">
				<div className="w-9 h-9 rounded-xl bg-neutral/5 flex items-center justify-center shrink-0">
					<Clock size={16} className="text-neutral/60" />
				</div>
				<div>
					<p className="text-xs text-neutral/50 font-medium">
						Estimasi Waktu Persiapan
					</p>
					<p className="text-lg font-bold text-neutral">{formatMonths(months)}</p>
				</div>
			</div>
			<p className="text-xs text-neutral/60 leading-relaxed">
				{description || "Belum ada perkiraan untuk saat ini."}
			</p>
		</div>
	);
}