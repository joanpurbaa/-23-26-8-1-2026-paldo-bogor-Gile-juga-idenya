import type { LayoffScenario } from "../../../types/layoffSimulation";

export interface ScenarioOption {
	id: LayoffScenario;
	label: string;
	description: string;
}

interface ScenarioPickerProps {
	selected: LayoffScenario;
	options: ScenarioOption[];
	onSelect: (id: LayoffScenario) => void;
}

export default function ScenarioPicker({
	selected,
	options,
	onSelect,
}: ScenarioPickerProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
			{options.map((option) => {
				const active = option.id === selected;
				return (
					<button
						key={option.id}
						type="button"
						onClick={() => onSelect(option.id)}
						className={`rounded-xl p-5 text-center transition border-2 ${
							active
								? "border-primary bg-white shadow-sm"
								: "border-transparent bg-white/60 hover:bg-white"
						}`}>
						<p className="text-sm font-bold text-neutral">{option.label}</p>
						<p className="text-xs text-neutral/50 mt-1">{option.description}</p>
					</button>
				);
			})}
		</div>
	);
}