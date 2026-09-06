import { LayoutGrid, Info, Lock, ArrowRight } from "lucide-react";
import { PrimaryButton } from "../../ui/PrimaryButton";
import JourneyTimeline from "./JourneyTimeline";

interface SimulationIntroProps {
	onStart: () => void;
}

export default function SimulationIntro({ onStart }: SimulationIntroProps) {
	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-md p-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
				<div className="flex flex-col justify-center">
					<span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 bg-neutral/5 text-neutral/60 text-xs font-semibold rounded-lg mb-4">
						<LayoutGrid size={13} />
						Modul Simulasi
					</span>
					<h2 className="text-2xl font-bold text-neutral mb-3">
						What If I Get Fired?
					</h2>
					<p className="text-sm text-neutral/60 leading-relaxed mb-6 max-w-md">
						Cari tahu berapa lama kamu bisa bertahan, seberapa siap kamu kembali
						bekerja, dan apa yang perlu kamu persiapkan mulai sekarang.
					</p>
					<PrimaryButton icon={<ArrowRight size={14} />} onClick={onStart}>
						Jalankan Simulasi
					</PrimaryButton>

					<div className="flex items-start gap-2 mt-6">
						<Info size={14} className="text-primary shrink-0 mt-0.5" />
						<p className="text-xs text-neutral/50 leading-relaxed">
							Simulasi menggunakan data karier dan finansial yang sudah kamu simpan.
						</p>
					</div>
					<div className="flex items-start gap-2 mt-2">
						<Lock size={14} className="text-neutral/40 shrink-0 mt-0.5" />
						<p className="text-xs text-neutral/50 leading-relaxed">
							Data simulasi bersifat pribadi dan tidak mengubah data karier atau
							finansialmu.
						</p>
					</div>
				</div>

				<JourneyTimeline />
			</div>
		</div>
	);
}
