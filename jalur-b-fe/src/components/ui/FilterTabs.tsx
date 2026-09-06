interface FilterTabsProps {
	options: string[];
	active: string;
	onChange: (value: string) => void;
}

export default function FilterTabs({
	options,
	active,
	onChange,
}: FilterTabsProps) {
	return (
		<div className="flex flex-wrap gap-2 mb-6">
			{options.map((option) => (
				<button
					key={option}
					type="button"
					onClick={() => onChange(option)}
					className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
						active === option
							? "bg-neutral text-white border-neutral"
							: "bg-white text-neutral/60 border-neutral/10 hover:bg-neutral/5"
					}`}>
					{option}
				</button>
			))}
		</div>
	);
}
