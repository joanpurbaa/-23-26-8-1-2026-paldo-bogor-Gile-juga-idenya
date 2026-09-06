import { Calendar, ImageIcon, Pencil, Sparkles, Trash2 } from "lucide-react";

interface EvidenceCardProps {
	category: string;
	title: string;
	role: string;
	description: string;
	impactLabel: string;
	impactValue: string;
	date: string;
	aiGenerated?: boolean;
	attachmentUrl?: string | null;
	onEdit?: () => void;
	onDelete?: () => void;
}

export default function EvidenceCard({
	category,
	title,
	role,
	description,
	impactLabel,
	impactValue,
	date,
	aiGenerated,
	attachmentUrl,
	onEdit,
	onDelete,
}: EvidenceCardProps) {
	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm overflow-hidden flex flex-col">
			{attachmentUrl ? (
				<img
					src={attachmentUrl}
					alt={title}
					className="h-32 w-full object-cover"
				/>
			) : (
				<div className="h-32 w-full flex items-center justify-center bg-neutral/5">
					<div className="flex flex-col items-center gap-1.5 text-neutral/40">
						<ImageIcon size={18} />
						<span className="text-[11px] font-medium">Tanpa Lampiran</span>
					</div>
				</div>
			)}

			<div className="p-6 flex flex-col flex-1">
				<div className="flex items-start justify-between mb-4">
					<span className="px-2.5 py-1 bg-neutral/5 text-neutral/60 text-[11px] font-semibold rounded-lg">
						{category}
					</span>
					<div className="flex items-center gap-1">
						{aiGenerated && <Sparkles size={14} className="text-primary/50" />}
						{onEdit && (
							<button
								type="button"
								onClick={onEdit}
								title="Edit bukti"
								className="p-1.5 rounded-lg text-neutral/40 hover:text-primary hover:bg-primary/5 transition cursor-pointer">
								<Pencil size={14} />
							</button>
						)}
						{onDelete && (
							<button
								type="button"
								onClick={onDelete}
								title="Hapus bukti"
								className="p-1.5 rounded-lg text-neutral/40 hover:text-red-500 hover:bg-red-50 transition cursor-pointer">
								<Trash2 size={14} />
							</button>
						)}
					</div>
				</div>

				<h4 className="text-base font-bold text-neutral mb-1">{title}</h4>
				<p className="text-xs font-semibold text-primary mb-3">{role}</p>
				<p className="text-sm text-neutral/60 leading-relaxed mb-4">{description}</p>

				<div className="bg-neutral/5 rounded-xl p-4 mb-4">
					<p className="text-[11px] text-neutral/50 font-medium mb-1">
						{impactLabel}
					</p>
					<p className="text-sm font-bold text-neutral">{impactValue}</p>
				</div>

				<div className="flex items-center gap-1.5 text-xs text-neutral/50 pt-4 border-t border-neutral/10 mt-auto">
					<Calendar size={13} />
					<span>{date}</span>
				</div>
			</div>
		</div>
	);
}