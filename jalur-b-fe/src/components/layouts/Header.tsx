import { Bell, HelpCircle } from "lucide-react";

export default function Header() {
	return (
		<header className="flex items-center justify-end gap-3 mb-6">
			<button
				type="button"
				className="p-2 text-neutral/60 hover:text-neutral hover:bg-neutral/5 rounded-xl transition">
				<Bell size={18} />
			</button>

			<button
				type="button"
				className="p-2 text-neutral/60 hover:text-neutral hover:bg-neutral/5 rounded-xl transition">
				<HelpCircle size={18} />
			</button>

			<div className="w-8 h-8 rounded-full bg-neutral/20 border border-neutral/10 overflow-hidden ml-1">
				<img
					src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
					alt="User Avatar"
					className="w-full h-full object-cover"
				/>
			</div>
		</header>
	);
}
