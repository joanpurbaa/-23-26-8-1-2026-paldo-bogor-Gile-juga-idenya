import { Plus } from "lucide-react";

interface AddParameterCardProps {
	onClick?: () => void;
}

export default function AddParameterCard({ onClick }: AddParameterCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="rounded-2xl border border-dashed border-neutral/20 p-5 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition h-full min-h-[140px]">
			<div className="w-9 h-9 rounded-full bg-neutral/5 flex items-center justify-center">
				<Plus size={16} className="text-neutral/50" />
			</div>
			<p className="text-sm font-semibold text-neutral">Tambah Parameter</p>
			<p className="text-xs text-neutral/50">
				Misal: Asuransi, Investasi Jangka Panjang
			</p>
		</button>
	);
}
