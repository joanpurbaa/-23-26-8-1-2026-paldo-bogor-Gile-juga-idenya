import { useEffect, useState } from "react";
import {
	RefreshCw,
	CheckCircle2,
	Circle,
	Hourglass,
	Sparkles,
	AlertTriangle,
} from "lucide-react";
import { ApiError } from "../../../types/api";

const loadingSteps = [
	"Menganalisis kondisi karier",
	"Menghitung financial runway",
	"Memetakan peluang karier alternatif",
	"Mengidentifikasi skill gap",
	"Menyusun rencana pemulihan",
];

interface SimulationLoadingProps {
	onRun: () => Promise<unknown>;
	onSuccess: () => void;
	onBack: () => void;
	onRetry: () => void;
}

export default function SimulationLoading({
	onRun,
	onSuccess,
	onBack,
	onRetry,
}: SimulationLoadingProps) {
	const steps = loadingSteps;
	const [activeIndex, setActiveIndex] = useState(0);
	const [runState, setRunState] = useState<"running" | "done" | "error">(
		"running",
	);
	const [runError, setRunError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		onRun()
			.then(() => {
				if (active) setRunState("done");
			})
			.catch((error) => {
				if (!active) return;
				setRunState("error");
				setRunError(
					error instanceof ApiError
						? error.message
						: "Terjadi kesalahan yang tidak diketahui.",
				);
			});
		return () => {
			active = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (activeIndex < steps.length) {
			const stepTimer = setTimeout(
				() => setActiveIndex((i) => i + 1),
				500,
			);
			return () => clearTimeout(stepTimer);
		}
	}, [activeIndex, steps.length]);

	useEffect(() => {
		if (runState === "done" && activeIndex >= steps.length) {
			const finishTimer = setTimeout(onSuccess, 400);
			return () => clearTimeout(finishTimer);
		}
	}, [runState, activeIndex, steps.length, onSuccess]);

	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-md p-10 flex flex-col items-center text-center max-w-2xl mx-auto">
			<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 relative">
				<RefreshCw size={22} className="text-primary animate-spin" />
				<Sparkles size={12} className="text-primary absolute -top-1 -right-1" />
			</div>
			<h2 className="text-2xl font-bold text-neutral mb-2">
				Jalur B sedang menjalankan simulasi…
			</h2>
			<p className="text-sm text-neutral/60 mb-8">
				Menghubungkan kondisi karier dan finansialmu.
			</p>

			<div className="w-full space-y-3">
				{steps.map((step, index) => {
					const isDone = index < activeIndex;
					const isActive = index === activeIndex;
					return (
						<div
							key={step}
							className={`flex items-center gap-3 rounded-xl p-4 border-2 transition ${
								isActive
									? "border-primary bg-primary/5"
									: isDone
										? "border-transparent bg-neutral/5"
										: "border-transparent bg-transparent"
							}`}>
							{isDone ? (
								<CheckCircle2 size={18} className="text-primary" />
							) : (
								<Circle
									size={18}
									className={isActive ? "text-primary" : "text-neutral/20"}
								/>
							)}
							<span
								className={`text-sm font-semibold ${
									isActive || isDone ? "text-neutral" : "text-neutral/30"
								}`}>
								{step}
							</span>
						</div>
					);
				})}
			</div>

			{runState === "error" && runError && (
				<div className="w-full mt-8 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-left">
					<p className="text-xs font-semibold text-red-600 mb-0.5">
						Gagal menjalankan simulasi
					</p>
					<p className="text-xs text-red-500">{runError}</p>
					<div className="flex items-center gap-2 mt-4">
						<button
							type="button"
							onClick={onRetry}
							className="px-4 py-2 text-xs font-semibold rounded-full bg-primary text-white hover:opacity-90 transition cursor-pointer">
							Coba Lagi
						</button>
						<button
							type="button"
							onClick={onBack}
							className="px-4 py-2 text-xs font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer">
							Kembali ke Konfigurasi
						</button>
					</div>
				</div>
			)}

			{runState !== "error" && (
				<div className="flex items-center gap-1.5 mt-8">
					{runState === "done" ? (
						<CheckCircle2 size={12} className="text-primary" />
					) : (
						<Hourglass size={12} className="text-neutral/40" />
					)}
					<p className="text-xs text-neutral/50">
						{runState === "done"
							? "Simulasi selesai."
							: "Ini hanya membutuhkan beberapa detik."}
					</p>
				</div>
			)}

			{runState === "error" && (
				<div className="flex items-center gap-1.5 mt-8">
					<AlertTriangle size={12} className="text-neutral/40" />
					<p className="text-xs text-neutral/50">
						Kamu bisa mencoba lagi atau menyesuaikan konfigurasi.
					</p>
				</div>
			)}
		</div>
	);
}