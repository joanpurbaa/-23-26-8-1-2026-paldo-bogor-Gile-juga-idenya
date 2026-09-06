import { AlertTriangle } from "lucide-react";
import { SecondaryButton } from "../ui/PrimaryButton";

interface EarlyWarningCardProps {
	description?: string;
}

export default function EarlyWarningCard({ description }: EarlyWarningCardProps) {
	return (
		<div className="bg-white rounded-2xl p-6 border border-neutral/5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
			<div className="flex items-start gap-4">
				<div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
					<AlertTriangle size={18} className="text-rose-600" />
				</div>
				<div>
					<p className="text-xs font-semibold text-neutral/50 uppercase tracking-wider mb-1">
						Early Warning
					</p>
					<h4 className="text-sm font-bold text-neutral mb-1">
						Perhatian Dini
					</h4>
					<p className="text-xs text-neutral/60 leading-relaxed max-w-xl">
						{description || "Belum ada perhatian dini untuk saat ini."}
					</p>
				</div>
			</div>
			<a href="/dashboard/simulasi">
				<SecondaryButton>Lihat dampaknya ke pekerjaanmu</SecondaryButton>
			</a>
		</div>
	);
}