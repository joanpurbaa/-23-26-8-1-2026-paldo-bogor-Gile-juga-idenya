import { useEffect, useState } from "react";
import {
	PiggyBank,
	RefreshCcw,
	Wallet,
	TrendingUp,
	Coins,
} from "lucide-react";
import { financialApi } from "../../services/financial";
import type {
	FinancialAssetResponse,
	FinancialAssetType,
	LiquidityLevel,
} from "../../types/financial";
import ParameterCard from "../ui/ParameterCard";
import AddParameterCard from "../ui/AddParameterCard";
import Skeleton from "../ui/Skeleton";
import { PrimaryButton } from "../ui/PrimaryButton";
import type { FinanceTone } from "../../lib/status";

const iconMap = {
	PiggyBank,
	RefreshCcw,
	Wallet,
	TrendingUp,
	Coins,
};

const savingsTypes: { label: string; value: FinancialAssetType }[] = [
	{ label: "Tabungan Utama", value: "main_savings" },
	{ label: "Dana Darurat", value: "emergency_fund" },
	{ label: "Tabungan Jangka Panjang", value: "long_term_savings" },
	{ label: "Investasi", value: "investment" },
	{ label: "Lainnya", value: "other" },
];

const liquidityOptions: { label: string; value: LiquidityLevel }[] = [
	{ label: "Mudah dicairkan", value: "liquid" },
	{ label: "Perlu proses", value: "requires_process" },
	{ label: "Tidak mudah dicairkan", value: "illiquid" },
];

const assetTone: Record<FinancialAssetType, FinanceTone> = {
	main_savings: "indigo",
	emergency_fund: "amber",
	long_term_savings: "violet",
	investment: "rose",
	other: "slate",
};

const assetIcon: Record<FinancialAssetType, keyof typeof iconMap> = {
	main_savings: "PiggyBank",
	emergency_fund: "Wallet",
	long_term_savings: "RefreshCcw",
	investment: "TrendingUp",
	other: "Coins",
};

const inputClass =
	"w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-neutral placeholder:text-neutral/40";

function formatRupiah(raw: string | number): string {
	const n = Number(raw);
	return Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : "Rp 0";
}

function typeLabel(type: FinancialAssetType): string {
	return savingsTypes.find((t) => t.value === type)?.label ?? type;
}

function liquidityLabel(l: LiquidityLevel): string {
	return liquidityOptions.find((o) => o.value === l)?.label ?? l;
}

interface AssetForm {
	name: string;
	nominal: string;
	type: FinancialAssetType | "";
	liquidity: LiquidityLevel | "";
	note: string;
}

interface FinancialParametersProps {
	onChanged?: () => void | Promise<void>;
}

export default function FinancialParameters({
	onChanged,
}: FinancialParametersProps) {
	const [assets, setAssets] = useState<FinancialAssetResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form, setForm] = useState<AssetForm>({
		name: "",
		nominal: "",
		type: "",
		liquidity: "",
		note: "",
	});
	const [errors, setErrors] = useState<Record<string, boolean>>({});

	const [editing, setEditing] = useState<FinancialAssetResponse | null>(null);
	const [editForm, setEditForm] = useState<AssetForm>({
		name: "",
		nominal: "",
		type: "",
		liquidity: "",
		note: "",
	});
	const [editErrors, setEditErrors] = useState<Record<string, boolean>>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (active) setAssets(res.assets ?? []);
			})
			.catch(() => {
				if (active) setAssets([]);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const updateField = (key: keyof AssetForm, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const resetForm = () => {
		setForm({ name: "", nominal: "", type: "", liquidity: "", note: "" });
		setErrors({});
	};

	const closeModal = () => {
		resetForm();
		setIsModalOpen(false);
	};

	const handleSave = async () => {
		const nextErrors = {
			name: form.name.trim() === "",
			nominal: form.nominal.trim() === "",
			type: form.type === "",
			liquidity: form.liquidity === "",
		};
		setErrors(nextErrors);
		if (Object.values(nextErrors).some(Boolean)) return;

		setSaving(true);
		try {
			const created = await financialApi.createAsset({
				name: form.name.trim(),
				amount: Number(form.nominal),
				asset_type: form.type as FinancialAssetType,
				liquidity: form.liquidity as LiquidityLevel,
				note: form.note.trim() || null,
				currency: "IDR",
			});
			setAssets((prev) => [...prev, created]);
			closeModal();
			void onChanged?.();
		} catch {
			setErrors((prev) => ({ ...prev, api: true }));
		} finally {
			setSaving(false);
		}
	};

	const openEdit = (item: FinancialAssetResponse) => {
		setEditForm({
			name: item.name,
			nominal: String(Math.trunc(Number(item.amount))),
			type: item.asset_type,
			liquidity: item.liquidity,
			note: item.note ?? "",
		});
		setEditErrors({});
		setEditing(item);
	};

	const updateEditField = (key: keyof AssetForm, value: string) =>
		setEditForm((prev) => ({ ...prev, [key]: value }));

	const closeEdit = () => {
		setEditing(null);
		setEditForm({ name: "", nominal: "", type: "", liquidity: "", note: "" });
		setEditErrors({});
	};

	const handleEditSave = async () => {
		const next = {
			name: editForm.name.trim() === "",
			nominal: editForm.nominal.trim() === "",
		};
		setEditErrors(next);
		if (Object.values(next).some(Boolean)) return;
		if (!editing) return;

		setSaving(true);
		try {
			const updated = await financialApi.updateAsset(editing.id, {
				name: editForm.name.trim(),
				amount: Number(editForm.nominal),
				asset_type: (editForm.type as FinancialAssetType) || null,
				liquidity: (editForm.liquidity as LiquidityLevel) || null,
				note: editForm.note.trim() || null,
			});
			setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
			closeEdit();
			void onChanged?.();
		} catch {
			setEditErrors((prev) => ({ ...prev, api: true }));
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!editing) return;
		setSaving(true);
		try {
			await financialApi.deleteAsset(editing.id);
			setAssets((prev) => prev.filter((a) => a.id !== editing.id));
			closeEdit();
			void onChanged?.();
		} catch {
			setEditErrors((prev) => ({ ...prev, api: true }));
		} finally {
			setSaving(false);
		}
	};

	return (
		<div>
			<h3 className="text-sm font-bold text-neutral mb-3">Parameter Finansial</h3>
			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-5">
							<div className="flex items-start justify-between mb-4">
								<Skeleton className="w-9 h-9 rounded-xl" />
								<Skeleton className="w-4 h-4 rounded" />
							</div>
							<Skeleton className="h-3 w-24 mb-2" />
							<Skeleton className="h-5 w-36" />
							<Skeleton className="h-3 w-28 mt-2" />
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{assets.map((item) => (
						<ParameterCard
							key={item.id}
							label={item.name}
							value={formatRupiah(item.amount)}
							sublabel={`${typeLabel(item.asset_type)} · ${liquidityLabel(
								item.liquidity,
							)}`}
							icon={iconMap[assetIcon[item.asset_type]]}
							tone={assetTone[item.asset_type]}
							onEdit={() => openEdit(item)}
						/>
					))}
					<AddParameterCard onClick={() => setIsModalOpen(true)} />
				</div>
			)}

			{isModalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/40 backdrop-blur-sm"
					onClick={closeModal}>
					<div
						className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral/5"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-start justify-between mb-6">
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-neutral">
									Tambah Tabungan
								</h2>
								<p className="text-sm text-neutral/60 mt-1">
									Catat tabungan atau aset yang kamu miliki.
								</p>
							</div>
							<button
								type="button"
								onClick={closeModal}
								className="text-neutral/40 hover:text-neutral transition cursor-pointer">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-5">
							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Nama Tabungan <span className="text-red-500">*</span>
								</label>
								<input
									autoFocus
									type="text"
									value={form.name}
									onChange={(e) => updateField("name", e.target.value)}
									placeholder="Contoh: Tabungan BCA"
									className={inputClass}
								/>
								{errors.name && (
									<p className="text-xs text-red-500 mt-1">
										Nama tabungan wajib diisi.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Nominal <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									inputMode="numeric"
									value={
										form.nominal
											? `Rp ${form.nominal.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
											: "Rp 0"
									}
									onChange={(e) =>
										updateField(
											"nominal",
											e.target.value.replace(/\D/g, ""),
										)
									}
									placeholder="Rp 0"
									className={inputClass}
								/>
								{errors.nominal && (
									<p className="text-xs text-red-500 mt-1">
										Nominal wajib diisi.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Jenis Tabungan <span className="text-red-500">*</span>
								</label>
								<select
									value={form.type}
									onChange={(e) =>
										updateField("type", e.target.value)
									}
									className={inputClass}>
									<option value="" disabled>
										Pilih jenis tabungan
									</option>
									{savingsTypes.map((t) => (
										<option key={t.value} value={t.value}>
											{t.label}
										</option>
									))}
								</select>
								{errors.type && (
									<p className="text-xs text-red-500 mt-1">
										Jenis tabungan wajib dipilih.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Kemudahan Dicairkan <span className="text-red-500">*</span>
								</label>
								<select
									value={form.liquidity}
									onChange={(e) =>
										updateField("liquidity", e.target.value)
									}
									className={inputClass}>
									<option value="" disabled>
										Pilih kemudahan pencairan
									</option>
									{liquidityOptions.map((o) => (
										<option key={o.value} value={o.value}>
											{o.label}
										</option>
									))}
								</select>
								{errors.liquidity && (
									<p className="text-xs text-red-500 mt-1">
										Kemudahan dicairkan wajib dipilih.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Catatan
								</label>
								<textarea
									rows={3}
									value={form.note}
									onChange={(e) => updateField("note", e.target.value)}
									placeholder="Opsional"
									className={`${inputClass} resize-none`}
								/>
							</div>
							{errors.api && (
								<p className="text-xs text-red-500 font-medium">
									Gagal menyimpan tabungan. Silakan coba lagi.
								</p>
							)}
						</div>

						<div className="mt-8 pt-6 border-t border-neutral/10 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={closeModal}
								className="px-5 py-2.5 text-sm font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer">
								Batalkan
							</button>
							<PrimaryButton onClick={handleSave} disabled={saving}>
								{saving ? "Menyimpan..." : "Simpan Tabungan"}
							</PrimaryButton>
						</div>
					</div>
				</div>
			)}

			{editing && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/40 backdrop-blur-sm"
					onClick={closeEdit}>
					<div
						className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral/5"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-start justify-between mb-6">
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-neutral">
									Edit Aset
								</h2>
								<p className="text-sm text-neutral/60 mt-1">
									Perbarui data aset finansialmu.
								</p>
							</div>
							<button
								type="button"
								onClick={closeEdit}
								className="text-neutral/40 hover:text-neutral transition cursor-pointer">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-5">
							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Nama <span className="text-red-500">*</span>
								</label>
								<input
									autoFocus
									type="text"
									value={editForm.name}
									onChange={(e) =>
										updateEditField("name", e.target.value)
									}
									placeholder="Contoh: Tabungan BCA"
									className={inputClass}
								/>
								{editErrors.name && (
									<p className="text-xs text-red-500 mt-1">
										Nama wajib diisi.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Nilai <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									inputMode="numeric"
									value={
										editForm.nominal
											? `Rp ${editForm.nominal.replace(
													/\B(?=(\d{3})+(?!\d))/g,
													".",
												)}`
											: "Rp 0"
									}
									onChange={(e) =>
										updateEditField(
											"nominal",
											e.target.value.replace(/\D/g, ""),
										)
									}
									className={inputClass}
								/>
								{editErrors.nominal && (
									<p className="text-xs text-red-500 mt-1">
										Nilai wajib diisi.
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Jenis Tabungan
								</label>
								<select
									value={editForm.type}
									onChange={(e) =>
										updateEditField("type", e.target.value)
									}
									className={inputClass}>
									<option value="" disabled>
										Pilih jenis tabungan
									</option>
									{savingsTypes.map((t) => (
										<option key={t.value} value={t.value}>
											{t.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Kemudahan Dicairkan
								</label>
								<select
									value={editForm.liquidity}
									onChange={(e) =>
										updateEditField("liquidity", e.target.value)
									}
									className={inputClass}>
									<option value="" disabled>
										Pilih kemudahan pencairan
									</option>
									{liquidityOptions.map((o) => (
										<option key={o.value} value={o.value}>
											{o.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Catatan
								</label>
								<input
									type="text"
									value={editForm.note}
									onChange={(e) =>
										updateEditField("note", e.target.value)
									}
									placeholder="Opsional"
									className={inputClass}
								/>
							</div>
							{editErrors.api && (
								<p className="text-xs text-red-500 font-medium">
									Gagal menyimpan. Silakan coba lagi.
								</p>
							)}
						</div>

						<div className="mt-8 pt-6 border-t border-neutral/10 flex items-center justify-between gap-3">
							<button
								type="button"
								onClick={handleDelete}
								disabled={saving}
								className="px-4 py-2.5 text-sm font-medium rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition cursor-pointer">
								Hapus Aset
							</button>
							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={closeEdit}
									className="px-5 py-2.5 text-sm font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer">
									Batalkan
								</button>
								<PrimaryButton onClick={handleEditSave} disabled={saving}>
									{saving ? "Menyimpan..." : "Simpan Perubahan"}
								</PrimaryButton>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
