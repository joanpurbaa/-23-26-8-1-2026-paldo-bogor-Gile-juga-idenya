import { useState } from "react";
import Modal from "../ui/Modal";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import { profileApi } from "../../services/profile";
import { ApiError } from "../../types/api";
import type { OnboardingProfile } from "../../types/onboarding";

interface EditCareerModalProps {
	open: boolean;
	onClose: () => void;
	onSaved: (profile: OnboardingProfile) => void;
	profile?: OnboardingProfile | null;
}

export function EditCareerModal({
	open,
	onClose,
	onSaved,
	profile,
}: EditCareerModalProps) {
	const [role, setRole] = useState(profile?.current_role_name || "");
	const [months, setMonths] = useState(
		profile?.work_duration_months != null ? String(profile.work_duration_months) : "",
	);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const handleSave = async () => {
		const parsed = months === "" ? null : Number(months);
		if (months !== "" && (Number.isNaN(parsed) || (parsed as number) < 0)) {
			setError("Lama bekerja harus berupa angka bulan yang valid.");
			return;
		}
		setSaving(true);
		setError("");
		try {
			const res = await profileApi.update({
				current_role_name: role.trim() || null,
				work_duration_months: parsed,
			});
			onSaved(res.profile);
			onClose();
		} catch (err) {
			setError(
				err instanceof ApiError
					? err.message
					: "Gagal menyimpan data karier. Silakan coba lagi.",
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal open={open} onClose={onClose} title="Edit Data Karier">
			<div className="space-y-4">
				<div>
					<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
						Jabatan
					</label>
					<input
						type="text"
						value={role}
						onChange={(e) => setRole(e.target.value)}
						className="w-full text-sm text-neutral bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
					/>
				</div>
				<div>
					<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
						Lama Bekerja (bulan)
					</label>
					<input
						type="number"
						min={0}
						value={months}
						onChange={(e) => setMonths(e.target.value)}
						className="w-full text-sm text-neutral bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
					/>
				</div>
				{error && <p className="text-xs text-red-500 font-medium">{error}</p>}
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
