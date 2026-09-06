import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-neutral/40" onClick={onClose} />
			<div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
				<div className="flex items-center justify-between mb-5">
					<h3 className="text-base font-bold text-neutral">{title}</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-neutral/40 hover:text-neutral transition">
						<X size={18} />
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
