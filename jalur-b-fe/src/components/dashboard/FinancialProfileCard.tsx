import { useEffect, useState } from "react";
import { Wallet, CreditCard, Users, Coins } from "lucide-react";
import ParameterCard from "../ui/ParameterCard";
import Skeleton from "../ui/Skeleton";
import { SecondaryButton } from "../ui/PrimaryButton";
import { financialApi } from "../../services/financial";
import type { FinancialProfileResponse } from "../../types/financial";
import type { FinanceTone } from "../../lib/status";
import { EditFinancialModal } from "../profile/EditFinancialModal";

function formatRupiah(raw?: string | null): string {
	if (!raw) return "-";
	const n = Number(raw);
	return Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : "-";
}

const cardConfig: {
	label: string;
	icon: typeof Wallet;
	tone: FinanceTone;
	value: (p: FinancialProfileResponse) => string;
}[] = [
	{
		label: "Pengeluaran Esensial / Bulan",
		icon: Wallet,
		tone: "amber",
		value: (p) => formatRupiah(p.monthly_essential_expenses),
	},
	{
		label: "Cicilan Utang / Bulan",
		icon: CreditCard,
		tone: "rose",
		value: (p) => formatRupiah(p.monthly_debt_payment),
	},
	{
		label: "Jumlah Tanggungan",
		icon: Users,
		tone: "violet",
		value: (p) => (p.dependents != null ? String(p.dependents) : "-"),
	},
	{
		label: "Mata Uang",
		icon: Coins,
		tone: "slate",
		value: (p) => p.currency || "IDR",
	},
];

interface FinancialProfileCardProps {
	onChanged?: () => void | Promise<void>;
}

export default function FinancialProfileCard({
	onChanged,
}: FinancialProfileCardProps) {
	const [profile, setProfile] = useState<FinancialProfileResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [editOpen, setEditOpen] = useState(false);

	const load = async () => {
		try {
			const res = await financialApi.getOrCreate();
			setProfile(res.profile ?? null);
		} catch {
			setProfile(null);
		}
	};

	useEffect(() => {
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (active) setProfile(res.profile ?? null);
			})
			.catch(() => {
				if (active) setProfile(null);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const handleSaved = async () => {
		await load();
		void onChanged?.();
	};

	return (
		<div className="mb-8">
			<div className="flex items-start justify-between gap-4 mb-3">
				<div>
					<h3 className="text-sm font-bold text-neutral">
						Pengeluaran &amp; Tanggungan
					</h3>
					<p className="text-xs text-neutral/50 mt-0.5">
						Data ini memengaruhi perhitungan financial runway.
					</p>
				</div>
				<SecondaryButton onClick={() => setEditOpen(true)}>
					Edit Data Finansial
				</SecondaryButton>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-5">
							<div className="flex items-start justify-between mb-4">
								<Skeleton className="w-9 h-9 rounded-xl" />
								<Skeleton className="w-4 h-4 rounded" />
							</div>
							<Skeleton className="h-3 w-24 mb-2" />
							<Skeleton className="h-5 w-32" />
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{profile
						? cardConfig.map(({ label, icon, tone, value }) => (
								<ParameterCard
									key={label}
									label={label}
									value={value(profile)}
									icon={icon}
									tone={tone}
									onEdit={() => setEditOpen(true)}
								/>
							))
						: null}
				</div>
			)}

			<EditFinancialModal
				open={editOpen}
				onClose={() => setEditOpen(false)}
				onSaved={() => void handleSaved()}
			/>
		</div>
	);
}