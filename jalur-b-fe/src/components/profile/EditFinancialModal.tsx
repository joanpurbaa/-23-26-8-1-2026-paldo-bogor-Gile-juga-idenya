import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import { financialApi } from "../../services/financial";

interface EditFinancialModalProps {
	open: boolean;
	onClose: () => void;
	onSaved?: () => void;
}

const inputClass =
	"w-full text-sm text-neutral bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30";

function formatNumber(raw: string): string {
	if (!raw) return "";
	return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function EditFinancialModal({
	open,
	onClose,
	onSaved,
}: EditFinancialModalProps) {
	const [essential, setEssential] = useState("");
	const [debt, setDebt] = useState("");
	const [dependents, setDependents] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!open) return;
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (!active) return;
				setEssential(String(Math.trunc(Number(res.profile.monthly_essential_expenses))));
				if (res.profile.monthly_debt_payment)
					setDebt(String(Math.trunc(Number(res.profile.monthly_debt_payment))));
				if (res.profile.dependents != null)
					setDependents(String(res.profile.dependents));
			})
			.catch(() => {
				if (!active) return;
				setEssential("");
				setDebt("");
				setDependents("");
			});
		return () => {
			active = false;
		};
	}, [open]);

	const handleSave = async () => {
		const essentialNum = Number(essential.replace(/\D/g, ""));
		if (!essential.trim() || !Number.isFinite(essentialNum) || essentialNum <= 0)
			return;
		setSaving(true);
		setError(false);
		try {
			await financialApi.upsertProfile({
				monthly_essential_expenses: essentialNum,
				monthly_debt_payment: Number(debt.replace(/\D/g, "")) || 0,
				dependents: Number(dependents.replace(/\D/g, "")) || 0,
				currency: "IDR",
			});
			onSaved?.();
			onClose();
		} catch {
			setError(true);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal open={open} onClose={onClose} title="Edit Data Finansial">
			<div>
				<div className="mb-4">
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Pengeluaran Esensial Bulanan (Rp)
						</label>
						<input
							type="text"
							inputMode="numeric"
							value={essential ? `Rp ${formatNumber(essential)}` : "Rp 0"}
							onChange={(e) =>
								setEssential(e.target.value.replace(/\D/g, ""))
							}
							className={inputClass}
						/>
					</div>
					<div className="mb-4">
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Cicilan Utang Bulanan (Rp)
						</label>
						<input
							type="text"
							inputMode="numeric"
							value={debt ? `Rp ${formatNumber(debt)}` : "Rp 0"}
							onChange={(e) => setDebt(e.target.value.replace(/\D/g, ""))}
							className={inputClass}
						/>
					</div>
					<div className="mb-4">
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Jumlah Tanggungan
						</label>
						<input
							type="text"
							inputMode="numeric"
							value={dependents}
							onChange={(e) =>
								setDependents(e.target.value.replace(/\D/g, ""))
							}
							className={inputClass}
						/>
					</div>
					<div className="mb-4">
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Mata Uang
						</label>
						<input type="text" value="IDR" disabled className={inputClass} />
					</div>
					{error && (
						<p className="text-xs text-red-500 font-medium mb-2">
							Gagal menyimpan data. Silakan coba lagi.
						</p>
					)}
			</div>
			<div className="flex justify-end gap-2.5 mt-2">
				<SecondaryButton onClick={onClose}>Batal</SecondaryButton>
				<PrimaryButton onClick={handleSave} disabled={saving}>
					{saving ? "Menyimpan..." : "Simpan"}
				</PrimaryButton>
			</div>
		</Modal>
	);
}
