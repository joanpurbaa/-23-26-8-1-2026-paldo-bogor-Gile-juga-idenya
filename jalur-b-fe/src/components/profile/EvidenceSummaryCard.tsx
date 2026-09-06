import { useEffect, useState } from "react";
import { Calendar, Sparkles } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { evidenceApi } from "../../services/evidence";
import { evidenceTypeLabels, formatEvidenceDate } from "../../lib/evidence";
import type { EvidenceItemResponse } from "../../types/evidence";

interface EvidenceSummaryCardProps {
	onSeeMore: () => void;
}

export default function EvidenceSummaryCard({
	onSeeMore,
}: EvidenceSummaryCardProps) {
	const [items, setItems] = useState<EvidenceItemResponse[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		evidenceApi
			.list({ limit: 2 })
			.then((res) => {
				if (active) {
					setItems(res.items);
					setTotal(res.total);
				}
			})
			.catch(() => {
				// data tidak tersedia — render sebagai kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	if (loading) {
		return (
			<div>
				<Skeleton className="h-4 w-48 mb-4" />
				<div className="space-y-3">
					<Skeleton className="h-16 w-full rounded-xl" />
					<Skeleton className="h-16 w-full rounded-xl" />
				</div>
			</div>
		);
	}

	if (total === 0) {
		return (
			<div className="text-center py-6">
				<p className="text-sm font-semibold text-neutral mb-1">
					Belum ada bukti karier
				</p>
				<p className="text-xs text-neutral/50 mb-4 max-w-xs mx-auto">
					Tambahkan project, pencapaian, atau sertifikat untuk memperkuat profil
					kariermu.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="text-xs font-semibold text-primary hover:opacity-70 transition">
					Lengkapi sekarang →
				</button>
			</div>
		);
	}

	return (
		<div>
			<p className="text-sm text-neutral mb-4">
				Kamu memiliki{" "}
				<span className="font-bold text-primary">{total} bukti karier</span>
			</p>

			<div className="space-y-3 mb-5">
				{items.map((item) => (
					<div key={item.id} className="bg-neutral/5 rounded-xl p-4">
						<div className="flex items-center justify-between mb-1.5">
							<span className="text-xs font-semibold text-neutral/50">
								{evidenceTypeLabels[item.evidence_type]}
							</span>
							{item.ai_generated && (
								<Sparkles size={12} className="text-primary/50" />
							)}
						</div>
						<p className="text-sm font-bold text-neutral">{item.title}</p>
						<div className="flex items-center gap-1.5 text-xs text-neutral/50 mt-1.5">
							<Calendar size={12} />
							<span>{formatEvidenceDate(item.evidence_date)}</span>
						</div>
					</div>
				))}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition">
				Lihat Semua Bukti →
			</button>
		</div>
	);
}