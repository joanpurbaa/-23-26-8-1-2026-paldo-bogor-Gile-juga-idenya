import { useState } from "react";
import PageHeader from "../layouts/PageHeader";
import SimulationIntro from "./simulation/SimulationIntro";
import SimulationSetup from "./simulation/SimulationSetup";
import SimulationLoading from "./simulation/SimulationLoading";
import SimulationResult from "./simulation/SimulationResult";
import { layoffSimulationApi } from "../../services/layoffSimulation";
import type {
	LayoffScenario,
	LayoffSimulationResult,
} from "../../types/layoffSimulation";

type SimulationStep = "intro" | "setup" | "loading" | "result";

const scenarioOptions: {
	id: LayoffScenario;
	label: string;
	description: string;
}[] = [
	{ id: "tomorrow", label: "Besok", description: "Impact maksimal" },
	{ id: "one_month", label: "1 Bulan Lagi", description: "Ada waktu bersiap" },
	{ id: "three_months", label: "3 Bulan Lagi", description: "Transisi terkontrol" },
];

export default function Simulasi() {
	const [step, setStep] = useState<SimulationStep>("intro");
	const [selectedScenario, setSelectedScenario] =
		useState<LayoffScenario>("tomorrow");
	const [result, setResult] = useState<LayoffSimulationResult | null>(null);
	const [runKey, setRunKey] = useState(0);

	const headerContent: Record<
		SimulationStep,
		{ title: string; subtitle: string }
	> = {
		intro: {
			title: "Kalau besok kamu kehilangan pekerjaan, apa yang terjadi?",
			subtitle:
				"Simulasikan kondisi karier dan finansialmu berdasarkan data yang sudah kamu masukkan ke Jalur B.",
		},
		setup: {
			title: "Siapkan simulasimu",
			subtitle:
				"Kami akan menggunakan kondisi kamu saat ini sebagai titik awal untuk memproyeksikan berbagai skenario krisis.",
		},
		loading: {
			title: "Menjalankan simulasi",
			subtitle: "Mohon tunggu sebentar.",
		},
		result: {
			title: "Kalau besok kamu kehilangan pekerjaan…",
			subtitle: "Berdasarkan kondisi kamu saat ini, ini yang kemungkinan terjadi.",
		},
	};

	const runSimulation = async () => {
		const res = await layoffSimulationApi.create(selectedScenario);
		setResult(res);
	};

	return (
		<div>
			<PageHeader
				title={headerContent[step].title}
				subtitle={headerContent[step].subtitle}
			/>

			{step === "intro" && <SimulationIntro onStart={() => setStep("setup")} />}
			{step === "setup" && (
				<SimulationSetup
					selectedScenario={selectedScenario}
					scenarioOptions={scenarioOptions}
					onSelectScenario={setSelectedScenario}
					onStart={() => setStep("loading")}
				/>
			)}
			{step === "loading" && (
				<SimulationLoading
					key={runKey}
					onRun={runSimulation}
					onSuccess={() => setStep("result")}
					onBack={() => setStep("setup")}
					onRetry={() => setRunKey((k) => k + 1)}
				/>
			)}
			{step === "result" && result && <SimulationResult result={result} />}
		</div>
	);
}