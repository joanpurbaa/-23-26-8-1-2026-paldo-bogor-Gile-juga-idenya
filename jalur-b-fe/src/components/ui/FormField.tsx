interface FormFieldProps {
	label: string;
	defaultValue: string;
}

export default function FormField({ label, defaultValue }: FormFieldProps) {
	return (
		<div className="mb-4">
			<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
				{label}
			</label>
			<input
				type="text"
				defaultValue={defaultValue}
				className="w-full text-sm text-neutral bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
			/>
		</div>
	);
}
